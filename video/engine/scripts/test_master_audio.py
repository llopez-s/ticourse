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

    def test_true_peak_limiter_holds_the_ceiling(self):
        sr = master_mix.SR
        t = np.arange(sr) / sr
        x = np.stack([0.99 * np.sin(2 * np.pi * 11025 * t + 0.4)] * 2, axis=1)
        y, gr = master_mix.limit(x, -1.0)
        self.assertLessEqual(master_mix.true_peak_db(y), -0.9)
        self.assertLessEqual(gr.max(), 1e-9)


if __name__ == "__main__":
    unittest.main()
