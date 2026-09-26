#!/usr/bin/env python3
"""Chatterbox synthesis worker (run by tts-chatterbox.mjs with the engine's venv).

    python -X utf8 video/engine/scripts/chatterbox_worker.py --jobs <file.jobs.json>

The job file names the model pack, the reference clip (or null for the built-in
voice), the synthesis settings and a list of {id, text, seed[, exaggeration, cfgWeight]}.
For every job that succeeds the worker writes into outDir:

    <id>.wav   mono PCM at the model's sample rate (Chatterbox embeds its Perth watermark)
    <id>.json  {id, sampleRate, durationMs, seed, takes, score, asrText, words:[{text,startMs,endMs}]}

Chatterbox returns no timings, so each take is transcribed with faster-whisper:
the transcript's word timestamps become the clip's word boundaries, and its
similarity to the script (0-1, see script_score) decides whether the take is
kept. A take below minScore is synthesised again with another seed, up to
`attempts` takes; the best one wins. A job whose every take comes back with no
words at all is logged and skipped — neither file above is written for it —
and the run moves on to the next job instead of aborting; the exit status is 1
if any job was skipped this way (their ids are logged), else 0.

Models are cached under $HF_HOME (the Node side points it at
video/engine/.cache/huggingface so nothing lands on C:).
"""
from __future__ import annotations

import argparse
import json
import os
import random
import sys
import time
from pathlib import Path

from chatterbox_text import script_score

BASE_REPO = "ResembleAI/chatterbox"
ES_ES_REPO = "ResembleAI/Chatterbox-Multilingual-es-es"
SEED_STEP = 7919  # seed offset between retakes of the same segment


def log(msg: str) -> None:
    print(msg, flush=True)


SAFETENSORS_DTYPES = {
    "F64": "float64", "F32": "float32", "F16": "float16", "BF16": "bfloat16",
    "I64": "int64", "I32": "int32", "I16": "int16", "I8": "int8", "U8": "uint8", "BOOL": "bool",
}


def stream_safetensors_into(module, path: Path) -> None:
    """
    Loads a .safetensors file into an already-built module one tensor at a time,
    reading with plain file I/O. safetensors.load_file() maps the whole file
    copy-on-write, which Windows charges in full against the commit limit on top
    of the module's own weights: on a busy 16 GB machine that fails with
    "El archivo de paginación es demasiado pequeño" (os error 1455).
    """
    import struct

    import torch

    target = module.state_dict()  # tensors share storage with the module's parameters
    with open(path, "rb") as fh:
        header_len = struct.unpack("<Q", fh.read(8))[0]
        header = json.loads(fh.read(header_len))
        header.pop("__metadata__", None)
        params = {name for name, _ in module.named_parameters()}
        missing = sorted(set(target) - set(header))
        unexpected = sorted(set(header) - set(target))
        # A buffer the module computes when it is built (e.g. an STFT window) may be absent
        # from the file and keeps its initial value; a missing weight is always an error.
        missing_params = [k for k in missing if k in params]
        if missing_params or unexpected:
            raise KeyError(f"{path.name}: {len(missing_params)} missing weights {missing_params[:5]}, {len(unexpected)} unexpected {unexpected[:5]}")
        if missing:
            log(f"chatterbox: {path.name}: keeping the built-in value of {', '.join(missing)}")
        base = 8 + header_len
        for name, info in sorted(header.items(), key=lambda kv: kv[1]["data_offsets"][0]):
            start, stop = info["data_offsets"]
            dtype = getattr(torch, SAFETENSORS_DTYPES[info["dtype"]])
            fh.seek(base + start)
            raw = bytearray(fh.read(stop - start))
            tensor = torch.frombuffer(raw, dtype=dtype).reshape(info["shape"]) if raw else torch.empty(info["shape"], dtype=dtype)
            with torch.no_grad():
                target[name].copy_(tensor)
            del raw, tensor


