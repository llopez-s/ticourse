"""Voice mastering chain for a narrator's own recording, run on the source WAV before import-recording.

    python video/engine/scripts/master_voice.py --in "voices/x.wav" --out "voices/x (master).wav" [--ab ab.wav]

The chain is time-aligned (zero-phase filters, no look-ahead delay), so word timings stay where
Whisper and the importer expect them:

1. Dual-mono to mono.
2. High-pass at 70 Hz (24 dB/oct): rumble and handling noise, nothing of the voice.
3. Corrective EQ: -1.5 dB at 300 Hz (boxiness), +2 dB at 3.2 kHz (presence, intelligibility).
4. De-esser: dynamic gain on the 5-9 kHz band only, up to -8 dB on the loudest sibilants.
5. Air: a faint harmonic exciter above 8.5 kHz, where noise-suppressed recordings go silent.
6. Gentle compression (2.5:1, ~3 dB on the loud syllables) for an even, present voice.
7. Level to -20 LUFS with a zero-latency safety limiter at -3 dBFS. The importer sets the final clip gain and
   the program master (master_mix.py) the delivery loudness, so this keeps headroom.

No noise reduction: recordings with a digital-silence floor were already denoised at the source,
and a second pass only adds artefacts. --ab writes a loudness-matched before/after excerpt.
"""
import argparse

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from pedalboard import Compressor, PeakFilter, Pedalboard
from scipy import signal

TARGET_LUFS = -20.0


def zero_phase(sos, x):
    return signal.sosfiltfilt(sos, x)


def envelope_db(x, sr, attack_ms, release_ms):
    """Peak envelope in dB with separate attack/release (one-pole)."""
    a = np.exp(-1.0 / (sr * attack_ms / 1000))
    r = np.exp(-1.0 / (sr * release_ms / 1000))
    env = np.empty_like(x)
    level = 0.0
    for i, v in enumerate(np.abs(x)):
        coef = a if v > level else r
        level = coef * level + (1 - coef) * v
        env[i] = level
    return 20 * np.log10(env + 1e-9)


def de_ess(x, sr, max_cut_db=8.0, ratio=4.0):
    band = zero_phase(signal.butter(4, [5000, 9000], btype="band", fs=sr, output="sos"), x)
    env = envelope_db(band, sr, attack_ms=1.0, release_ms=40.0)
    voiced = env[env > np.percentile(env, 60)]
    threshold = np.median(voiced) + 6.0
    over = np.maximum(env - threshold, 0.0)
    cut_db = np.minimum(over * (1 - 1 / ratio), max_cut_db)
    gain = 10 ** (-cut_db / 20)
    # x = rest + band, so this only turns the sibilant band down; with gain 1 it is a perfect bypass.
    return x + (gain - 1) * band, cut_db


def exciter(x, sr, level_db=-18.0):
    high = zero_phase(signal.butter(4, 3000, btype="high", fs=sr, output="sos"), x)
    drive = 8.0
    harmonics = np.tanh(drive * high) / drive
    air = zero_phase(signal.butter(4, 8500, btype="high", fs=sr, output="sos"), harmonics)
    return x + air * 10 ** (level_db / 20)


def master(x, sr):
    x = zero_phase(signal.butter(4, 70, btype="high", fs=sr, output="sos"), x)
    eq = Pedalboard([PeakFilter(300, -1.5, 1.0), PeakFilter(3200, 2.0, 0.9)])
    x = eq(x.astype(np.float32), sr).astype(np.float64)
    x, cut_db = de_ess(x, sr)
    x = exciter(x, sr)
    speech = pyln.Meter(sr).integrated_loudness(x)
    # Threshold a few dB above the speech level: only the loud syllables are compressed.
    comp = Pedalboard([Compressor(threshold_db=speech + 5.0, ratio=2.5, attack_ms=10, release_ms=120)])
    before = x.copy()
    x = comp(x.astype(np.float32), sr).astype(np.float64)
    x *= 10 ** ((TARGET_LUFS - pyln.Meter(sr).integrated_loudness(x)) / 20)
    x = limit(x, sr, ceiling_db=-3.0)
    gr = compression_stats(before, x, sr)
    return x, {"de_ess_max_db": float(cut_db.max()), "de_ess_active_pct": float(100 * np.mean(cut_db > 1)), **gr}


