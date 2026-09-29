"""Program master of a rendered lesson video: an ambient bed under the mix, delivery loudness, true-peak limit.

    python video/engine/scripts/master_mix.py --video-in out/x.mp4 --timeline src/timeline.json --out out/x-master.mp4
        [--target -14] [--ceiling -1] [--bed-db 0] [--no-bed] [--bed-style story|pad] [--ffmpeg <exe>] [--excerpt 40:80 --excerpt-out x.wav]
    Or in two stages, so the heavy one runs while the frames render (render.mjs --master does this):
    python ... master_mix.py --audio-in out/x-program.wav --timeline src/timeline.json --premaster-out out/x-premaster.wav
    python ... master_mix.py --video-in out/x-premaster.mp4 --premaster out/x-premaster.wav --out out/x.mp4

1. Takes the rendered MP4's audio (narration + adversary voice + sound effects, as Remotion mixed them).
2. Adds an ambient bed generated here (no samples, no licences). The default --bed-style story walks a
   four-chord progression per chapter (a chord every 10 s) with a soft arpeggio, and follows the story
   the timeline tells: a dissonant cluster and a heartbeat under the adversary's message, a suspended
   chord and a tick-tock in a think prompt, a noise swell into each chapter, and a resolution to D major
   from the recap on; it sits ~4 LU under the program before ducking. --bed-style pad is the first bed
   (V1/V3): one static chord per chapter, ~14 LU under. Both lie over a very low room tone and duck 6 dB
   more whenever someone speaks (the story bed's arpeggio 12 dB), so they mostly fill the pauses, think
   prompts and transitions. Fades in at the start and out on the end card.
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
# How far under the program each bed sits before ducking. The pad bed of V1/V3 keeps its 14 LU (the listener's
# first draft asked for more than 20); the story bed plays 10 dB louder, chosen by ear on 2026-09-29 (+4, +7, +10).
BED_UNDER_LU = {"story": 4.0, "pad": 14.0}
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


def pad_bed(timeline, n, seed=7):
    """The first bed (--bed-style pad): one static chord per chapter over the room tone."""
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


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# --- The story bed (--bed-style story, the default) ------------------------------------------------------
# Chords move within each chapter and the bed reacts to the story the timeline tells: tension under the
# adversary's message, suspense in a think prompt, a lift into each chapter, a resolution in the recap.

CHORD_SEC = 10.0  # each chord of a chapter's progression lasts this long
CHORD_XFADE = 2.0
# Four-chord progressions in D minor, as MIDI notes, low register (under the voice). Chapter k uses PROGRESSIONS[k % 3].
PROGRESSIONS = [
    [[38, 45, 53, 60], [34, 46, 50, 57], [43, 50, 53, 58], [45, 52, 55, 62]],  # Dm7, Bbmaj7, Gm7, A7sus4
    [[43, 50, 57, 58], [39, 46, 55, 62], [36, 43, 51, 58], [38, 45, 50, 55]],  # Gm9, Ebmaj7, Cm7, Dsus4
    [[41, 48, 52, 57], [38, 45, 53, 64], [34, 46, 50, 57], [45, 52, 57, 59]],  # Fmaj7, Dm9, Bbmaj7, Asus2
]
FINALE = [[38, 45, 54, 64], [38, 43, 50, 54], [35, 42, 50, 57], [45, 49, 52, 57]]  # Dmaj9, G/D, Bm7, A: resolves to major
CLUSTER = [38, 39, 44, 50]  # D, Eb, Ab, D: the adversary's dissonance (minor second + tritone)
SUSPENDED = [43, 50, 55, 62]  # open fifths on G: a question left in the air
THUMP_HZ = 55.0  # the heartbeat under the adversary
ARP_STEP = 0.55  # seconds between arpeggio notes (0.45 in the finale)


def story_windows(timeline):
    """Where the story happens, in seconds: the adversary's messages (card until the narrator answers), the
    think prompts, and the start of the last scene (recap + end card)."""
    fps = timeline["fps"]
    starts = sorted(seg["from"] for seg in timeline["segments"])
    adversary = []
    for i in timeline.get("intercept", []):
        answer = next((s for s in starts if s > i["from"]), i["from"] + i["durationInFrames"])
        adversary.append((i["from"] / fps, answer / fps))
    think = [(t["from"] / fps, (t["from"] + t["durationInFrames"]) / fps) for t in timeline.get("think", [])]
    return {"adversary": adversary, "think": think, "finale": timeline["scenes"][-1]["from"] / fps}


def chord_schedule(timeline, total_s):
    """[(start, end, chord)]: each chapter walks its progression every CHORD_SEC; the last scene resolves."""
    finale = story_windows(timeline)["finale"]
    chapters = [s for s in chapter_starts(timeline) if s < finale] + [finale]
    spans = []
    for k in range(len(chapters) - 1):
        prog = PROGRESSIONS[k % len(PROGRESSIONS)]
        a, j = chapters[k], 0
        while a < chapters[k + 1] - 1e-9:
            b = min(a + CHORD_SEC, chapters[k + 1])
            spans.append((a, b, prog[j % len(prog)]))
            a, j = b, j + 1
    a, j = finale, 0
    while a < total_s - 1e-9:
        b = min(a + CHORD_SEC, total_s)
        spans.append((a, b, FINALE[j % len(FINALE)]))
        a, j = b, j + 1
    return spans


def gate(windows, n, attack=0.6, release=1.0):
    """0..1 envelope that is 1 inside the windows (s), with smooth ramps (attack before, release after)."""
    box = np.zeros(n)
    for a, b in windows:
        box[max(0, int(a * SR)) : min(n, int(b * SR))] = 1.0
    up = smooth(box, attack * 1000)
    down = smooth(box, release * 1000)
    return np.clip(np.maximum(up, down), 0.0, 1.0)


def event_gates(timeline, n):
    w = story_windows(timeline)
    return {
        "adversary": gate(w["adversary"], n),
        "think": gate(w["think"], n),
        "finale": gate([(w["finale"], n / SR)], n, attack=2.0, release=0.1),
    }


def xfade_env(i0, i1, first, last):
    env = np.ones(i1 - i0)
    ramp = min(int(CHORD_XFADE * SR), (i1 - i0) // 2)
    if not first and ramp:
        env[:ramp] = np.sin(np.linspace(0, np.pi / 2, ramp)) ** 2
    if not last and ramp:
        env[-ramp:] = np.cos(np.linspace(0, np.pi / 2, ramp)) ** 2
    return env


def pluck(freq, dur, rng):
    """One soft, dark arpeggio note: sine plus a little octave, exponential decay."""
    t = np.arange(int(dur * SR)) / SR
    env = np.exp(-t / 0.45) * np.minimum(1.0, t / 0.005)
    return env * (np.sin(2 * np.pi * freq * t + rng.uniform(0, 6.3)) + 0.3 * np.sin(4 * np.pi * freq * t))


def arpeggio(spans, n, rng, finale_at):
    out = np.zeros((n, 2))
    pattern = [0, 1, 2, 3, 2, 1]
    for a, b, chord in spans:
        step = 0.45 if a >= finale_at - 1e-9 else ARP_STEP
        k, s = 0, a
        while s < b - 1e-9:
            note = midi_hz(sorted(chord)[pattern[k % len(pattern)]] + 24)
            x = pluck(note, 1.6, rng)
            i0 = int(s * SR)
            i1 = min(n, i0 + len(x))
            pan = 0.5 + (0.25 if k % 2 else -0.25)
            out[i0:i1, 0] += x[: i1 - i0] * (1 - pan)
            out[i0:i1, 1] += x[: i1 - i0] * pan
            k, s = k + 1, s + step
    return signal.sosfiltfilt(signal.butter(2, 2200, btype="low", fs=SR, output="sos"), out, axis=0)


def heartbeat(n):
    """Lub-dub at ~55 BPM on a low sine, for the adversary's windows."""
    out = np.zeros(n)
    t = np.arange(int(0.35 * SR)) / SR
    thump = np.sin(2 * np.pi * THUMP_HZ * t) * np.exp(-t / 0.09) * np.minimum(1.0, t / 0.004)
    period = 1.1
    s = 0.0
    while s < n / SR:
        for offset, amp in ((0.0, 1.0), (0.24, 0.6)):
            i0 = int((s + offset) * SR)
            i1 = min(n, i0 + len(thump))
            if i0 < n:
                out[i0:i1] += amp * thump[: i1 - i0]
        s += period
    return np.stack([out, out], axis=1)


