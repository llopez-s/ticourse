"""Measures every narration clip as it will sound in the video, for verify-voice.mjs.

    python verify_voice.py --jobs jobs.json --out results.json [--model small]

jobs.json: [{"id", "path", "playMs"}]. For each clip, only the part the video plays (0..playMs) is transcribed
(faster-whisper, word timestamps off, no VAD so nothing is skipped), and three energies are measured relative
to the played part's RMS: the first 30 ms (a clip that starts loud was cut inside a word), the last 30 ms before
playMs (one that stops loud is cut there) and the 150 ms after playMs (voice the video never plays).
"""
import argparse
import json

import librosa
import numpy as np
from faster_whisper import WhisperModel

SR = 16000


def energies(y, play):
    played = y[:play]
    rms = float(np.sqrt(np.mean(played ** 2)) + 1e-9)
    edge = int(0.03 * SR)
    head = float(np.sqrt(np.mean(played[:edge] ** 2))) / rms if len(played) else 0.0
    tail = float(np.sqrt(np.mean(played[-edge:] ** 2))) / rms if len(played) else 0.0
    after = y[play : play + int(0.15 * SR)]
    dropped = float(np.sqrt(np.mean(after ** 2))) / rms if len(after) else 0.0
    return head, tail, dropped


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--jobs", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="small")
    args = ap.parse_args()
    jobs = json.load(open(args.jobs, encoding="utf8"))
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    results = []
    for job in jobs:
        y, _ = librosa.load(job["path"], sr=SR, mono=True)
        play = min(len(y), int(job["playMs"] / 1000 * SR))
        head, tail, dropped = energies(y, play)
        segs, _ = model.transcribe(y[:play], language="es", beam_size=5, vad_filter=False, condition_on_previous_text=False)
        heard = " ".join(s.text.strip() for s in segs).strip()
        results.append({"id": job["id"], "heard": heard, "head": round(head, 3), "tail": round(tail, 3), "dropped": round(dropped, 3)})
        print(f"verify_voice: {job['id']} head {head:.2f} tail {tail:.2f} dropped {dropped:.2f} | {heard}", flush=True)
    json.dump(results, open(args.out, "w", encoding="utf8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
