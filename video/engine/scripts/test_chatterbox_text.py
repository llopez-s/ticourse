import unittest

from chatterbox_text import normalize, script_score


class NormalizeTest(unittest.TestCase):
    def test_folds_case_accents_and_punctuation(self):
        self.assertEqual(normalize("¡Órden, CACHÉ y año!"), "ordencacheyano")

    def test_keeps_digits(self):
        self.assertEqual(normalize("a los 30 días"), "alos30dias")


class ScriptScoreTest(unittest.TestCase):
    SCRIPT = "Primero, el jash sha doscientos cincuenta y seis del original, antes de copiar nada."

    def test_identical_is_one(self):
        self.assertEqual(script_score(self.SCRIPT, self.SCRIPT), 1.0)

    def test_respellings_and_digits_stay_high(self):
        heard = "Primero, el hash SHA 256 del original, antes de copiar nada."
        self.assertGreater(script_score(self.SCRIPT, heard), 0.7)
        heard_words = "Primero, el hash sha doscientos cincuenta y seis del original, antes de copiar nada."
        self.assertGreater(script_score(self.SCRIPT, heard_words), 0.95)

    def test_dropped_clause_scores_low(self):
        self.assertLess(script_score(self.SCRIPT, "Primero, el hash."), 0.6)

    def test_repeated_clause_scores_lower_than_clean_take(self):
        repeated = "Primero, el jash del original, el jash del original, el jash del original, antes de copiar nada nada nada."
        self.assertLess(script_score(self.SCRIPT, repeated), script_score(self.SCRIPT, self.SCRIPT) - 0.15)

    def test_empty_inputs(self):
        self.assertEqual(script_score("", ""), 1.0)
        self.assertEqual(script_score("hola", ""), 0.0)


if __name__ == "__main__":
    unittest.main()