def ticks(n):
    """A soft tick-tock (2 per second) for the think prompts."""
    out = np.zeros(n)
    t = np.arange(int(0.03 * SR)) / SR
    for k in range(int(n / SR * 2)):
        freq = 2600.0 if k % 2 == 0 else 2000.0
        tick = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.008)
        i0 = int(k * 0.5 * SR)
        i1 = min(n, i0 + len(tick))
        out[i0:i1] += tick[: i1 - i0]
    return np.stack([out, out], axis=1)


def risers(starts, n, rng, dur=2.0):
    """A filtered-noise swell into each chapter after the first."""
    out = np.zeros((n, 2))
    m = int(dur * SR)
    lift = signal.sosfiltfilt(signal.butter(2, [400, 2400], btype="band", fs=SR, output="sos"), rng.standard_normal((m, 2)), axis=0)
    env = (np.linspace(0, 1, m) ** 2)[:, None]
    for s in starts[1:]:
        i1 = int(s * SR)
        i0 = max(0, i1 - m)
        if i1 > i0:
            out[i0:i1] += (lift * env)[m - (i1 - i0) :]
    return out


def rms(x):
    return float(np.sqrt(np.mean(x ** 2)) + 1e-12)


def ambient_bed(timeline, n, seed=7):
    """The story bed: moving chords + arpeggio, reacting to the adversary, the think prompts and the finale."""
    rng = np.random.default_rng(seed)
    t = np.arange(n) / SR
    spans = chord_schedule(timeline, n / SR)
    gates = event_gates(timeline, n)
    speech = smooth(speech_mask(timeline, n), 250)

    chords = np.zeros((n, 2))
    for k, (a, b, chord) in enumerate(spans):
        i0 = int(max(0.0, a - CHORD_XFADE / 2) * SR)
        i1 = int(min(n / SR, b + CHORD_XFADE / 2) * SR)
        env = xfade_env(i0, i1, k == 0, k == len(spans) - 1)
        chords[i0:i1] += pad([midi_hz(m) for m in chord], t[i0:i1], rng) * env[:, None]
    ref = rms(chords)

    arp = arpeggio(spans, n, rng, story_windows(timeline)["finale"])
    cluster = pad([midi_hz(m) for m in CLUSTER], t, rng)
    suspended = pad([midi_hz(m) for m in SUSPENDED], t, rng)
    beat, tick, lift = heartbeat(n), ticks(n), risers(chapter_starts(timeline), n, rng)

    adv, thk = gates["adversary"][:, None], gates["think"][:, None]
    quiet = np.clip(adv + thk, 0.0, 1.0)
    # Levels are set against the chord pad's RMS, so the balance holds whatever the progression.
    bed = chords * (1.0 - 0.65 * adv - 0.5 * thk)
    bed += cluster / rms(cluster) * ref * 0.9 * adv
    bed += beat / rms(beat) * ref * 0.8 * adv
    bed += suspended / rms(suspended) * ref * 0.7 * thk
    bed += tick / rms(tick) * ref * 0.1 * thk
    # The arpeggio goes quiet under the adversary and in a think prompt, and 6 dB lower still whenever
    # someone speaks (on top of the whole bed's ducking in main), so it mostly fills the pauses.
    arp_gain = (1.0 - quiet) * 10 ** (-6 * speech[:, None] / 20) * (1.0 + 0.4 * gates["finale"][:, None])
    bed += arp / rms(arp) * ref * 0.35 * arp_gain
    bed += lift / rms(lift) * ref * 0.25 if np.any(lift) else 0.0
    bed = bed / (np.max(np.abs(bed)) + 1e-9)
    bed += 0.18 * room_tone(n, rng) / 4
    bed = Pedalboard([Reverb(room_size=0.9, damping=0.6, wet_level=0.4, dry_level=0.75, width=1.0)])(
        bed.T.astype(np.float32), SR
    ).T.astype(np.float64)
    fade = np.ones(n)
    fin, fout = int(2.0 * SR), int(4.0 * SR)
    fade[:fin] = np.linspace(0, 1, fin)
    fade[-fout:] = np.linspace(1, 0, fout)
    return bed * fade[:, None]


