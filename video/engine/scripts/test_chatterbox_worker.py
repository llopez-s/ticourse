"""job_settings(): per-job voice settings. Pure; runs with any Python 3.10+:

    python -m unittest discover -s video/engine/scripts -p "test_*.py"
"""
import unittest

from chatterbox_worker import job_settings


class JobSettingsTest(unittest.TestCase):
    SPEC = {"exaggeration": 0.5, "cfgWeight": 0.5}

    def test_job_values_win(self):
        self.assertEqual(job_settings(self.SPEC, {"exaggeration": 0.75, "cfgWeight": 0.35}), (0.75, 0.35))

    def test_falls_back_to_the_run_values(self):
        self.assertEqual(job_settings(self.SPEC, {"id": "s01-01"}), (0.5, 0.5))


if __name__ == "__main__":
    unittest.main()
