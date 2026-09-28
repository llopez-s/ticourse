import unittest

try:
    import numpy as np
    from adversary_fx import machine
except ImportError:
    machine = None


@unittest.skipIf(machine is None, "needs librosa/scipy (video/engine/.venv-chatterbox)")
class MachinePresetTest(unittest.TestCase):
    def test_keeps_the_length_and_peaks_at_minus_1_dbfs(self):
        sr = 22050
        t = np.arange(sr) / sr
        y = 0.3 * np.sin(2 * np.pi * 220 * t)
        out = machine(y, sr)
        self.assertEqual(len(out), len(y))
        self.assertAlmostEqual(float(np.max(np.abs(out))), 10 ** (-1 / 20), places=6)


if __name__ == "__main__":
    unittest.main()
