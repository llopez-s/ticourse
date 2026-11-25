"""Even out the narrator's clips before the mix: same loudness sentence to sentence, steadier within a sentence,
and peaks tamed on the voice alone, so the programme master no longer has to turn the whole video down.

    python video/engine/scripts/balance_voice.py --video <slug> [--target -18] [--plr 12] [--dry-run]

Why (vlan-arcedo, 2026-11-25): her clips spread 3.7 LU (-20.5 to -16.8 LUFS), and her voice keeps ~17 dB between
its loudness and its peaks. master_mix's auto-level then had to lower the whole programme 4 dB so the limiter would
stay inaudible, and the video was delivered at -19 LUFS, quieter than the others (~-15).

Per clip (public/voice/<id>.mp3, the importer's 24 kHz mono 96 kbps CBR):
1. Leveller: a slow (~400 ms) gain that pulls each voiced stretch halfway towards the clip's own loudness,
   at most +-3 dB, frozen across pauses. Long sentences no longer fade or swell.
2. Clip gain to --target LUFS (default: the median of the clips), at most +-6 dB.
3. A gentle compressor (3:1 from --comp-over dB over the target, 4 ms / 80 ms) on the loud syllables, with
   make-up back to the target, then
4. Peak control on the voice: a look-around limiter (no latency, the file is known) holding sample peaks at
   target + --plr dB. Taking 3-5 dB off a few consonants of a dry voice is inaudible; the same on the full mix
   was heard as saturation (2026-10-10), which is why it happens here and not in master_mix.
Same length, same encoder, same byte count, so tts/<id>.json, the timeline and word timings stay valid.

The importer's clips are kept in out/voice-raw/ and every run starts from them, so it can be re-run. A clip
re-imported later (--only) differs from what this script wrote last time (out/voice-raw/balance.json), so it is
taken as the new raw clip.
"""
import argparse
import hashlib
import io
import json
import os
import shutil
import subprocess
import sys

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from pedalboard import Compressor, Pedalboard

