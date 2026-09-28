"""Sound-effect library for the lesson videos, generated with numpy/scipy (no samples, no licences).

    python video/engine/scripts/sfx_generate.py                      # writes video/engine/sfx/*.mp3 + sfx.json
    python video/engine/scripts/sfx_generate.py --preview board.mp3  # every sound in a row, to listen

Every sound comes from a fixed seed, so a rerun gives the same samples. Each sound's pre-encode buffer peaks
at -1 dBFS; the delivered MP3 lands between -1.5 and -0.5 dBFS, because the lossy encode moves the peak. How
loud each one sounds in the mix is VOLUMES (a linear gain the timeline passes to Remotion, voice = 1).
"""
import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy import signal

SR = 44100
SEED = 20260928
ENGINE_DIR = Path(__file__).resolve().parent.parent
SFX_DIR = ENGINE_DIR / "sfx"
REPO_ROOT = ENGINE_DIR.parent.parent
# Measured with ffmpeg loudnorm (each effect padded to 3 s): with the narration at about -25 LUFS,
# every effect sits 12 dB under it (-37 LUFS), except whoosh (14 dB under) and typing (25 dB under),
# so the voice always sounds louder than the effects. To retune a sound, measure it the same way.
VOLUMES = {"glitch": 0.166, "typing": 0.08, "ding": 0.097, "whoosh": 0.058, "mail": 0.079, "check": 0.156,
           "error": 0.071, "block": 0.170, "alarm": 0.024, "ping2": 0.044, "lock": 0.115}


def n_of(seconds):
    return int(round(seconds * SR))


def decay(n, tau_s):
    return np.exp(-np.arange(n) / (tau_s * SR))


def tone(freq, seconds, tau_s):
    n = n_of(seconds)
    return np.sin(2 * np.pi * freq * np.arange(n) / SR) * decay(n, tau_s)


def glide(f0, f1, seconds, tau_s):
    n = n_of(seconds)
    freq = np.linspace(f0, f1, n)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * decay(n, tau_s)


def band(x, lo, hi):
    return signal.sosfilt(signal.butter(4, [lo, hi], btype="bandpass", fs=SR, output="sos"), x)


def lowpass(x, hi):
    return signal.sosfilt(signal.butter(4, hi, btype="lowpass", fs=SR, output="sos"), x)


def place(total_s, *parts):
    """Mixes (start_s, samples) parts into one buffer of total_s seconds."""
    out = np.zeros(n_of(total_s))
    for start, x in parts:
        i = n_of(start)
        m = min(len(x), len(out) - i)
        out[i:i + m] += x[:m]
    return out


def edges(x, ms=4):
    k = max(1, int(SR * ms / 1000))
    x = x.copy()
    x[:k] *= np.linspace(0, 1, k)
    x[-k:] *= np.linspace(1, 0, k)
    return x


def click(rng, ms=8, lo=2000, hi=6000):
    n = n_of(ms / 1000)
    return band(rng.standard_normal(n), lo, hi) * decay(n, 0.002)