BED_STYLES = {"story": ambient_bed, "pad": pad_bed}


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


def next_ceiling(limiter_db, measured_tp_db, target_tp_db, margin_db=0.1):
    """Limiter ceiling for another pass when the encoded file's true peak overshot the target (AAC adds a
    little on top of the PCM peak); None when it did not."""
    if measured_tp_db <= target_tp_db:
        return None
    return limiter_db - (measured_tp_db - target_tp_db) - margin_db


def read_audio(ffmpeg, src, tmp, name="program.wav"):
    """Any file ffmpeg reads (the rendered MP4, or an audio-only WAV) as stereo float at SR."""
    raw = os.path.join(tmp, name)
    subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-vn", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s24le", raw], check=True)
    audio, _ = sf.read(raw, always_2d=True)
    return audio


def premaster(prog, timeline, meter, target=-14.0, bed_style="story", bed_db=0.0, no_bed=False):
    """Stage 1, the heavy one: the program plus the ambient bed, at the target loudness, not yet limited.
    It only needs the audio, so it can run while the video frames are still rendering."""
    n = len(prog)
    prog_lufs = meter.integrated_loudness(prog)
    print(f"master_mix: program {prog_lufs:.1f} LUFS, true peak {true_peak_db(prog):.1f} dBTP, {n / SR:.1f} s")
    mix = prog.copy()
    if not no_bed:
        bed = BED_STYLES[bed_style](timeline, n)
        # The bed BED_UNDER_LU under the program, then 6 dB lower while anyone speaks.
        bed *= 10 ** ((prog_lufs - BED_UNDER_LU[bed_style] + bed_db - meter.integrated_loudness(bed)) / 20)
        duck = 10 ** (-6 * smooth(speech_mask(timeline, n), 250) / 20)
        bed *= duck[:, None]
        print(f"  bed ({bed_style}): {meter.integrated_loudness(bed):.1f} LUFS ({meter.integrated_loudness(bed) - prog_lufs:+.1f} LU vs program)")
        mix = prog + bed
    return mix * 10 ** ((target - meter.integrated_loudness(mix)) / 20)