def limit(x, sr, ceiling_db, window_ms=2.0, release_ms=80.0):
    """Offline peak limiter with no latency: the gain looks ahead and behind by `window_ms` (it can,
    since the whole file is known), then recovers with `release_ms`. Never adds gain."""
    ceiling = 10 ** (ceiling_db / 20)
    need = np.minimum(1.0, ceiling / (np.abs(x) + 1e-12))
    w = max(1, int(sr * window_ms / 1000))
    from scipy.ndimage import minimum_filter1d

    gain = minimum_filter1d(need, size=2 * w + 1)
    r = np.exp(-1.0 / (sr * release_ms / 1000))
    out = np.empty_like(gain)
    g = 1.0
    for i, target in enumerate(gain):
        g = target if target < g else r * g + (1 - r) * target
        out[i] = g
    return x * out


def compression_stats(before, after, sr):
    """Gain reduction on loud syllables: level change vs the median change (which is make-up gain)."""
    f = int(0.05 * sr)
    n = min(len(before), len(after)) // f * f
    b = 20 * np.log10(np.sqrt((before[:n].reshape(-1, f) ** 2).mean(1)) + 1e-12)
    a = 20 * np.log10(np.sqrt((after[:n].reshape(-1, f) ** 2).mean(1)) + 1e-12)
    speech = b > np.percentile(b, 50)
    delta = (a - b)[speech]
    reduction = np.median(delta) - delta
    return {"comp_reduction_p90_db": float(np.percentile(reduction, 90)), "comp_reduction_max_db": float(reduction.max())}


def describe(x, sr, label):
    meter = pyln.Meter(sr)
    peak = 20 * np.log10(np.max(np.abs(signal.resample_poly(x, 4, 1))) + 1e-12)
    fr, p = signal.welch(x, sr, nperseg=8192)
    ref = p[(fr > 300) & (fr < 3000)].max()
    air = 10 * np.log10(p[(fr > 9000) & (fr < 12000)].mean() / ref + 1e-20)
    sib = 10 * np.log10(p[(fr > 5000) & (fr < 9000)].mean() / ref + 1e-20)
    print(f"  {label}: {meter.integrated_loudness(x):6.1f} LUFS, true peak {peak:5.1f} dBTP, 5-9k {sib:6.1f} dB, 9-12k {air:6.1f} dB (vs voice band)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--ab", help="write a before/after excerpt here")
    ap.add_argument("--ab-from", type=float, default=0.0)
    ap.add_argument("--ab-sec", type=float, default=20.0)
    args = ap.parse_args()

    raw, sr = sf.read(args.inp, always_2d=True)
    mono = raw.mean(axis=1)
    out, stats = master(mono, sr)
    assert len(out) == len(mono), "the chain must keep the length (word timings)"
    sf.write(args.out, out, sr, subtype="PCM_24")
    print(f"master_voice: {args.inp} -> {args.out}")
    describe(mono, sr, "before")
    describe(out, sr, "after ")
    print("  " + ", ".join(f"{k} {v:.1f}" for k, v in stats.items()))

    if args.ab:
        a0, n = int(args.ab_from * sr), int(args.ab_sec * sr)
        meter = pyln.Meter(sr)
        # Loudness-matched, so the comparison is about tone, not volume.
        clips = [c[a0 : a0 + n] * 10 ** ((-16 - meter.integrated_loudness(c[a0 : a0 + n])) / 20) for c in (mono, out)]
        gap = np.zeros(int(0.8 * sr))
        sf.write(args.ab, np.concatenate([clips[0], gap, clips[1]]), sr, subtype="PCM_16")
        print(f"  A/B -> {args.ab} (A = original, B = master, both at -16 LUFS)")


if __name__ == "__main__":
    main()
