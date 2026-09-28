"""Program master of a rendered lesson video: an ambient bed under the mix, delivery loudness, true-peak limit.

    python video/engine/scripts/master_mix.py --video-in out/x.mp4 --timeline src/timeline.json --out out/x-master.mp4
        [--target -14] [--ceiling -1] [--bed-db 0] [--no-bed] [--ffmpeg <exe>] [--excerpt 40:80 --excerpt-out x.wav]

1. Takes the rendered MP4's audio (narration + adversary voice + sound effects, as Remotion mixed them).
2. Adds an ambient bed generated here (no samples, no licences): a soft dark pad with one chord per
   chapter, crossfaded at each chapter change, over a very low room tone. It sits ~20 LU under the
   voice and ducks 6 dB more whenever someone speaks (the timeline says when), so it mostly fills
   the pauses, think prompts and transitions. Fades in at the start and out on the end card.
3. Sets the integrated loudness to --target (YouTube: -14 LUFS) and limits true peaks to --ceiling
   (4x oversampled detection, no latency, so audio and video stay in sync).
4. Remuxes: the video stream is copied untouched, the audio re-encoded as AAC 192 kbps.
"""
import argparse
import json
import os
import subprocess
import tempfile

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from pedalboard import Pedalboard, Reverb
from scipy import signal
from scipy.ndimage import minimum_filter1d

SR = 48000
# One chord per chapter (D minor colour): Dm7, Bbmaj7, Gm9, Asus4, Dm(add9). Low register, under the voice.
CHORDS = [
    [73.42, 110.00, 174.61, 261.63],
    [58.27, 87.31, 146.83, 220.00],
    [98.00, 146.83, 233.08, 220.00 * 2],
    [55.00, 82.41, 146.83, 164.81],
    [73.42, 110.00, 174.61, 329.63],
]


def lfo(t, rate, phase, depth):
    return 1.0 + depth * np.sin(2 * np.pi * rate * t + phase)


def pad(chord, t, rng):
    """Additive pad: soft saw-like partials, slowly breathing, a little detuned left/right."""
    out = np.zeros((len(t), 2))
    for note in chord:
        for ch, detune in enumerate((0.9985, 1.0015)):
            for h in range(1, 7):
                amp = (1.0 / h ** 1.6) * lfo(t, rng.uniform(0.02, 0.09), rng.uniform(0, 6.3), 0.35)
                out[:, ch] += amp * np.sin(2 * np.pi * note * detune * h * t + rng.uniform(0, 6.3))
    # Keep it dark: nothing bright competes with the voice's presence band.
    return signal.sosfiltfilt(signal.butter(2, 900, btype="low", fs=SR, output="sos"), out, axis=0)


def room_tone(n, rng):
    white = rng.standard_normal((n, 2))
    brown = np.cumsum(white, axis=0)
    brown -= signal.sosfiltfilt(signal.butter(1, 5, btype="low", fs=SR, output="sos"), brown, axis=0)
    brown = signal.sosfiltfilt(signal.butter(2, 400, btype="low", fs=SR, output="sos"), brown, axis=0)
    hiss = signal.sosfiltfilt(signal.butter(2, [200, 2500], btype="band", fs=SR, output="sos"), white, axis=0)
    return brown / np.std(brown) + 0.25 * hiss / np.std(hiss)


def chapter_starts(timeline):
    fps = timeline["fps"]
    starts, prev = [], None
    for s in timeline["scenes"]:
        if s["chapter"] != prev:
            starts.append(s["from"] / fps)
            prev = s["chapter"]
    return starts


def speech_mask(timeline, n):
    """1 where the narrator or the adversary speaks (with 150 ms margins), 0 elsewhere."""
    fps = timeline["fps"]
    mask = np.zeros(n)
    spans = [(seg["from"], seg["from"] + seg.get("audioFrames", seg["durationInFrames"])) for seg in timeline["segments"]]
    for i in timeline.get("intercept", []):
        if "audioFrom" in i:
            spans.append((i["audioFrom"], i["audioFrom"] + i["audioFrames"]))
    for a, b in spans:
        mask[max(0, int((a / fps - 0.15) * SR)) : min(n, int((b / fps + 0.15) * SR))] = 1.0
    return mask


