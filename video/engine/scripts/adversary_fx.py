"""Effect presets for the adversary's voice (tts-adversary.mjs):

    python adversary_fx.py --in <wav> --out <wav> [--preset machine|telefono|cifrado]

machine: 4 semitones down, ring modulation (0.6 + 0.4 sin 2π·48·t) and a 120–5000 Hz band-pass; same length,
peak at -1 dBFS.
telefono: a narrowband phone call, no pitch shift and no ring modulation: soft tanh saturation (drive 3), a
faint seeded line hiss (-50 dB), then a zero-phase order-6 Butterworth band-pass between 300 and 3400 Hz
(saturation and hiss go in before the filter, so nothing they add leaks out of the band); same length, peak at
-1 dBFS, deterministic. Added so RED MARROW does not sound like PAPER CRANE (same Laura voice, machine).
cifrado: a poor digital link, dry: no pitch shift, no ring, no band-pass and no room. Each sample is held down to
~11 kHz with no anti-alias filter first (the aliasing is the metallic shine), the signal is quantised to 6 bits
(the crunch), and a noise gate (20 ms RMS, -36 dB under the loudest moment, 3 ms edges) cuts the tails between
words to digital silence; same length, peak at -1 dBFS, deterministic. NULL CIPHER's voice (V11, Helena).
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


def _moving_mean(x, width):
    kernel = np.ones(width) / width
    padded = np.pad(x, (width // 2, width - 1 - width // 2), mode="edge")
    return np.convolve(padded, kernel, mode="valid")


def cifrado(y, sr):
    x = np.asarray(y, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-12)
    target = 11025.0
    held = np.floor(np.floor(np.arange(len(x)) * target / sr) * sr / target).astype(int)
    x = x[np.minimum(held, len(x) - 1)]
    levels = 2 ** (6 - 1) - 1
    x = np.round(x * levels) / levels
    envelope = np.sqrt(_moving_mean(x**2, max(1, int(0.020 * sr))))
    gate = (envelope > 10 ** (-36 / 20) * np.max(envelope)).astype(np.float64)
    out = x * np.clip(_moving_mean(gate, max(1, int(0.003 * sr))), 0.0, 1.0)
    return out / (np.max(np.abs(out)) + 1e-12) * 10 ** (-1 / 20)


def _peaking(f0, gain_db, q, sr):
    amp = 10 ** (gain_db / 40)
    w0 = 2 * np.pi * f0 / sr
    alpha = np.sin(w0) / (2 * q)
    b = np.array([1 + alpha * amp, -2 * np.cos(w0), 1 - alpha * amp])
    a = np.array([1 + alpha / amp, -2 * np.cos(w0), 1 - alpha / amp])
    return b / a[0], a / a[0]


def megafonia(y, sr):
    x = np.asarray(y, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-12)
    hi = min(5000.0, 0.45 * sr)
    x = signal.sosfiltfilt(signal.butter(4, [250, hi], btype="bandpass", fs=sr, output="sos"), x)
    x = signal.lfilter(*_peaking(2000.0, 6.0, 1.0, sr), x)
    t = np.arange(int(1.2 * sr)) / sr
    onset = np.clip((t - 0.060) / 0.060, 0.0, 1.0)
    tail = np.random.default_rng(316).standard_normal(len(t)) * onset * np.exp(-6.91 * t / 1.0)
    tail *= 0.35 / (np.sqrt(np.sum(tail**2)) + 1e-12)
    ir = tail
    ir[0] += 1.0
    ir[int(0.090 * sr)] += 0.5
    out = signal.fftconvolve(x, ir)[: len(x)]
    fade = min(len(out), max(1, int(0.040 * sr)))
    out[-fade:] *= np.linspace(1.0, 0.0, fade)
    return out / (np.max(np.abs(out)) + 1e-12) * 10 ** (-1 / 20)


PRESETS = {"machine": machine, "telefono": telefono, "cifrado": cifrado, "megafonia": megafonia}


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
