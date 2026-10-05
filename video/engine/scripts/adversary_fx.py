"""Effect presets for the adversary's voice (tts-adversary.mjs):

    python adversary_fx.py --in <wav> --out <wav> [--preset machine|telefono]

machine: 4 semitones down, ring modulation (0.6 + 0.4 sin 2π·48·t) and a 120–5000 Hz band-pass; same length,
peak at -1 dBFS.
telefono: a narrowband phone call, no pitch shift and no ring modulation: soft tanh saturation (drive 3), a
faint seeded line hiss (-50 dB), then a zero-phase order-6 Butterworth band-pass between 300 and 3400 Hz
(saturation and hiss go in before the filter, so nothing they add leaks out of the band); same length, peak at
-1 dBFS, deterministic. Added so RED MARROW does not sound like PAPER CRANE (same Laura voice, machine).
"""
import argparse
import sys

import librosa
import numpy as np
import soundfile as sf
from scipy import signal


def machine(y, sr):
    low = librosa.effects.pitch_shift(np.asarray(y, dtype=np.float32), sr=sr, n_steps=-4)
    t = np.arange(len(low)) / sr
    ringed = low * (0.6 + 0.4 * np.sin(2 * np.pi * 48 * t))
    out = signal.sosfilt(signal.butter(4, [120, 5000], btype="bandpass", fs=sr, output="sos"), ringed)
    return out / (np.max(np.abs(out)) + 1e-12) * 10 ** (-1 / 20)


def telefono(y, sr):
    x = np.asarray(y, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-12)
    drive = 3.0
    x = np.tanh(drive * x) / np.tanh(drive)
    x = x + 10 ** (-50 / 20) * np.random.default_rng(578).standard_normal(len(x))
    hi = min(3400.0, 0.45 * sr)
    out = signal.sosfiltfilt(signal.butter(6, [300, hi], btype="bandpass", fs=sr, output="sos"), x)
    return out / (np.max(np.abs(out)) + 1e-12) * 10 ** (-1 / 20)


PRESETS = {"machine": machine, "telefono": telefono}


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--in", dest="src", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--preset", default="machine", choices=sorted(PRESETS))
    args = p.parse_args(argv)
    y, sr = librosa.load(args.src, sr=None, mono=True)
    sf.write(args.out, PRESETS[args.preset](y, sr), sr, subtype="PCM_16")
    return 0


if __name__ == "__main__":
    sys.exit(main())
