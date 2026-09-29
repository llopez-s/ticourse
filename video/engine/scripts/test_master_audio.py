"""Tests for master_voice.py and master_mix.py (pure DSP parts; no files, no ffmpeg).

    python -m unittest discover -s video/engine/scripts -p "test_*.py"

Skipped when the audio libraries (numpy, scipy, pedalboard, pyloudnorm) are not installed.
"""
import unittest

try:
    import numpy as np

    import master_mix
    import master_voice
except ImportError as err:  # pragma: no cover
    master_mix = master_voice = None
    SKIP = f"audio libraries missing: {err}"
else:
    SKIP = None


def speechlike(sr, seconds=4.0, seed=1):
    """Pulsed band-limited noise with silences: enough like speech for level and timing checks."""
    rng = np.random.default_rng(seed)
    n = int(sr * seconds)
    x = rng.standard_normal(n) * 0.1
    gate = (np.sin(2 * np.pi * 2.5 * np.arange(n) / sr) > 0).astype(float)
    return x * gate


@unittest.skipIf(SKIP, SKIP)
class MasterVoiceTest(unittest.TestCase):
    def test_chain_keeps_length_level_and_ceiling(self):
        sr = 44100
        x = speechlike(sr)
        y, stats = master_voice.master(x, sr)
        self.assertEqual(len(y), len(x))  # word timings must not move
        self.assertLessEqual(np.max(np.abs(y)), 10 ** (-3 / 20) + 1e-6)
        self.assertIn("comp_reduction_p90_db", stats)

    def test_limiter_never_adds_gain_and_holds_the_ceiling(self):
        sr = 44100
        x = np.concatenate([np.full(1000, 0.1), np.full(50, 0.9), np.full(1000, 0.1)])
        y = master_voice.limit(x, sr, ceiling_db=-6.0)
        self.assertLessEqual(np.max(np.abs(y)), 10 ** (-6 / 20) + 1e-9)
        self.assertTrue(np.all(np.abs(y) <= np.abs(x) + 1e-12))

    def test_de_esser_is_a_bypass_without_sibilants(self):
        sr = 44100
        t = np.arange(sr) / sr
        x = 0.3 * np.sin(2 * np.pi * 220 * t)
        y, cut = master_voice.de_ess(x, sr)
        self.assertLess(np.max(np.abs(y - x)), 1e-3)


def story_timeline():
    """40 s, two chapters: an intercept (voiced) answered at 17 s, a think prompt 23–25 s, the recap from 32 s."""
    return {
        "fps": 30,
        "durationInFrames": 1200,
        "scenes": [
            {"id": "s01-a", "chapter": 1, "from": 0},
            {"id": "s02-b", "chapter": 2, "from": 300},
            {"id": "s03-recap", "chapter": 2, "from": 960},
        ],
        "segments": [
            {"id": "s01-01", "scene": "s01-a", "from": 30, "audioFrames": 240, "durationInFrames": 250},
            {"id": "s02-01", "scene": "s02-b", "from": 330, "audioFrames": 60, "durationInFrames": 70},
            {"id": "s02-02", "scene": "s02-b", "from": 510, "audioFrames": 150, "durationInFrames": 160},
            {"id": "s02-03", "scene": "s02-b", "from": 780, "audioFrames": 120, "durationInFrames": 130},
            {"id": "s03-01", "scene": "s03-recap", "from": 990, "audioFrames": 150, "durationInFrames": 160},
        ],
        "intercept": [{"scene": "s02-b", "from": 400, "durationInFrames": 280, "audioFrom": 404, "audioFrames": 90}],
        "think": [{"scene": "s02-b", "from": 690, "durationInFrames": 60}],
    }


