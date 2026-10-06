import json
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace as NS
from unittest import mock

from recording_asr import main, parse_clips, words_from_segments


class ParseClipsTest(unittest.TestCase):
    def test_reads_pairs_of_seconds(self):
        self.assertEqual(parse_clips("27,346"), [27.0, 346.0])
        self.assertEqual(parse_clips("0,102, 129,202"), [0.0, 102.0, 129.0, 202.0])

    def test_nothing_means_the_whole_file(self):
        self.assertIsNone(parse_clips(""))
        self.assertIsNone(parse_clips(None))

    def test_rejects_odd_or_unordered_edges(self):
        with self.assertRaises(ValueError):
            parse_clips("27")
        with self.assertRaises(ValueError):
            parse_clips("30,27")
        with self.assertRaises(ValueError):
            parse_clips("0,40,30,50")


class FakeWhisper:
    """Stands in for faster_whisper.WhisperModel (loading the real one takes a minute): records the call."""

    calls = []

    def __init__(self, *args, **kwargs):
        pass

    def transcribe(self, audio, **kwargs):
        FakeWhisper.calls.append(kwargs)
        words = [NS(word=" Esta", start=28.06, end=28.5)]
        return iter([NS(start=28.06, end=28.5, text=" Esta", words=words)]), NS(duration=345.165)


class MainTest(unittest.TestCase):
    def run_main(self, *extra):
        FakeWhisper.calls = []
        with tempfile.TemporaryDirectory() as tmp, mock.patch.dict(sys.modules, {"faster_whisper": NS(WhisperModel=FakeWhisper)}):
            out = Path(tmp) / "asr.json"
            self.assertEqual(main(["--audio", "a.wav", "--out", str(out), *extra]), 0)
            return FakeWhisper.calls[0], json.loads(out.read_text(encoding="utf-8"))

    def test_clips_go_to_whisper_and_into_the_result(self):
        kwargs, result = self.run_main("--clips", "27,346")
        self.assertEqual(kwargs["clip_timestamps"], [27.0, 346.0])
        self.assertEqual(result["clips"], [{"startMs": 27000, "endMs": 346000}])
        # the timestamps stay in the recording's time, and the duration is the whole file's
        self.assertEqual(result["words"], [{"text": "Esta", "startMs": 28060, "endMs": 28500}])
        self.assertEqual(result["durationMs"], 345165)

    def test_without_clips_whisper_hears_the_whole_file_as_before(self):
        kwargs, result = self.run_main()
        self.assertNotIn("clip_timestamps", kwargs)
        self.assertIsNone(result["clips"])


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