def smooth(x, ms):
    """Centred moving average via a cumulative sum: O(n), whatever the window."""
    k = max(1, int(SR * ms / 1000))
    c = np.concatenate([[0.0], np.cumsum(x)])
    lo = np.clip(np.arange(len(x)) - k // 2, 0, len(x))
    hi = np.clip(np.arange(len(x)) + k - k // 2, 0, len(x))
    return (c[hi] - c[lo]) / (hi - lo)


def ambient_bed(timeline, n, seed=7):
    rng = np.random.default_rng(seed)
    t = np.arange(n) / SR
    starts = chapter_starts(timeline) + [n / SR]
    bed = np.zeros((n, 2))
    xfade = 3.0
    for k in range(len(starts) - 1):
        a = max(0.0, starts[k] - xfade / 2)
        b = min(n / SR, starts[k + 1] + xfade / 2)
        i0, i1 = int(a * SR), int(b * SR)
        env = np.ones(i1 - i0)
        ramp = int(xfade * SR)
        if k > 0:
            env[:ramp] = np.sin(np.linspace(0, np.pi / 2, ramp)) ** 2
        if k < len(starts) - 2:
            env[-ramp:] = np.cos(np.linspace(0, np.pi / 2, ramp)) ** 2
        bed[i0:i1] += pad(CHORDS[k % len(CHORDS)], t[i0:i1], rng) * env[:, None]
    bed = bed / (np.max(np.abs(bed)) + 1e-9)
    bed += 0.18 * room_tone(n, rng) / 4
    bed = Pedalboard([Reverb(room_size=0.9, damping=0.6, wet_level=0.45, dry_level=0.7, width=1.0)])(
        bed.T.astype(np.float32), SR
    ).T.astype(np.float64)
    fade = np.ones(n)
    fin, fout = int(2.0 * SR), int(4.0 * SR)
    fade[:fin] = np.linspace(0, 1, fin)
    fade[-fout:] = np.linspace(1, 0, fout)
    return bed * fade[:, None]


def limit(x, ceiling_db, release_ms=60.0):
    """True-peak limiter without latency: peaks detected 4x oversampled, gain looks ahead/behind 1.5 ms."""
    ceiling = 10 ** (ceiling_db / 20)
    up = np.max(np.abs(signal.resample_poly(x, 4, 1, axis=0)), axis=1)
    peak = up.reshape(-1, 4).max(axis=1)[: len(x)]
    need = np.minimum(1.0, ceiling / (peak + 1e-12))
    gain = minimum_filter1d(need, size=2 * int(0.0015 * SR) + 1)
    r = np.exp(-1.0 / (SR * release_ms / 1000))
    out = np.empty_like(gain)
    g = 1.0
    for i, target in enumerate(gain):
        g = target if target < g else r * g + (1 - r) * target
        out[i] = g
    return x * out[:, None], 20 * np.log10(out)


def true_peak_db(x):
    return 20 * np.log10(np.max(np.abs(signal.resample_poly(x, 4, 1, axis=0))) + 1e-12)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video-in", required=True)
    ap.add_argument("--timeline", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--target", type=float, default=-14.0)
    ap.add_argument("--ceiling", type=float, default=-1.0)
    ap.add_argument("--bed-db", type=float, default=0.0, help="raise/lower the ambient bed from its default level")
    ap.add_argument("--no-bed", action="store_true")
    ap.add_argument("--ffmpeg", default="node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe")
    ap.add_argument("--excerpt", help="start:end seconds of the master to also write as WAV")
    ap.add_argument("--excerpt-out")
    args = ap.parse_args()

    args.ffmpeg = os.path.abspath(args.ffmpeg)  # Windows won't run a relative path with forward slashes
    timeline = json.load(open(args.timeline, encoding="utf8"))
    meter = pyln.Meter(SR)
    with tempfile.TemporaryDirectory() as tmp:
        raw = os.path.join(tmp, "program.wav")
        subprocess.run([args.ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", args.video_in, "-vn", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le", raw], check=True)
        prog, _ = sf.read(raw, always_2d=True)
        n = len(prog)
        prog_lufs = meter.integrated_loudness(prog)
        print(f"master_mix: program {prog_lufs:.1f} LUFS, true peak {true_peak_db(prog):.1f} dBTP, {n / SR:.1f} s")

        mix = prog.copy()
        if not args.no_bed:
            bed = ambient_bed(timeline, n)
            # Bed ~20 LU under the program, then 6 dB lower while anyone speaks.
            bed *= 10 ** ((prog_lufs - 20 + args.bed_db - meter.integrated_loudness(bed)) / 20)
            duck = 10 ** (-6 * smooth(speech_mask(timeline, n), 250) / 20)
            bed *= duck[:, None]
            print(f"  bed: {meter.integrated_loudness(bed):.1f} LUFS ({meter.integrated_loudness(bed) - prog_lufs:+.1f} LU vs program)")
            mix = prog + bed

        mix *= 10 ** ((args.target - meter.integrated_loudness(mix)) / 20)
        mix, gr = limit(mix, args.ceiling)
        active = gr < -0.1
        print(
            f"  master: {meter.integrated_loudness(mix):.1f} LUFS, true peak {true_peak_db(mix):.1f} dBTP, "
            f"limiter active {100 * active.mean():.2f}% of the time, max {-gr.min():.1f} dB"
        )
        mastered = os.path.join(tmp, "master.wav")
        sf.write(mastered, mix, SR, subtype="PCM_24")
        subprocess.run(
            [args.ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", args.video_in, "-i", mastered,
             "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", args.out],
            check=True,
        )
        print(f"  -> {args.out}")
        if args.excerpt and args.excerpt_out:
            a, b = (float(v) for v in args.excerpt.split(":"))
            sf.write(args.excerpt_out, mix[int(a * SR) : int(b * SR)], SR, subtype="PCM_16")
            print(f"  excerpt {a:.0f}-{b:.0f} s -> {args.excerpt_out}")


if __name__ == "__main__":
    main()