SR = 24000
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
FFMPEG = os.path.join(REPO, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe")


def sha(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def decode(path):
    raw = subprocess.run([FFMPEG, "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "wav", "-"],
                         capture_output=True, check=True).stdout
    x, _ = sf.read(io.BytesIO(raw), dtype="float64")
    return x


# One LAME encode + decode (no Xing header, so no gapless info) delays the audio by this many samples at 24 kHz.
# The decoded clip already carries the importer's delay; dropping the same amount before re-encoding keeps every
# word where tts/<id>.json says it is, and keeps the byte count.
CODEC_DELAY = 1105


def encode(x, out):
    x = x[CODEC_DELAY:]
    tmp = out + ".tmp.wav"
    sf.write(tmp, x, SR, subtype="FLOAT")
    try:
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", tmp, "-ac", "1", "-ar", str(SR), "-c:a", "libmp3lame",
                        "-b:a", "96k", "-write_xing", "0", "-id3v2_version", "0", out + ".tmp.mp3"], check=True)
        os.replace(out + ".tmp.mp3", out)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def smooth(x, n):
    if n <= 1:
        return x
    k = np.ones(n) / n
    return np.convolve(np.pad(x, (n // 2, n - 1 - n // 2), mode="edge"), k, mode="valid")


def leveller(x, frame_ms=20, window_ms=400, strength=0.5, max_db=3.0, gate_db=-45.0):
    """Slow gain towards the clip's own voiced level; pauses keep the last gain (no breathing on silence)."""
    hop = int(SR * frame_ms / 1000)
    n = len(x) // hop
    if n < 3:
        return x
    frames = x[: n * hop].reshape(n, hop)
    rms_db = 10 * np.log10(np.mean(frames ** 2, axis=1) + 1e-12)
    voiced = rms_db > gate_db
    if voiced.sum() < 5:
        return x
    w = max(1, int(window_ms / frame_ms))
    # Energy-domain moving average over voiced frames only.
    e = np.where(voiced, 10 ** (rms_db / 10), 0.0)
    cnt = smooth(voiced.astype(float), w)
    local = 10 * np.log10(smooth(e, w) / np.maximum(cnt, 1e-9) + 1e-12)
    ref = 10 * np.log10(np.mean(10 ** (rms_db[voiced] / 10)))
    g = np.clip((ref - local) * strength, -max_db, max_db)
    # Hold the gain through pauses.
    last = 0.0
    for i in range(n):
        if cnt[i] < 0.25:
            g[i] = last
        last = g[i]
    g = smooth(g, w // 2 or 1)
    gain = np.interp(np.arange(len(x)), np.arange(n) * hop + hop / 2, 10 ** (g / 20))
    return x * gain


def limit(x, ceiling_db, window_ms=3.0, release_ms=60.0):
    """Offline peak limiter: gain from the peak within +-window, then a smooth recovery. Never adds gain."""
    c = 10 ** (ceiling_db / 20)
    w = max(1, int(SR * window_ms / 1000))
    a = np.abs(x)
    from numpy.lib.stride_tricks import sliding_window_view
    padded = np.pad(a, (w, w), mode="edge")
    peak = sliding_window_view(padded, 2 * w + 1).max(axis=1)
    target = np.minimum(1.0, c / np.maximum(peak, 1e-12))
    r = np.exp(-1.0 / (SR * release_ms / 1000))
    g = np.empty_like(target)
    level = 1.0
    for i, t in enumerate(target):
        level = t if t < level else r * level + (1 - r) * t
        g[i] = level
    # Backward pass so the gain also falls smoothly before a peak.
    level = 1.0
    for i in range(len(g) - 1, -1, -1):
        level = g[i] if g[i] < level else r * level + (1 - r) * g[i]
        g[i] = min(g[i], level)
    return x * g, g


def stats(meter, x):
    l = meter.integrated_loudness(x)
    pk = 20 * np.log10(np.max(np.abs(x)) + 1e-12)
    return l, pk


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--target", type=float, help="LUFS for every clip (default: the median of the raw clips)")
    ap.add_argument("--comp-over", type=float, default=5.0, help="compressor threshold over the target loudness, dB")
    ap.add_argument("--plr", type=float, default=14.5, help="peak-to-loudness ratio kept on the voice, dB")
    ap.add_argument("--max-gain", type=float, default=6.0)
    ap.add_argument("--no-leveller", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    vdir = os.path.join(REPO, "video", args.video)
    voice = os.path.join(vdir, "public", "voice")
    raw_dir = os.path.join(vdir, "out", "voice-raw")
    record_path = os.path.join(raw_dir, "balance.json")
    os.makedirs(raw_dir, exist_ok=True)
    record = json.load(open(record_path, encoding="utf8")) if os.path.exists(record_path) else {"clips": {}}

    clips = sorted(f for f in os.listdir(voice) if f.endswith(".mp3"))
    if not clips:
        sys.exit(f"balance_voice: no clips in {voice}")
    for f in clips:
        pub, raw = os.path.join(voice, f), os.path.join(raw_dir, f)
        written = record["clips"].get(f, {}).get("written")
        if not os.path.exists(raw) or sha(pub) != written:
            shutil.copy2(pub, raw)  # first run, or the importer wrote a new clip since

    meter = pyln.Meter(SR)
    data = {f: decode(os.path.join(raw_dir, f)) for f in clips}
    before = {f: stats(meter, x) for f, x in data.items()}
    target = args.target if args.target is not None else float(np.median([l for l, _ in before.values()]))
    ceiling = target + args.plr
    print(f"balance_voice: {len(clips)} clips, target {target:.1f} LUFS, voice peaks held at {ceiling:.1f} dBFS")

    after, out_record = {}, {}
    for f in clips:
        x = data[f]
        if not args.no_leveller:
            x = leveller(x)
        l = meter.integrated_loudness(x)
        g = float(np.clip(target - l, -args.max_gain, args.max_gain))
        x = x * 10 ** (g / 20)
        # Syllable peaks first, with a gentle compressor (zero latency); the limiter then only catches what is left.
        x = Pedalboard([Compressor(threshold_db=target + args.comp_over, ratio=3.0, attack_ms=4, release_ms=80)])(
            x.astype(np.float32), SR).astype(np.float64)
        # The compressor lowered the loudness a little: one make-up step back to the target.
        makeup = float(np.clip(target - meter.integrated_loudness(x), 0.0, 3.0))
        x = x * 10 ** (makeup / 20)
        g += makeup
        x, gr = limit(x, ceiling)
        after[f] = stats(meter, x)
        gr_db = -20 * np.log10(gr.min())
        active = 100 * float((gr < 0.891).mean())  # more than 1 dB of limiting
        b, a = before[f], after[f]
        print(f"  {f:12s} {b[0]:6.1f} -> {a[0]:6.1f} LUFS  gain {g:+4.1f}  peak {b[1]:5.1f} -> {a[1]:5.1f}  limiter max {gr_db:3.1f} dB, >1 dB {active:4.1f} %")
        if not args.dry_run:
            pub = os.path.join(voice, f)
            size = os.path.getsize(pub)
            encode(x, pub)
            if os.path.getsize(pub) != size:
                print(f"    note: {f} is now {os.path.getsize(pub)} bytes (was {size}); updating tts json")
                tts = os.path.join(vdir, "tts", f[:-4] + ".json")
                if os.path.exists(tts):
                    j = json.load(open(tts, encoding="utf8"))
                    j["bytes"] = os.path.getsize(pub)
                    with open(tts, "w", encoding="utf8") as fh:
                        json.dump(j, fh, ensure_ascii=False, indent=1)
                        fh.write("\n")
            out_record[f] = {"written": sha(pub), "gainDb": round(g, 2), "limiterMaxDb": round(float(gr_db), 2)}
    lb = [v[0] for v in before.values()]
    la = [v[0] for v in after.values()]
    plr_b = np.median([p - l for l, p in before.values()])
    plr_a = np.median([p - l for l, p in after.values()])
    print(f"spread {max(lb) - min(lb):.1f} -> {max(la) - min(la):.1f} LU; median peak-to-loudness {plr_b:.1f} -> {plr_a:.1f} dB")
    if not args.dry_run:
        with open(record_path, "w", encoding="utf8") as fh:
            json.dump({"target": round(target, 2), "plr": args.plr, "clips": out_record}, fh, indent=1)
            fh.write("\n")


if __name__ == "__main__":
    main()
