#!/usr/bin/env python3
"""Synthesise a lesson video's narration with edge-tts (one MP3 + word timings per segment).

    python -X utf8 video/engine/scripts/tts.py [--video SLUG] [--narration PATH] [--lexicon PATH]
        [--voice-dir DIR] [--tts-dir DIR] [--voice NAME] [--rate +0%] [--pitch +0Hz]
        [--only id,id] [--force] [--audition] [--input PATH]

The spoken text comes from Node (scripts/prepare-tts.mjs), the single source of
truth for the narration markup and the lexicon. Unless --input is given, this
script runs prepare-tts.mjs itself so the text is always current.

Per segment the result is cached: tts/<id>.json stores a key (sha256 of voice,
rate, pitch and spoken text); when it matches and the MP3 is intact the segment
is skipped. Output format: audio-24khz-48kbitrate-mono-mp3 (CBR, 6 bytes per ms).

Exit codes: 0 ok, 1 some segments failed (listed), 2 bad input or setup.
"""
from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import os
import random
import shutil
import subprocess
import sys
import time
from pathlib import Path

try:
    import aiohttp
    import edge_tts
    from edge_tts import exceptions as tts_exc
except ImportError as err:  # pragma: no cover - setup problem
    sys.stderr.write(f"tts.py: missing dependency ({err}). Install with: python -m pip install edge-tts\n")
    sys.exit(2)

SCRIPTS = Path(__file__).resolve().parent
VIDEOS = SCRIPTS.parent.parent  # video/


def defaults_for(slug: str) -> dict[str, Path]:
    """Default paths of video/<slug>/ (the same layout scripts/lib/paths.mjs uses)."""
    base = VIDEOS / slug
    return {
        "narration": base / "narration.json",
        "lexicon": base / "lexicon.json",
        "storyboard": base / "storyboard.json",
        "voice_dir": base / "public" / "voice",
        "tts_dir": base / "tts",
        "input": base / "out" / "tts-input.json",
        "audition_dir": base / ".audition",
    }


# Active video: --video on the command line, else $VIDEO, else "siem" (resolved in main()).
DEFAULTS = defaults_for(os.environ.get("VIDEO") or "siem")
AUDITION_VOICES = ["es-ES-ElviraNeural", "es-ES-AlvaroNeural", "es-ES-XimenaNeural"]
BYTES_PER_MS = 6  # 48 kbit/s CBR
PAUSE_BETWEEN_SEGMENTS_S = 0.6


class SynthesisError(Exception):
    """The service answered, but the result is unusable (no audio / no boundaries)."""


RETRYABLE = (
    SynthesisError,
    tts_exc.NoAudioReceived,
    tts_exc.WebSocketError,
    tts_exc.UnexpectedResponse,
    tts_exc.UnknownResponse,
    aiohttp.ClientError,
    asyncio.TimeoutError,
    TimeoutError,
    ConnectionError,
    OSError,
)


def tts_key(voice: str, rate: str, pitch: str, spoken: str) -> str:
    """Same string as ttsKey() in scripts/lib/narration.mjs (ttsKey)."""
    return hashlib.sha256(f"{voice}\n{rate}\n{pitch}\n{spoken}".encode("utf-8")).hexdigest()


def log(msg: str) -> None:
    print(msg, flush=True)


def write_atomic(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f"{path.name}.{os.getpid()}.tmp")
    with open(tmp, "wb") as fh:
        fh.write(data)
        fh.flush()
        os.fsync(fh.fileno())
    os.replace(tmp, path)


def find_node() -> str:
    node = os.environ.get("NODE") or shutil.which("node")
    if not node:
        raise SystemExit("tts.py: node not found (set NODE or run eval \"$(fnm env)\" first)")
    return node