def build_multilingual(files: dict[str, Path], device: str = "cpu"):
    """
    ChatterboxMultilingualTTS.from_local() with explicit files and a low memory peak.
    chatterbox-tts 0.1.7 hard-codes the v2 T3 there; the Spain-Spanish pack ships
    its own T3 and decoder.
    """
    import torch
    from chatterbox.models.s3gen import S3Gen
    from chatterbox.models.t3 import T3
    from chatterbox.models.t3.modules.t3_config import T3Config
    from chatterbox.models.tokenizers import MTLTokenizer
    from chatterbox.models.voice_encoder import VoiceEncoder
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS, Conditionals

    ve = VoiceEncoder()
    stream_safetensors_into(ve, files["ve"])
    ve.to(device).eval()
    t3 = T3(T3Config.multilingual())
    stream_safetensors_into(t3, files["t3"])
    t3.to(device).eval()
    s3gen = S3Gen()
    stream_safetensors_into(s3gen, files["s3gen"])
    s3gen.to(device).eval()
    tokenizer = MTLTokenizer(str(files["tokenizer"]))
    conds = Conditionals.load(files["conds"], map_location=torch.device("cpu")).to(device) if files.get("conds") else None
    return ChatterboxMultilingualTTS(t3, s3gen, ve, tokenizer, device, conds=conds)


# Model files per pack. The Spain-Spanish pack's decoder and tokenizer are paired with its
# T3; there is no silent fallback to the base ones.
PACKS = {
    "mtl": {
        "ve": (BASE_REPO, "ve.safetensors"),
        "conds": (BASE_REPO, "conds.pt"),
        "t3": (BASE_REPO, "t3_mtl23ls_v2.safetensors"),
        "s3gen": (BASE_REPO, "s3gen.safetensors"),
        "tokenizer": (BASE_REPO, "grapheme_mtl_merged_expanded_v1.json"),
    },
    "es-es": {
        "ve": (BASE_REPO, "ve.safetensors"),
        "conds": (BASE_REPO, "conds.pt"),
        "t3": (ES_ES_REPO, "t3_es_es.safetensors"),
        "s3gen": (ES_ES_REPO, "s3gen_v3.safetensors"),
        "tokenizer": (ES_ES_REPO, "grapheme_mtl_merged_expanded_v1.json"),
    },
}


def load_tts(pack: str):
    import torch
    from huggingface_hub import hf_hub_download

    if pack not in PACKS:
        raise ValueError(f"unknown Chatterbox pack {pack!r} ({' | '.join(PACKS)})")
    torch.set_grad_enabled(False)
    files = {role: Path(hf_hub_download(repo, name)) for role, (repo, name) in PACKS[pack].items()}
    return build_multilingual(files)


def seed_everything(seed: int) -> None:
    import numpy as np
    import torch

    random.seed(seed)
    np.random.seed(seed % 2**32)
    torch.manual_seed(seed)


def job_settings(spec: dict, job: dict) -> tuple[float, float]:
    """exaggeration and cfg_weight of one job: its own (the segment's mood register), else the run's.

    generate() rebuilds conds.t3.emotion_adv whenever exaggeration changes between calls
    (chatterbox-tts 0.1.7, mtl_tts.py), so no conditionals need preparing again.
    """
    return float(job.get("exaggeration", spec["exaggeration"])), float(job.get("cfgWeight", spec["cfgWeight"]))


