"""Transcribes a narrator's recording of a whole script with word timings (faster-whisper, CPU).

Called by import-recording.mjs, which caches the result by the recording's hash:

    python recording_asr.py --audio <wav> --out <json> [--model small] [--language es] [--prompt "..."] [--clips 27,346]

Writes {model, language, prompt, clips, durationMs, words: [{text, startMs, endMs}]}. The prompt
(names and acronyms from the script) nudges Whisper towards their spelling. --clips (start,end pairs in
seconds) is all Whisper hears: the Node side leaves the long silences out (asrClips in lib/recording.mjs),
and the timestamps stay in the recording's time. Without it, the whole file.
Models are cached under $HF_HOME (the Node side points it at video/engine/.cache/huggingface).
"""
import argparse
import json
import sys
import time
from pathlib import Path


def log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)


def words_from_segments(segments) -> list[dict]:
    """faster-whisper segments -> one {text, startMs, endMs} per non-blank word, in order."""
    words = []
    for seg in segments:
        for w in seg.words or []:
            text = w.word.strip()
            if text:
                words.append({"text": text, "startMs": round(w.start * 1000), "endMs": round(w.end * 1000)})
    return words


def parse_clips(spec: str | None) -> list[float] | None:
    """'27,346' (start,end pairs in seconds, in order) -> [27.0, 346.0]; nothing -> None (the whole file)."""
    if not spec or not spec.strip():
        return None
    edges = [float(x) for x in spec.split(",")]
    if len(edges) % 2 or any(b <= a for a, b in zip(edges, edges[1:])):
        raise ValueError(f"--clips must be start,end pairs of seconds in increasing order (got {spec!r})")
    return edges


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--audio", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--model", default="small")
    p.add_argument("--language", default="es")
    p.add_argument("--prompt", default="")
    p.add_argument("--clips", default="")
    args = p.parse_args(argv)
    clips = parse_clips(args.clips)

    from faster_whisper import WhisperModel

    started = time.monotonic()
    log(f"recording_asr: loading whisper {args.model} on CPU…")
    model = WhisperModel(args.model, device="cpu", compute_type="int8", cpu_threads=4)
    segments, info = model.transcribe(
        args.audio,
        language=args.language,
        word_timestamps=True,
        vad_filter=False,  # keep every word: the Node side decides what belongs to the script
        condition_on_previous_text=False,  # a misheard sentence must not drag the next one along
        initial_prompt=args.prompt or None,
        # only the stretches between long silences; without clips, the call is the same as before they existed
        **({"clip_timestamps": clips} if clips else {}),
    )
    collected = []
    for seg in segments:
        collected.append(seg)
        log(f"  [{seg.start:7.1f} s] {seg.text.strip()}")
    result = {
        "model": args.model,
        "language": args.language,
        "prompt": args.prompt,
        "clips": [{"startMs": round(a * 1000), "endMs": round(b * 1000)} for a, b in zip(clips[::2], clips[1::2])] if clips else None,
        "durationMs": round(info.duration * 1000),
        "words": words_from_segments(collected),
    }
    Path(args.out).write_text(json.dumps(result, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    log(f"recording_asr: {len(result['words'])} words in {time.monotonic() - started:.0f} s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
