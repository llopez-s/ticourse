"""A music bed from a library track (YouTube Audio Library; video/engine/music/LICENSES.md) for master_mix.py.

The track is cut into phrases of 4 bars on its own beats (the phase where its sections start, found from the
energy) and re-arranged to the video's length, following the story the timeline tells:

- it opens on the track's first phrase and closes on its real ending, laid so it ends with the video;
- in between it keeps playing on (the next phrase of the track costs nothing), and jumps elsewhere when the
  story asks for another energy: calmer phrases under the narration, the loudest ones where the adversary
  speaks or a think prompt holds the screen (under the adversary, the darker of them);
- a phrase already used costs a little more each time, so a long video walks the whole track;
- phrases join with a short equal-power crossfade centred on the next phrase's downbeat.

master_mix.py then filters and ducks it under the voice (music_bed there).
"""
import numpy as np

AN_SR = 22050  # analysis rate (the bed itself is built at master_mix's rate)
PHRASE_BEATS = 16  # 4 bars of 4/4: the arrangement's unit
XFADE_S = 0.08
UNDER_SPEECH = 0.4  # energy wanted under the narration (0 = the track's quietest phrase, 1 = its loudest)
ENERGY_COST = 2.5  # per unit of energy away from the wanted one
JUMP_COST = 0.5  # leaving the track's own order
REUSE_COST = 0.25  # per earlier use of the same phrase
DARK_COST = 1.5  # a bright phrase under the adversary (V4: the dark section must be there when it speaks)
MIN_SCRAP_S = 3.0  # no phrase shorter than this before the ending: the ending starts up to this much early


def beat_times(mono, sr=AN_SR):
    import librosa

    _, beats = librosa.beat.beat_track(y=mono, sr=sr, units="time", trim=False)
    return np.asarray(beats, dtype=float)


def beat_energies(mono, beats, sr=AN_SR):
    """RMS in dB between consecutive beats."""
    out = []
    for a, b in zip(beats[:-1], beats[1:]):
        seg = mono[int(a * sr) : max(int(a * sr) + 1, int(b * sr))]
        out.append(20 * np.log10(np.sqrt(np.mean(seg**2)) + 1e-9))
    return np.asarray(out)


def phrase_phase(energies, n=PHRASE_BEATS):
    """Which beat (0..n-1) phrases start on: the one where the energy changes most, summed over the track
    (a section starts on a phrase, and sections are where the energy jumps)."""
    half = n // 2
    novelty = np.zeros(len(energies) + 1)
    for i in range(half, len(energies) - half + 1):
        novelty[i] = abs(energies[i : i + half].mean() - energies[i - half : i].mean())
    return int(np.argmax([novelty[p::n].sum() for p in range(n)]))


def phrase_edges(beats, phase, duration, n=PHRASE_BEATS):
    """Start times of the phrases, then the track's end. A pickup before the first downbeat, or a last scrap
    after the final one (V4's track: 1.6 s of decay), shorter than half a phrase joins its neighbour."""
    starts = [float(t) for t in beats[phase::n]]
    edges = [0.0] + [t for t in starts if 0.0 < t < duration] + [duration]
    half = np.median(np.diff(edges)) / 2 if len(edges) > 2 else 0.0
    if len(edges) > 3 and edges[-1] - edges[-2] < half:
        del edges[-2]
    if len(edges) > 3 and edges[1] - edges[0] < half:
        del edges[1]
    return edges


def phrases(mono, sr=AN_SR):
    """[{start, end, energy 0..1, bright 0..1, beats (times inside, from its start)}] for a mono track."""
    import librosa

    beats = beat_times(mono, sr)
    edges = phrase_edges(beats, phrase_phase(beat_energies(mono, beats, sr)), len(mono) / sr)
    out = []
    for a, b in zip(edges[:-1], edges[1:]):
        seg = mono[int(a * sr) : int(b * sr)]
        out.append(
            {
                "start": a,
                "end": b,
                "db": 20 * np.log10(np.sqrt(np.mean(seg**2)) + 1e-9),
                "centroid": float(np.mean(librosa.feature.spectral_centroid(y=seg, sr=sr))),
                "beats": [float(t - a) for t in beats if a < t < b],
            }
        )
    return normalise(out)


