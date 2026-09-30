"""Builds a short fix-up recording from the clean takes of a few sentences, cut at their silences, so
import-recording --only re-imports just those sentences. In V5 this fixed, by hand, a false start that
Whisper merged into the retake (s04-06), words it dropped across a long pause (s07-06/s08-01) and a
stray word after the last one (s03-03); verify-voice had flagged all of them.

1. Find the cut points: print a speech map around a sentence (one character per 50 ms: # speech,
   + quiet, . silence), and cut inside the silences.

    python video/engine/scripts/recut_recording.py --map "video/engine/voices/<slug> <name> (master).wav@255-262"

2. Assemble the clean takes, in script order, with a short silence between them:

    python video/engine/scripts/recut_recording.py --out "video/engine/voices/<slug> arreglos <name> (master).wav" \
        --part "video/engine/voices/<slug> <name> (master).wav@259.5-271.0" \
        --part "video/engine/voices/<slug> regrabacion <name> (master).wav@15.5-24.6"

3. Re-import only those sentences (same --match as the full import), then audio.mjs re-verifies:

    node video/engine/scripts/import-recording.mjs --video <slug> --file "<out>" --name <name> --only s04-06,s03-03 --match <clip>

The parts must come from files with the same sample rate (the mastered WAVs). Uses the Chatterbox venv
(numpy + soundfile).
"""
import argparse
import re
import sys

PART = re.compile(r"^(?P<file>.+)@(?P<start>\d+(?:\.\d+)?)-(?P<end>\d+(?:\.\d+)?)$")
MAP_STEP = 0.05
SPEECH_RMS = 0.02
QUIET_RMS = 0.005


def parse_part(spec):
    """'<file>@<start>-<end>' (seconds) -> (file, start, end); rejects an empty or reversed range."""
    m = PART.match(spec.strip())
    if not m:
        raise ValueError(f"part {spec!r} must look like <file>@<start>-<end> (seconds)")
    start, end = float(m["start"]), float(m["end"])
    if end <= start:
        raise ValueError(f"part {spec!r}: the end must come after the start")
    return m["file"], start, end


def assemble(parts, sr, gap_s=0.8):
    """Concatenate mono float arrays with `gap_s` of digital silence after each one."""
    import numpy as np

    gap = np.zeros(int(round(gap_s * sr)), dtype=np.float64)
    out = []
    for p in parts:
        out += [np.asarray(p, dtype=np.float64), gap]
    return np.concatenate(out) if out else np.zeros(0)


def speech_map(x, sr, step=MAP_STEP):
    """One character per `step` seconds: '#' speech, '+' quiet, '.' silence (RMS thresholds as used for V5)."""
    import numpy as np

    w = max(1, int(step * sr))
    chars = []
    for i in range(0, len(x) - w + 1, w):
        v = float(np.sqrt(np.mean(np.square(x[i : i + w]))))
        chars.append("#" if v > SPEECH_RMS else ("+" if v > QUIET_RMS else "."))
    return "".join(chars)


def read_range(file, start, end):
    import soundfile as sf

    sr = sf.info(file).samplerate
    data, _ = sf.read(file, start=int(start * sr), stop=int(end * sr), always_2d=True)
    return data.mean(axis=1), sr


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--map", help="<file>@<start>-<end>: print the speech map of that range")
    ap.add_argument("--part", action="append", default=[], help="<file>@<start>-<end>, in script order (repeat)")
    ap.add_argument("--out", help="the fix-up WAV to write (24-bit PCM)")
    ap.add_argument("--gap", type=float, default=0.8, help="silence between parts, in seconds (default 0.8)")
    args = ap.parse_args(argv)

    if args.map:
        file, start, end = parse_part(args.map)
        x, sr = read_range(file, start, end)
        line = speech_map(x, sr)
        per_row = 50
        for k in range(0, len(line), per_row):
            print(f"{start + k * MAP_STEP:9.2f}  {line[k:k + per_row]}")
        return 0

    if not args.part or not args.out:
        ap.error("give --map, or --part (one or more) and --out")
    import soundfile as sf

    parts, rate = [], None
    for spec in args.part:
        file, start, end = parse_part(spec)
        x, sr = read_range(file, start, end)
        if rate is not None and sr != rate:
            raise SystemExit(f"{file}: {sr} Hz, but the earlier parts are {rate} Hz")
        rate = sr
        parts.append(x)
        print(f"recut: {file} {start:.2f}-{end:.2f} s ({len(x) / sr:.2f} s)")
    y = assemble(parts, rate, args.gap)
    sf.write(args.out, y, rate, subtype="PCM_24")
    print(f"recut: {len(parts)} parts, {len(y) / rate:.1f} s -> {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
