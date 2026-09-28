import json
import unittest

try:
    import numpy as np
    import sfx_generate as g
except ImportError:  # the plain-Python suite has no numpy: these run with the Chatterbox venv
    g = None

EXPECTED_S = {"glitch": 0.35, "typing": 3.0, "ding": 0.8, "whoosh": 0.6, "mail": 0.5, "check": 0.25,
              "error": 0.4, "block": 0.3, "alarm": 0.9, "ping2": 1.2, "lock": 0.45}


@unittest.skipIf(g is None, "needs numpy/scipy (video/engine/.venv-chatterbox)")
class SfxLibraryTest(unittest.TestCase):
    def setUp(self):
        self.sounds = g.render_all()

    def test_has_the_eleven_sounds_with_a_mix_volume(self):
        self.assertEqual(sorted(self.sounds), sorted(EXPECTED_S))
        self.assertEqual(sorted(g.VOLUMES), sorted(EXPECTED_S))
        self.assertTrue(all(0 < v <= 0.3 for v in g.VOLUMES.values()))

    def test_each_sound_is_audible_and_peaks_at_minus_1_dbfs(self):
        for name, x in self.sounds.items():
            peak = float(np.max(np.abs(x)))
            self.assertAlmostEqual(peak, 10 ** (-1 / 20), places=4, msg=name)
            # sparse sounds (typing) have a low RMS: this only rules out silence
            self.assertGreater(float(np.sqrt(np.mean(x ** 2))), 0.005, msg=name)

    def test_durations_match_the_spec(self):
        for name, x in self.sounds.items():
            self.assertAlmostEqual(len(x) / g.SR, EXPECTED_S[name], delta=EXPECTED_S[name] * 0.15, msg=name)

    def test_is_deterministic(self):
        again = g.render_all()
        for name in self.sounds:
            self.assertTrue(np.array_equal(self.sounds[name], again[name]), msg=name)


@unittest.skipIf(g is None, "needs numpy/scipy (video/engine/.venv-chatterbox)")
class SfxDeliveredFileTest(unittest.TestCase):
    """Checks the files sfx_generate.py actually writes to disk, not the pre-encode float buffer:
    LAME priming/padding lengthens the decoded MP3 and the lossy encode shifts its peak, so sfx.json
    must report the decoded truth (durationMs) and the delivered peak must still land in-range."""

    def setUp(self):
        manifest_path = g.SFX_DIR / "sfx.json"
        if not manifest_path.exists():
            self.skipTest(f"run sfx_generate.py first ({manifest_path} not found)")
        self.manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    def test_delivered_mp3s_match_their_manifest_duration_and_peak(self):
        self.assertEqual(sorted(self.manifest["sounds"]), sorted(EXPECTED_S))
        for name, info in self.manifest["sounds"].items():
            data, sr = g.decode(g.SFX_DIR / info["file"])
            duration_ms = len(data) * 1000 / sr
            self.assertAlmostEqual(duration_ms, info["durationMs"], delta=1, msg=name)
            peak_db = 20 * np.log10(float(np.max(np.abs(data))))
            self.assertGreaterEqual(peak_db, -1.5, msg=name)
            self.assertLessEqual(peak_db, -0.5, msg=name)


if __name__ == "__main__":
    unittest.main()