def transcribe(asr, wav_path: Path, language: str) -> tuple[str, list[dict]]:
    segments, _info = asr.transcribe(
        str(wav_path),
        language=language,
        word_timestamps=True,
        beam_size=5,
        condition_on_previous_text=False,
        vad_filter=False,
    )
    words: list[dict] = []
    texts: list[str] = []
    for seg in segments:
        texts.append(seg.text.strip())
        for w in seg.words or []:
            text = w.word.strip()
            if text:
                words.append({"text": text, "startMs": round(w.start * 1000, 1), "endMs": round(w.end * 1000, 1)})
    return " ".join(texts).strip(), words


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--jobs", required=True, help="job file written by tts-chatterbox.mjs")
    args = p.parse_args(argv)
    spec = json.loads(Path(args.jobs).read_text(encoding="utf-8"))
    out_dir = Path(spec["outDir"])
    out_dir.mkdir(parents=True, exist_ok=True)

    import soundfile as sf
    from faster_whisper import WhisperModel

    started = time.monotonic()
    log(f"chatterbox: loading {spec['pack']} on CPU…")
    tts = load_tts(spec["pack"])
    asr = WhisperModel(spec.get("asrModel", "small"), device="cpu", compute_type="int8")
    log(f"chatterbox: models ready in {time.monotonic() - started:.0f} s — {len(spec['jobs'])} clip(s)")
    voice_ref = spec.get("voiceRef")
    if voice_ref:
        tts.prepare_conditionals(voice_ref, exaggeration=spec["exaggeration"])
        voice_ref = None  # conditionals are cached on the model; generate() must not recompute them

    attempts = max(1, int(spec.get("attempts", 3)))
    min_score = float(spec.get("minScore", 0.85))
    failed: list[str] = []
    for n, job in enumerate(spec["jobs"], 1):
        t0 = time.monotonic()
        best = None
        exaggeration, cfg_weight = job_settings(spec, job)
        for take in range(attempts):
            seed = int(job["seed"]) + take * SEED_STEP
            seed_everything(seed)
            wav = tts.generate(
                job["text"],
                language_id=spec.get("language", "es"),
                audio_prompt_path=voice_ref,
                exaggeration=exaggeration,
                cfg_weight=cfg_weight,
                temperature=spec["temperature"],
            )
            audio = wav.squeeze(0).detach().cpu().numpy()
            tmp = out_dir / f"{job['id']}.take{take}.wav"
            sf.write(tmp, audio, tts.sr, subtype="PCM_16")
            asr_text, words = transcribe(asr, tmp, spec.get("language", "es"))
            score = script_score(job["text"], asr_text)
            cand = {"take": take, "seed": seed, "score": score, "asrText": asr_text, "words": words, "file": tmp, "samples": len(audio)}
            if best is None or score > best["score"]:
                if best is not None:
                    best["file"].unlink(missing_ok=True)
                best = cand
            else:
                tmp.unlink(missing_ok=True)
            if score >= min_score and words:
                break
            if take + 1 < attempts:
                log(f"    {job['id']}: take {take + 1} matches the script at {score:.2f} (< {min_score}) — retrying")
        if not best["words"]:
            log(f"chatterbox: {job['id']}: whisper found no words in any take — skipping it, {len(spec['jobs']) - n} job(s) left")
            best["file"].unlink(missing_ok=True)  # the best take's leftover .takeN.wav; nothing else of this job was written
            failed.append(job["id"])
            continue
        os.replace(best["file"], out_dir / f"{job['id']}.wav")
        duration_ms = best["samples"] / tts.sr * 1000
        result = {
            "id": job["id"],
            "sampleRate": tts.sr,
            "durationMs": round(duration_ms, 1),
            "seed": best["seed"],
            "takes": best["take"] + 1 if best["score"] >= min_score else attempts,
            "score": round(best["score"], 4),
            "asrText": best["asrText"],
            "words": best["words"],
        }
        (out_dir / f"{job['id']}.json").write_text(json.dumps(result, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        log(
            f"  [{n}/{len(spec['jobs'])}] {job['id']}: {duration_ms / 1000:.2f} s audio, match {best['score']:.2f}, "
            f"{len(best['words'])} words, {time.monotonic() - t0:.0f} s"
        )
    if failed:
        log(f"chatterbox: done in {time.monotonic() - started:.0f} s — {len(failed)} job(s) failed: {', '.join(failed)}")
        return 1
    log(f"chatterbox: done in {time.monotonic() - started:.0f} s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