@unittest.skipIf(SKIP, SKIP)
class MasterMixTest(unittest.TestCase):
    def test_smooth_matches_a_moving_average(self):
        x = np.zeros(master_mix.SR)
        x[20000:21000] = 1.0
        y = master_mix.smooth(x, 10)
        k = int(master_mix.SR * 10 / 1000)
        ref = np.convolve(x, np.ones(k) / k, mode="same")
        self.assertLess(np.max(np.abs(y[k:-k] - ref[k:-k])), 1e-9)

    def test_speech_mask_covers_segments_and_adversary_voice(self):
        timeline = {
            "fps": 30,
            "segments": [{"from": 30, "audioFrames": 30, "durationInFrames": 40}],
            "intercept": [{"audioFrom": 120, "audioFrames": 15}],
        }
        n = master_mix.SR * 6
        mask = master_mix.speech_mask(timeline, n)
        at = lambda s: mask[int(s * master_mix.SR)]
        self.assertEqual(at(1.5), 1.0)  # narrator (1–2 s)
        self.assertEqual(at(4.2), 1.0)  # adversary (4–4.5 s)
        self.assertEqual(at(3.0), 0.0)  # pause: the bed comes up

    def test_chapter_starts(self):
        timeline = {"fps": 30, "scenes": [{"chapter": 1, "from": 0}, {"chapter": 1, "from": 300}, {"chapter": 2, "from": 900}]}
        self.assertEqual(master_mix.chapter_starts(timeline), [0.0, 30.0])

    def test_story_windows(self):
        w = master_mix.story_windows(story_timeline())
        (a, b), = w["adversary"]
        self.assertAlmostEqual(a, 400 / 30)  # the card appears...
        self.assertAlmostEqual(b, 17.0)  # ...and the tension lasts until the narrator answers
        self.assertEqual(w["think"], [(23.0, 25.0)])
        self.assertEqual(w["finale"], 32.0)  # the last scene (recap + end card) resolves

    def test_chord_schedule_moves_within_chapters_and_resolves_at_the_end(self):
        spans = master_mix.chord_schedule(story_timeline(), 40.0)
        starts = [a for a, _, _ in spans]
        self.assertEqual(starts, [0.0, 10.0, 20.0, 30.0, 32.0])
        for (_, b, _), (a, _, _) in zip(spans, spans[1:]):
            self.assertEqual(b, a)  # contiguous, no gaps
        self.assertEqual(spans[-1][1], 40.0)
        prog = master_mix.PROGRESSIONS
        self.assertEqual([c for _, _, c in spans[:4]], [prog[0][0], prog[1][0], prog[1][1], prog[1][2]])
        self.assertEqual(spans[4][2], master_mix.FINALE[0])

    def test_event_gates_follow_the_story(self):
        tl = story_timeline()
        n = 40 * master_mix.SR
        g = master_mix.event_gates(tl, n)
        at = lambda name, s: g[name][int(s * master_mix.SR)]
        self.assertGreater(at("adversary", 15.0), 0.99)
        self.assertLess(at("adversary", 20.0), 0.01)
        self.assertGreater(at("think", 24.0), 0.99)
        self.assertLess(at("think", 28.0), 0.01)
        self.assertGreater(at("finale", 36.0), 0.99)
        self.assertLess(at("finale", 28.0), 0.01)

    def test_story_bed_reacts_and_is_reproducible(self):
        tl = story_timeline()
        n = 40 * master_mix.SR
        bed = master_mix.ambient_bed(tl, n)
        self.assertEqual(bed.shape, (n, 2))
        self.assertTrue(np.all(np.isfinite(bed)))
        self.assertTrue(np.array_equal(bed, master_mix.ambient_bed(tl, n)))  # same seed, same bed
        self.assertFalse(np.array_equal(bed, master_mix.pad_bed(tl, n)))  # the old bed is still there, and differs

        def band(a, b, lo, hi):
            x = bed[int(a * master_mix.SR) : int(b * master_mix.SR)].mean(axis=1)
            f = np.fft.rfftfreq(len(x), 1 / master_mix.SR)
            p = np.abs(np.fft.rfft(x)) ** 2
            return p[(f >= lo) & (f < hi)].sum() / len(x)

        free = (30.2, 31.8)  # nobody speaks, no event
        tense = (14.2, 16.2)  # the adversary's message
        # The heartbeat thump (~55 Hz) comes in with the adversary; the arpeggio goes quiet.
        self.assertGreater(band(*tense, 48, 60), 3 * band(*free, 48, 60))
        self.assertLess(band(*tense, 600, 1400), 0.5 * band(*free, 600, 1400))

    def test_next_ceiling_lowers_the_limiter_by_the_encoded_overshoot(self):
        self.assertIsNone(master_mix.next_ceiling(-1.0, -1.2, -1.0))  # the MP4 is under the target: done
        self.assertAlmostEqual(master_mix.next_ceiling(-1.0, -0.84, -1.0), -1.26)  # 0.16 dB over, plus 0.1 of margin

    def test_true_peak_limiter_holds_the_ceiling(self):
        sr = master_mix.SR
        t = np.arange(sr) / sr
        x = np.stack([0.99 * np.sin(2 * np.pi * 11025 * t + 0.4)] * 2, axis=1)
        y, gr = master_mix.limit(x, -1.0)
        self.assertLessEqual(master_mix.true_peak_db(y), -0.9)
        self.assertLessEqual(gr.max(), 1e-9)


if __name__ == "__main__":
    unittest.main()