def deliver(unlimited, video_in, out, meter, ffmpeg, tmp, ceiling_db=-1.0):
    """Stage 2, the light one: limit, encode AAC next to the untouched video stream, and check the delivered
    MP4. AAC can push the true peak past the PCM limiter's ceiling, so the MP4 is decoded and measured, and
    limited again with a lower ceiling if it overshot (up to 3 passes). Returns the limited PCM."""
    ceiling = ceiling_db
    for _ in range(3):
        mix, gr = limit(unlimited, ceiling)
        active = gr < -0.1
        print(
            f"  master: {meter.integrated_loudness(mix):.1f} LUFS, true peak {true_peak_db(mix):.1f} dBTP "
            f"(limiter at {ceiling:.2f}), limiter active {100 * active.mean():.2f}% of the time, max {-gr.min():.1f} dB"
        )
        mastered = os.path.join(tmp, "master.wav")
        sf.write(mastered, mix, SR, subtype="PCM_24")
        subprocess.run(
            [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", video_in, "-i", mastered,
             "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", out],
            check=True,
        )
        delivered = read_audio(ffmpeg, out, tmp, "check.wav")
        tp = true_peak_db(delivered)
        print(f"  delivered MP4: {meter.integrated_loudness(delivered):.1f} LUFS, true peak {tp:.2f} dBTP")
        lower = next_ceiling(ceiling, tp, ceiling_db)
        if lower is None:
            break
        ceiling = lower
    else:
        print(f"  warning: the MP4's true peak is still {tp:.2f} dBTP, over {ceiling_db} dBTP")
    print(f"  -> {out}")
    return mix


