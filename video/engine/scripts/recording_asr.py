"""Transcribes a narrator's recording of a whole script with word timings (faster-whisper, CPU).

Called by import-recording.mjs, which caches the result by the recording's hash:

    python recording_asr.py --audio <wav> --out <json> [--model small] [--language es] [--prompt "..."]

Writes {model, language, prompt, durationMs, words: [{text, startMs, endMs}]}. The prompt
(names and acronyms from the script) nudges Whisper towards their spelling.
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


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--audio", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--model", default="small")
    p.add_argument("--language", default="es")
    p.add_argument("--prompt", default="")
    args = p.parse_args(argv)

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
    )
    collected = []
    for seg in segments:
        collected.append(seg)
        log(f"  [{seg.start:7.1f} s] {seg.text.strip()}")
    result = {
        "model": args.model,
        "language": args.language,
        "prompt": args.prompt,
        "durationMs": round(info.duration * 1000),
        "words": words_from_segments(collected),
    }
    Path(args.out).write_text(json.dumps(result, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    log(f"recording_asr: {len(result['words'])} words in {time.monotonic() - started:.0f} s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
