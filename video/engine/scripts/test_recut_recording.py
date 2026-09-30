"""Tests for recut_recording.py (pure parts: no files).

    python -m unittest discover -s video/engine/scripts -p "test_*.py"

Skipped when numpy is not installed.
"""
import unittest

import recut_recording as rr

try:
    import numpy as np
except ImportError as err:  # pragma: no cover
    np = None
    SKIP = f"numpy missing: {err}"
else:
    SKIP = None


class ParsePart(unittest.TestCase):
    def test_file_and_range(self):
        self.assertEqual(rr.parse_part("D:/voices/ir-halden lidia (master).wav@259.5-271"), ("D:/voices/ir-halden lidia (master).wav", 259.5, 271.0))

    def test_rejects_bad_ranges(self):
        for spec in ("file.wav", "file.wav@10", "file.wav@12-10", "file.wav@5-5"):
            with self.assertRaises(ValueError, msg=spec):
                rr.parse_part(spec)


@unittest.skipIf(SKIP, SKIP)
class Assemble(unittest.TestCase):
    def test_parts_in_order_with_a_gap_after_each(self):
        sr = 1000
        a, b = np.ones(300), np.full(200, 0.5)
        y = rr.assemble([a, b], sr, gap_s=0.1)
        self.assertEqual(len(y), 300 + 100 + 200 + 100)
        self.assertTrue(np.all(y[:300] == 1.0) and np.all(y[300:400] == 0.0) and np.all(y[400:600] == 0.5))


@unittest.skipIf(SKIP, SKIP)
class SpeechMap(unittest.TestCase):
    def test_speech_quiet_and_silence(self):
        sr = 1000
        x = np.concatenate([np.zeros(100), np.full(100, 0.1), np.full(100, 0.01)])
        self.assertEqual(rr.speech_map(x, sr, step=0.05), "..##++")


if __name__ == "__main__":
    unittest.main()