def main():
    ap = argparse.ArgumentParser(
        description="One pass: --video-in + --timeline + --out. In two stages (render.mjs --master runs stage 1 while "
        "the frames render): --audio-in + --timeline + --premaster-out, then --video-in + --premaster + --out."
    )
    ap.add_argument("--video-in", help="the rendered MP4 (its video stream is copied untouched)")
    ap.add_argument("--audio-in", help="stage 1 only: the program audio, e.g. Remotion's audio-only render")
    ap.add_argument("--premaster-out", help="stage 1 only: where to write the unlimited premaster (float WAV)")
    ap.add_argument("--premaster", help="stage 2 only: a premaster written by stage 1")
    ap.add_argument("--timeline")
    ap.add_argument("--out")
    ap.add_argument("--target", type=float, default=-14.0)
    ap.add_argument("--ceiling", type=float, default=-1.0)
    ap.add_argument("--bed-db", type=float, default=0.0, help="raise/lower the ambient bed from its default level")
    ap.add_argument("--no-bed", action="store_true")
    ap.add_argument("--bed-style", choices=sorted(BED_STYLES), default="story", help="story (default): moving chords that react to the timeline; pad: the first, one chord per chapter")
    ap.add_argument("--ffmpeg", default="node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe")
    ap.add_argument("--excerpt", help="start:end seconds of the master to also write as WAV")
    ap.add_argument("--excerpt-out")
    args = ap.parse_args()
    stage1 = bool(args.audio_in or args.premaster_out)
    stage2 = bool(args.premaster)
    if stage1 and not (args.audio_in and args.premaster_out and args.timeline):
        ap.error("stage 1 needs --audio-in, --timeline and --premaster-out")
    if stage2 and not (args.video_in and args.out):
        ap.error("stage 2 needs --video-in, --premaster and --out")
    if not stage1 and not stage2 and not (args.video_in and args.timeline and args.out):
        ap.error("one pass needs --video-in, --timeline and --out")

    args.ffmpeg = os.path.abspath(args.ffmpeg)  # Windows won't run a relative path with forward slashes
    meter = pyln.Meter(SR)
    with tempfile.TemporaryDirectory() as tmp:
        if stage2:
            unlimited, _ = sf.read(args.premaster, always_2d=True)
        else:
            timeline = json.load(open(args.timeline, encoding="utf8"))
            prog = read_audio(args.ffmpeg, args.audio_in or args.video_in, tmp)
            unlimited = premaster(prog, timeline, meter, args.target, args.bed_style, args.bed_db, args.no_bed)
            if stage1:
                sf.write(args.premaster_out, unlimited, SR, subtype="FLOAT")
                print(f"  premaster -> {args.premaster_out}")
                return
        mix = deliver(unlimited, args.video_in, args.out, meter, args.ffmpeg, tmp, args.ceiling)
        if args.excerpt and args.excerpt_out:
            a, b = (float(v) for v in args.excerpt.split(":"))
            sf.write(args.excerpt_out, mix[int(a * SR) : int(b * SR)], SR, subtype="PCM_16")
            print(f"  excerpt {a:.0f}-{b:.0f} s -> {args.excerpt_out}")


if __name__ == "__main__":
    main()