def run_prepare(args: argparse.Namespace, out: Path) -> None:
    cmd = [
        find_node(),
        str(SCRIPTS / "prepare-tts.mjs"),
        "--narration", str(args.narration),
        "--lexicon", str(args.lexicon),
        "--storyboard", str(args.storyboard),
        "--out", str(out),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if res.stderr:
        sys.stderr.write(res.stderr)
    if res.returncode != 0:
        raise SystemExit(2)


def audition_text(lexicon: Path) -> dict:
    cmd = [find_node(), str(SCRIPTS / "prepare-tts.mjs"), "--audition", "--lexicon", str(lexicon)]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        sys.stderr.write(res.stderr)
        raise SystemExit(2)
    return json.loads(res.stdout)


async def with_retries(what: str, attempts: int, fn):
    for attempt in range(1, attempts + 1):
        try:
            return await fn()
        except RETRYABLE as err:
            if attempt == attempts:
                raise
            delay = 2 ** attempt + random.uniform(0, 1)
            log(f"    {what}: {type(err).__name__}: {err} — retry {attempt}/{attempts - 1} in {delay:.1f} s")
            await asyncio.sleep(delay)
    raise AssertionError("unreachable")


async def available_voices(attempts: int) -> set[str]:
    voices = await with_retries("list_voices", attempts, lambda: asyncio.wait_for(edge_tts.list_voices(), 60))
    return {v["ShortName"] for v in voices}


async def synthesize_once(text: str, voice: str, rate: str, pitch: str) -> tuple[bytes, list[dict]]:
    # A fresh Communicate per attempt: its stream() can only be consumed once.
    communicate = edge_tts.Communicate(
        text, voice, rate=rate, pitch=pitch, boundary="WordBoundary", connect_timeout=15, receive_timeout=60
    )
    audio = bytearray()
    words: list[dict] = []

    async def consume():
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio.extend(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append(
                    {
                        "text": chunk["text"],
                        "offsetMs": round(chunk["offset"] / 10_000, 2),
                        "durationMs": round(chunk["duration"] / 10_000, 2),
                    }
                )

    await asyncio.wait_for(consume(), timeout=120)
    if not audio:
        raise SynthesisError("no audio received")
    if not words:
        raise SynthesisError("no word boundaries received")
    return bytes(audio), words


async def synthesize(text: str, voice: str, rate: str, pitch: str, attempts: int, what: str):
    return await with_retries(what, attempts, lambda: synthesize_once(text, voice, rate, pitch))


def is_cached(json_path: Path, mp3_path: Path, key: str) -> bool:
    if not (json_path.is_file() and mp3_path.is_file()):
        return False
    try:
        meta = json.loads(json_path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return False
    return meta.get("key") == key and meta.get("bytes") == mp3_path.stat().st_size and bool(meta.get("words"))


async def run_segments(args: argparse.Namespace) -> int:
    input_path = Path(args.input) if args.input else DEFAULTS["input"]
    if not args.input:
        run_prepare(args, input_path)
    try:
        entries = json.loads(input_path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as err:
        log(f"tts.py: cannot read {input_path}: {err}")
        return 2
    if not isinstance(entries, list) or not entries:
        log(f"tts.py: {input_path} has no segments")
        return 2

    if args.only:
        wanted = [x.strip() for x in args.only.split(",") if x.strip()]
        known = {e["id"] for e in entries}
        unknown = [x for x in wanted if x not in known]
        if unknown:
            log(f"tts.py: --only names unknown segments: {', '.join(unknown)}")
            return 2
        entries = [e for e in entries if e["id"] in wanted]

    jobs = []
    for e in entries:
        voice = args.voice or e["voice"]
        rate = args.rate or e["rate"]
        pitch = args.pitch or e["pitch"]
        jobs.append({**e, "voice": voice, "rate": rate, "pitch": pitch, "key": tts_key(voice, rate, pitch, e["spoken"])})

    voice_dir = Path(args.voice_dir)
    tts_dir = Path(args.tts_dir)
    todo = []
    cached = 0
    for job in jobs:
        mp3 = voice_dir / f"{job['id']}.mp3"
        meta = tts_dir / f"{job['id']}.json"
        if not args.force and is_cached(meta, mp3, job["key"]):
            cached += 1
        else:
            todo.append((job, mp3, meta))
    log(f"tts.py: {len(jobs)} segments — {cached} cached, {len(todo)} to synthesise")
    if not todo:
        return 0

    try:
        voices = await available_voices(args.attempts)
    except RETRYABLE as err:
        log(f"tts.py: cannot list voices ({type(err).__name__}: {err}) — is the network available?")
        return 1
    missing = sorted({job["voice"] for job, _, _ in todo} - voices)
    if missing:
        log(f"tts.py: voice not available: {', '.join(missing)}")
        return 2

    failed = []
    started = time.monotonic()
    for n, (job, mp3, meta) in enumerate(todo, 1):
        if n > 1:
            await asyncio.sleep(PAUSE_BETWEEN_SEGMENTS_S)
        try:
            audio, words = await synthesize(job["spoken"], job["voice"], job["rate"], job["pitch"], args.attempts, job["id"])
        except RETRYABLE as err:
            log(f"  [{n}/{len(todo)}] {job['id']}: FAILED — {type(err).__name__}: {err}")
            failed.append(job["id"])
            continue
        duration_ms = round(len(audio) / BYTES_PER_MS, 1)
        write_atomic(mp3, audio)
        record = {
            "key": job["key"],
            "voice": job["voice"],
            "rate": job["rate"],
            "pitch": job["pitch"],
            "spoken": job["spoken"],
            "bytes": len(audio),
            "durationMs": duration_ms,
            "words": words,
        }
        write_atomic(meta, (json.dumps(record, ensure_ascii=False, indent=1) + "\n").encode("utf-8"))
        last_end = max(w["offsetMs"] + w["durationMs"] for w in words)
        log(
            f"  [{n}/{len(todo)}] {job['id']}: {duration_ms / 1000:.2f} s, {len(words)} boundaries, "
            f"speech ends {last_end / 1000:.2f} s"
        )
    log(f"tts.py: done in {time.monotonic() - started:.1f} s")
    if failed:
        log(f"tts.py: {len(failed)} segment(s) failed: {', '.join(failed)}")
        return 1
    return 0


async def run_audition(args: argparse.Namespace) -> int:
    paragraph = audition_text(Path(args.lexicon))
    voices = list(AUDITION_VOICES)
    if args.voice and args.voice not in voices:
        voices.append(args.voice)
    try:
        available = await available_voices(args.attempts)
    except RETRYABLE as err:
        log(f"tts.py: cannot list voices ({type(err).__name__}: {err})")
        return 1
    out_dir = Path(args.audition_dir)
    failed = []
    for n, voice in enumerate(voices):
        if voice not in available:
            log(f"  {voice}: not available, skipped")
            failed.append(voice)
            continue
        if n:
            await asyncio.sleep(PAUSE_BETWEEN_SEGMENTS_S)
        try:
            audio, _ = await synthesize(paragraph["spoken"], voice, args.rate or "+0%", args.pitch or "+0Hz", args.attempts, voice)
        except RETRYABLE as err:
            log(f"  {voice}: FAILED — {type(err).__name__}: {err}")
            failed.append(voice)
            continue
        path = out_dir / f"{voice}.mp3"
        write_atomic(path, audio)
        log(f"  {voice}: {len(audio) / BYTES_PER_MS / 1000:.1f} s -> {path}")
    notes = [
        "Audición de voces — SIEM en acción",
        "",
        "Texto mostrado:",
        paragraph["display"],
        "",
        "Texto enviado a la voz:",
        paragraph["spoken"],
        "",
        "Léxico (término -> pronunciación):",
        *[f"  {k} -> {v}" for k, v in paragraph["terms"]],
        "",
    ]
    write_atomic(out_dir / "audition.txt", "\n".join(notes).encode("utf-8"))
    log(f"tts.py: audition text -> {out_dir / 'audition.txt'}")
    return 1 if failed else 0


def main(argv: list[str] | None = None) -> int:
    global DEFAULTS
    pre = argparse.ArgumentParser(add_help=False)
    pre.add_argument("--video")
    known, _ = pre.parse_known_args(argv)
    if known.video:
        os.environ["VIDEO"] = known.video  # prepare-tts.mjs, run as a child, reads it too
        DEFAULTS = defaults_for(known.video)
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--video", help="video folder under video/ (default: $VIDEO or siem)")
    p.add_argument("--narration", default=str(DEFAULTS["narration"]))
    p.add_argument("--lexicon", default=str(DEFAULTS["lexicon"]))
    p.add_argument("--storyboard", default=str(DEFAULTS["storyboard"]))
    p.add_argument("--input", help="use this tts-input.json instead of running prepare-tts.mjs")
    p.add_argument("--voice-dir", default=str(DEFAULTS["voice_dir"]))
    p.add_argument("--tts-dir", default=str(DEFAULTS["tts_dir"]))
    p.add_argument("--audition-dir", default=str(DEFAULTS["audition_dir"]))
    p.add_argument("--voice", help="override narration.json voice (build-timeline needs the same --voice)")
    p.add_argument("--rate", help='override narration.json rate, e.g. "+5%%"')
    p.add_argument("--pitch", help='override narration.json pitch, e.g. "+0Hz"')
    p.add_argument("--only", help="comma-separated segment ids")
    p.add_argument("--force", action="store_true", help="ignore the cache")
    p.add_argument("--audition", action="store_true", help="synthesise the test paragraph in three voices")
    p.add_argument("--attempts", type=int, default=5, help="attempts per request (backoff 2, 4, 8, 16 s + jitter)")
    args = p.parse_args(argv)
    if args.attempts < 1:
        p.error("--attempts must be >= 1")
    runner = run_audition if args.audition else run_segments
    return asyncio.run(runner(args))


if __name__ == "__main__":
    sys.exit(main())
