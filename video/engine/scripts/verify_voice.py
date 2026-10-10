"""Measures every narration clip as it will sound in the video, for verify-voice.mjs.

    python verify_voice.py --jobs jobs.json --out results.json [--model small]

jobs.json: [{"id", "path", "playMs"}]. For each clip, only the part the video plays (0..playMs) is transcribed
(faster-whisper, word timestamps on, no VAD so nothing is skipped), and three energies are measured relative
to the played part's RMS: the first 30 ms (a clip that starts loud was cut inside a word), the last 30 ms before
playMs (one that stops loud is cut there) and the 150 ms after playMs (voice the video never plays).

Two more things are measured because Whisper drops the first words of a retake and stretches the word before it
over them (V19 s03-03: «disco» lasted 2.2 s and hid a half-said sentence followed by the full one): the voiced
runs that no word covers (`unheard`) and the silences inside the voice (`gaps`), both in seconds from the clip start,
plus every word's span (`words`).
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


FRAME = 0.02


def voiced_mask(played):
    """20 ms frames above (speech level - 30 dB): the voice, with breaths and room tone left out."""
    n = int(FRAME * SR)
    if len(played) < n * 3:
        return np.zeros(0, dtype=bool)
    frames = played[: len(played) // n * n].reshape(-1, n)
    db = 20 * np.log10(np.sqrt((frames ** 2).mean(axis=1)) + 1e-9)
    level = float(np.percentile(db, 90))
    return db > level - 30.0


def runs(mask, want):
    """[(start_s, length_s)] of the runs where mask == want."""
    out, run = [], 0
    for i, x in enumerate(list(mask) + [not want]):
        if x == want:
            run += 1
        elif run:
            out.append((round((i - run) * FRAME, 2), round(run * FRAME, 2)))
            run = 0
    return out


def unheard_and_gaps(played, words):
    mask = voiced_mask(played)
    if not len(mask):
        return [], []
    covered = np.zeros(len(mask), dtype=bool)
    for w in words:
        a = int(max(0.0, w["start"] - 0.15) / FRAME)
        b = int((w["end"] + 0.15) / FRAME) + 1
        covered[a:b] = True
    unheard = [r for r in runs(mask & ~covered, True) if r[1] >= 0.3]
    voiced = np.where(mask)[0]
    gaps = []
    if len(voiced):
        inner = mask[voiced[0] : voiced[-1] + 1]
        gaps = [(round(s + voiced[0] * FRAME, 2), l) for s, l in runs(inner, False) if l >= 0.45]
    return unheard, gaps


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
        segs, _ = model.transcribe(y[:play], language="es", beam_size=5, vad_filter=False, condition_on_previous_text=False, word_timestamps=True)
        segs = list(segs)
        heard = " ".join(s.text.strip() for s in segs).strip()
        words = [{"text": w.word.strip(), "start": round(w.start, 2), "end": round(w.end, 2)} for s in segs for w in (s.words or [])]
        unheard, gaps = unheard_and_gaps(y[:play], words)
        results.append({"id": job["id"], "v": 2, "heard": heard, "head": round(head, 3), "tail": round(tail, 3), "dropped": round(dropped, 3),
                        "words": words, "unheard": unheard, "gaps": gaps})
        extra = (f" unheard {unheard}" if unheard else "") + (f" gaps {gaps}" if gaps else "")
        print(f"verify_voice: {job['id']} head {head:.2f} tail {tail:.2f} dropped {dropped:.2f}{extra} | {heard}", flush=True)
    json.dump(results, open(args.out, "w", encoding="utf8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
