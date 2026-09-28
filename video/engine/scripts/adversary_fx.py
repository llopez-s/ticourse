"""Effect presets for the adversary's voice (tts-adversary.mjs):

    python adversary_fx.py --in <wav> --out <wav> [--preset machine]

machine: 4 semitones down, ring modulation (0.6 + 0.4 sin 2π·48·t) and a 120–5000 Hz band-pass; same length,
peak at -1 dBFS.
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


PRESETS = {"machine": machine}


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