def normalise(blocks):
    """Adds energy and bright in 0..1 across the track's phrases (from db and centroid)."""
    db = np.array([b["db"] for b in blocks])
    ce = np.array([b["centroid"] for b in blocks])
    span = lambda x: (x - x.min()) / (np.ptp(x) or 1.0)  # noqa: E731
    for b, e, c in zip(blocks, span(db), span(ce)):
        b["energy"], b["bright"] = float(e), float(c)
    return blocks


def arrange(blocks, total_s, want, tail=1):
    """[(phrase, video start s, seconds played)] filling total_s. want(t0, t1) -> (energy wanted, adversary share).
    The first phrase opens it; the last `tail` phrases close it, laid to end with the video; in between each
    next phrase is the cheapest by the costs above. The phrase before the ending is cut on a beat."""
    closing = list(range(len(blocks) - tail, len(blocks)))
    closing_s = sum(blocks[k]["end"] - blocks[k]["start"] for k in closing)
    fill_end = max(0.0, total_s - closing_s)
    body = [k for k in range(len(blocks)) if k not in closing]
    plan, used, t, prev = [], {}, 0.0, None
    while fill_end - t >= (MIN_SCRAP_S if plan else 0.3):
        if prev is None:
            pick = 0
        else:
            def cost(k):
                d = blocks[k]["end"] - blocks[k]["start"]
                energy, adversary = want(t, min(t + d, fill_end))
                return (
                    ENERGY_COST * abs(blocks[k]["energy"] - energy)
                    + (0.0 if k == prev + 1 else JUMP_COST)
                    + REUSE_COST * used.get(k, 0)
                    + DARK_COST * adversary * blocks[k]["bright"]
                )

            pick = min(body, key=cost)
        d = blocks[pick]["end"] - blocks[pick]["start"]
        if t + d > fill_end:
            # cut on the last beat that still fits (the closing phrases then start on a beat of this one)
            fits = [b for b in blocks[pick]["beats"] if b <= fill_end - t]
            d = fits[-1] if fits else fill_end - t
        plan.append((pick, t, d))
        used[pick] = used.get(pick, 0) + 1
        t, prev = t + d, pick
    for k in closing:
        d = blocks[k]["end"] - blocks[k]["start"]
        plan.append((k, t, d))
        t += d
    return plan


def place(song, sr, blocks, plan, n, xfade_s=XFADE_S):
    """The arranged bed, n samples: each phrase from its track time, joined by equal-power crossfades centred
    on the joins (the incoming phrase starts xfade/2 before its downbeat, the outgoing one runs xfade/2 past)."""
    out = np.zeros((n, song.shape[1]))
    h = int(xfade_s * sr / 2)
    ramp_in = np.sin(np.linspace(0, np.pi / 2, 2 * h)) if h else np.ones(0)
    for j, (k, t, d) in enumerate(plan):
        first, last = j == 0, j == len(plan) - 1
        src0 = int(blocks[k]["start"] * sr) - (0 if first else h)
        src1 = int(blocks[k]["start"] * sr) + int(d * sr) + (0 if last else h)
        dst0 = int(t * sr) - (0 if first else h)
        if src0 < 0:  # the track's first samples: nothing before them to fade from
            dst0, src0 = dst0 - src0, 0
        seg = song[src0 : min(src1, len(song))].copy()
        env = np.ones(len(seg))
        if not first and h:
            env[: 2 * h] *= ramp_in[: len(env[: 2 * h])]
        if not last and h and len(seg) > 2 * h:
            env[-2 * h :] *= ramp_in[::-1]
        seg *= env[:, None]
        a, b = max(0, dst0), min(n, dst0 + len(seg))
        if b > a:
            out[a:b] += seg[a - dst0 : b - dst0]
    return out


def describe(blocks, plan):
    """One line per phrase played: video time, track time, energy — for the log."""
    fmt = lambda s: f"{int(s // 60)}:{s % 60:04.1f}"  # noqa: E731
    return [
        f"  {fmt(t)} +{d:4.1f}s  track {fmt(blocks[k]['start'])}  energy {blocks[k]['energy']:.2f}  bright {blocks[k]['bright']:.2f}"
        for k, t, d in plan
    ]