def glitch(rng):
    n = n_of(0.35)
    held = np.repeat(np.round(rng.standard_normal(n // 8 + 1) * 3) / 3, 8)[:n]  # sample-and-hold + bitcrush
    gate = np.repeat(rng.random(n // n_of(0.025) + 1) > 0.35, n_of(0.025))[:n]
    return held * gate * decay(n, 0.2)


def typing(rng):
    parts, t = [], 0.0
    while True:
        t += rng.uniform(0.045, 0.11)
        if t > 2.97:
            break
        parts.append((t, click(rng) * rng.uniform(0.6, 1.0)))
    return place(3.0, *parts)


def ding(rng):
    return tone(880, 0.8, 0.25) + 0.5 * tone(1320, 0.8, 0.18)


def whoosh(rng):
    n = n_of(0.6)
    noise = rng.standard_normal(n)
    p = np.sin(np.linspace(0, np.pi, n))
    return (lowpass(noise, 900) * (1 - p) + band(noise, 1500, 6000) * p) * np.sin(np.linspace(0, np.pi, n)) ** 2


def mail(rng):
    return place(0.5, (0, tone(660, 0.2, 0.08)), (0.15, tone(990, 0.35, 0.12)))


def check(rng):
    return glide(700, 1000, 0.25, 0.07)


def error(rng):
    burst = lowpass(signal.square(2 * np.pi * 150 * np.arange(n_of(0.12)) / SR), 2000) * decay(n_of(0.12), 0.08)
    return place(0.4, (0, burst), (0.18, burst))


def block(rng):
    return place(0.3, (0, tone(80, 0.3, 0.08)), (0, 0.6 * click(rng, ms=5, lo=1000, hi=4000)))


def alarm(rng):
    def beep(f):
        n = n_of(0.2)
        t = np.arange(n) / SR
        return edges(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 3 * f * t))
    return place(0.9, (0, beep(960)), (0.2, beep(720)), (0.4, beep(960)), (0.6, beep(720)))


def ping2(rng):
    ping = tone(1200, 0.7, 0.35)
    ping = ping + 0.3 * np.concatenate([np.zeros(n_of(0.12)), ping])[: len(ping)]
    return place(1.2, (0, ping), (0.45, ping))


def lock(rng):
    return place(0.45, (0, click(rng, ms=4)), (0.09, click(rng, ms=4)), (0.12, tone(110, 0.3, 0.06)))


SOUNDS = {"glitch": glitch, "typing": typing, "ding": ding, "whoosh": whoosh, "mail": mail, "check": check,
          "error": error, "block": block, "alarm": alarm, "ping2": ping2, "lock": lock}


def normalize(x, peak_db=-1.0):
    return edges(x) / (np.max(np.abs(edges(x))) + 1e-12) * 10 ** (peak_db / 20)


def render_all():
    """Every sound as float samples at SR, each from its own seeded generator (order-independent)."""
    return {name: normalize(make(np.random.default_rng([SEED, k]))) for k, (name, make) in enumerate(SOUNDS.items())}


def ffmpeg():
    for d in sorted((REPO_ROOT / "node_modules" / "@remotion").glob("compositor-*")):
        exe = d / ("ffmpeg.exe" if sys.platform == "win32" else "ffmpeg")
        if exe.exists():
            return str(exe)
    raise SystemExit("Remotion's ffmpeg not found: run npm install in the repo root")


def encode(wav, mp3):
    subprocess.run([ffmpeg(), "-v", "error", "-y", "-i", str(wav), "-map_metadata", "-1", "-fflags", "+bitexact",
                    "-flags:a", "+bitexact", "-c:a", "libmp3lame", "-b:a", "128k", "-write_xing", "0",
                    "-id3v2_version", "0", str(mp3)], check=True)


def decode(mp3):
    """Reads a delivered MP3 back (libsndfile decodes MP3 natively). LAME priming/padding makes the
    decoded length a few dozen ms longer than the pre-encode buffer, and the lossy encode moves the
    peak off the pre-encode -1 dBFS target — sfx.json must report what a player actually sees, so this
    is what main() measures rather than the float buffer's own length/peak."""
    data, sr = sf.read(str(mp3))
    return data, sr


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--preview", help="also write every sound in a row (0.6 s apart) to this MP3")
    args = p.parse_args(argv)
    sounds = render_all()
    SFX_DIR.mkdir(parents=True, exist_ok=True)
    manifest_sounds = {}
    with tempfile.TemporaryDirectory() as tmp:
        for name, x in sounds.items():
            wav = Path(tmp) / f"{name}.wav"
            sf.write(wav, x, SR, subtype="PCM_16")
            mp3 = SFX_DIR / f"{name}.mp3"
            encode(wav, mp3)
            decoded, sr = decode(mp3)
            manifest_sounds[name] = {"file": f"{name}.mp3", "durationMs": round(len(decoded) * 1000 / sr),
                                      "volume": VOLUMES[name]}
        if args.preview:
            gap = np.zeros(n_of(0.6))
            loudest = max(VOLUMES.values())
            board = np.concatenate([np.concatenate([x * VOLUMES[name] / loudest, gap]) for name, x in sounds.items()])
            wav = Path(tmp) / "preview.wav"
            sf.write(wav, board, SR, subtype="PCM_16")
            encode(wav, Path(args.preview))
    manifest = {"sampleRate": SR, "sounds": manifest_sounds}
    (SFX_DIR / "sfx.json").write_text(json.dumps(manifest, indent=1) + "\n", encoding="utf-8", newline="\n")
    print(f"sfx_generate: {len(sounds)} sounds -> {SFX_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
