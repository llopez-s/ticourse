import unittest

try:
    import numpy as np
    from adversary_fx import PRESETS, cifrado, machine, megafonia, telefono
except ImportError:
    machine = telefono = cifrado = megafonia = None


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


@unittest.skipIf(cifrado is None, "needs librosa/scipy (video/engine/.venv-chatterbox)")
class CifradoPresetTest(unittest.TestCase):
    def test_is_a_registered_preset(self):
        self.assertIs(PRESETS["cifrado"], cifrado)

    def test_keeps_the_length_and_peaks_at_minus_1_dbfs(self):
        sr = 22050
        t = np.arange(sr) / sr
        y = 0.3 * np.sin(2 * np.pi * 220 * t)
        out = cifrado(y, sr)
        self.assertEqual(len(out), len(y))
        self.assertAlmostEqual(float(np.max(np.abs(out))), 10 ** (-1 / 20), places=6)

    def test_a_loud_input_never_clips(self):
        sr = 24000
        y = np.clip(3 * np.random.default_rng(4).standard_normal(sr), -1, 1)
        self.assertLessEqual(float(np.max(np.abs(cifrado(y, sr)))), 10 ** (-1 / 20) + 1e-9)

    def test_quantises_to_about_6_bits(self):
        sr = 22050
        t = np.arange(sr) / sr
        out = cifrado(0.5 * np.sin(2 * np.pi * 220 * t), sr)
        self.assertLessEqual(len(np.unique(np.round(out, 9))), 2**6 + 1)

    def test_holds_each_sample_down_to_about_11_khz_without_filtering_first(self):
        sr = 22050
        t = np.arange(sr) / sr
        out = cifrado(0.5 * np.sin(2 * np.pi * 220 * t), sr)
        pairs = out[: len(out) // 2 * 2].reshape(-1, 2)
        self.assertGreater(float(np.mean(pairs[:, 0] == pairs[:, 1])), 0.99)

    def test_the_gate_silences_the_gaps_between_words(self):
        sr = 22050
        t = np.arange(sr) / sr
        word = 0.5 * np.sin(2 * np.pi * 300 * t[: sr // 4])
        gap = 0.0005 * np.random.default_rng(5).standard_normal(sr // 2)
        out = cifrado(np.concatenate([word, gap, word]), sr)
        middle = out[sr // 4 + sr // 10 : sr // 4 + sr // 2 - sr // 10]
        self.assertTrue(np.all(middle == 0.0), "the hiss between the words is gated to digital silence")
        self.assertFalse(np.all(telefono(np.concatenate([word, gap, word]), sr)[sr // 4 + sr // 10 : sr // 2] == 0.0))

    def test_is_deterministic(self):
        sr = 22050
        y = 0.3 * np.random.default_rng(6).standard_normal(sr)
        self.assertTrue(np.array_equal(cifrado(y, sr), cifrado(y, sr)))

    def test_keeps_the_highs_a_phone_band_would_cut(self):
        sr = 22050
        y = 0.3 * np.random.default_rng(7).standard_normal(sr)
        self.assertGreater(_share_above(cifrado(y, sr), sr, 3500), 5 * _share_above(telefono(y, sr), sr, 3500))


def _window_rms(out, sr, start, end):
    return float(np.sqrt(np.mean(out[int(start * sr) : int(end * sr)] ** 2)))


@unittest.skipIf(megafonia is None, "needs librosa/scipy (video/engine/.venv-chatterbox)")
class MegafoniaPresetTest(unittest.TestCase):
    def test_is_a_registered_preset(self):
        self.assertIs(PRESETS["megafonia"], megafonia)

    def test_keeps_the_length_and_peaks_at_minus_1_dbfs(self):
        sr = 22050
        t = np.arange(sr) / sr
        y = 0.3 * np.sin(2 * np.pi * 220 * t)
        out = megafonia(y, sr)
        self.assertEqual(len(out), len(y))
        self.assertAlmostEqual(float(np.max(np.abs(out))), 10 ** (-1 / 20), places=6)

    def test_a_loud_input_never_clips(self):
        sr = 24000
        y = np.clip(3 * np.random.default_rng(8).standard_normal(sr), -1, 1)
        self.assertLessEqual(float(np.max(np.abs(megafonia(y, sr)))), 10 ** (-1 / 20) + 1e-9)

    def test_is_deterministic(self):
        sr = 22050
        y = 0.3 * np.random.default_rng(9).standard_normal(sr)
        self.assertTrue(np.array_equal(megafonia(y, sr), megafonia(y, sr)))

    def test_cuts_what_a_horn_speaker_cannot_play(self):
        sr = 22050
        t = np.arange(2 * sr) / sr
        y = 0.3 * (np.sin(2 * np.pi * 90 * t) + np.sin(2 * np.pi * 1000 * t) + np.sin(2 * np.pi * 9000 * t))
        spectrum = np.abs(np.fft.rfft(megafonia(y, sr)))
        in_band = _bin_db(spectrum, sr, len(t), 1000)
        self.assertLess(_bin_db(spectrum, sr, len(t), 90), in_band - 30)
        self.assertLess(_bin_db(spectrum, sr, len(t), 9000), in_band - 20)

    def test_lifts_the_band_around_2_khz(self):
        sr = 22050
        t = np.arange(2 * sr) / sr
        y = 0.3 * (np.sin(2 * np.pi * 700 * t) + np.sin(2 * np.pi * 2000 * t))
        spectrum = np.abs(np.fft.rfft(megafonia(y, sr)))
        self.assertGreater(_bin_db(spectrum, sr, len(t), 2000), _bin_db(spectrum, sr, len(t), 700) + 3)

    def test_a_click_comes_back_as_an_echo_and_a_decaying_tail(self):
        sr = 22050
        y = np.zeros(2 * sr)
        y[int(0.1 * sr)] = 0.9
        out = megafonia(y, sr)
        echo = int(0.19 * sr)
        self.assertGreater(float(np.max(np.abs(out[echo - 40 : echo + 40]))), 4 * _window_rms(out, sr, 0.15, 0.17))
        early, late = _window_rms(out, sr, 0.35, 0.55), _window_rms(out, sr, 0.85, 1.05)
        self.assertGreater(late, 0.0, "the concrete still rings after 0.75 s")
        self.assertGreater(early, 3 * late, "and it dies away")

    def test_fades_out_instead_of_cutting_the_tail(self):
        sr = 22050
        y = 0.3 * np.random.default_rng(10).standard_normal(sr)
        out = megafonia(y, sr)
        self.assertLess(abs(float(out[-1])), 1e-3)
        self.assertLess(_window_rms(out, sr, 1 - 0.005, 1), _window_rms(out, sr, 0.5, 0.6) / 4)


if __name__ == "__main__":
    unittest.main()
