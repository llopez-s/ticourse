import unittest

try:
    import numpy as np
    from adversary_fx import PRESETS, machine, telefono
except ImportError:
    machine = telefono = None


@unittest.skipIf(machine is None, "needs librosa/scipy (video/engine/.venv-chatterbox)")
class MachinePresetTest(unittest.TestCase):
    def test_keeps_the_length_and_peaks_at_minus_1_dbfs(self):
        sr = 22050
        t = np.arange(sr) / sr
        y = 0.3 * np.sin(2 * np.pi * 220 * t)
        out = machine(y, sr)
        self.assertEqual(len(out), len(y))
        self.assertAlmostEqual(float(np.max(np.abs(out))), 10 ** (-1 / 20), places=6)


def _bin_db(spectrum, sr, n, freq):
    return 20 * np.log10(spectrum[int(round(freq * n / sr))] + 1e-20)


def _share_above(out, sr, freq):
    power = np.abs(np.fft.rfft(out)) ** 2
    freqs = np.fft.rfftfreq(len(out), 1 / sr)
    return float(power[freqs > freq].sum() / power.sum())


@unittest.skipIf(telefono is None, "needs librosa/scipy (video/engine/.venv-chatterbox)")
class TelefonoPresetTest(unittest.TestCase):
    def test_is_a_registered_preset(self):
        self.assertIs(PRESETS["telefono"], telefono)

    def test_keeps_the_length_and_peaks_at_minus_1_dbfs(self):
        sr = 22050
        t = np.arange(sr) / sr
        y = 0.3 * np.sin(2 * np.pi * 220 * t)
        out = telefono(y, sr)
        self.assertEqual(len(out), len(y))
        self.assertAlmostEqual(float(np.max(np.abs(out))), 10 ** (-1 / 20), places=6)

    def test_a_loud_input_never_clips(self):
        sr = 16000
        y = np.clip(3 * np.random.default_rng(1).standard_normal(sr), -1, 1)
        out = telefono(y, sr)
        self.assertEqual(len(out), len(y))
        self.assertLessEqual(float(np.max(np.abs(out))), 10 ** (-1 / 20) + 1e-9)

    def test_cuts_what_lies_outside_the_phone_band(self):
        sr = 22050
        t = np.arange(sr) / sr
        y = 0.3 * (np.sin(2 * np.pi * 100 * t) + np.sin(2 * np.pi * 1000 * t) + np.sin(2 * np.pi * 6000 * t))
        spectrum = np.abs(np.fft.rfft(telefono(y, sr)))
        in_band = _bin_db(spectrum, sr, sr, 1000)
        self.assertLess(_bin_db(spectrum, sr, sr, 100), in_band - 30)
        self.assertLess(_bin_db(spectrum, sr, sr, 6000), in_band - 30)

    def test_is_deterministic(self):
        sr = 22050
        y = 0.3 * np.random.default_rng(2).standard_normal(sr)
        self.assertTrue(np.array_equal(telefono(y, sr), telefono(y, sr)))

    def test_leaves_far_less_above_3500_hz_than_machine(self):
        sr = 22050
        y = 0.3 * np.random.default_rng(3).standard_normal(sr)
        self.assertLess(_share_above(telefono(y, sr), sr, 3500), 0.02)
        self.assertGreater(_share_above(machine(y, sr), sr, 3500), 5 * _share_above(telefono(y, sr), sr, 3500))


if __name__ == "__main__":
    unittest.main()
