import unittest
from types import SimpleNamespace as NS

from recording_asr import words_from_segments


class WordsFromSegmentsTest(unittest.TestCase):
    def test_flattens_words_in_milliseconds(self):
        segments = [
            NS(words=[NS(word=" Sala", start=1.0, end=1.4), NS(word=" de", start=1.5, end=1.62)]),
            NS(words=[NS(word=" control.", start=1.7, end=2.25)]),
        ]
        self.assertEqual(
            words_from_segments(segments),
            [
                {"text": "Sala", "startMs": 1000, "endMs": 1400},
                {"text": "de", "startMs": 1500, "endMs": 1620},
                {"text": "control.", "startMs": 1700, "endMs": 2250},
            ],
        )

    def test_skips_blank_words_and_segments_without_words(self):
        segments = [NS(words=None), NS(words=[NS(word="  ", start=0.1, end=0.2), NS(word="hola", start=0.3, end=0.5)])]
        self.assertEqual(words_from_segments(segments), [{"text": "hola", "startMs": 300, "endMs": 500}])


if __name__ == "__main__":
    unittest.main()
