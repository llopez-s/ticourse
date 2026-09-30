"""Tests for music_kit.py (the parts that need no audio file and no librosa).

    python -m unittest discover -s video/engine/scripts -p "test_*.py"
"""
import unittest

try:
    import numpy as np

    import music_kit
except ImportError as err:  # pragma: no cover
    music_kit = None
    SKIP = f"audio libraries missing: {err}"
else:
    SKIP = None


def block(start, end, energy, bright, beat=0.5):
    return {"start": start, "end": end, "energy": energy, "bright": bright, "beats": list(np.arange(beat, end - start, beat))}


@unittest.skipIf(SKIP, SKIP)
class PhrasesTest(unittest.TestCase):
    def test_phase_is_where_the_sections_start(self):
        # sections of 16 beats that start on beat 4 (a 4-beat pickup before the first downbeat)
        e = np.array([-5.0] * 4 + [(-20.0 if (i // 16) % 2 == 0 else -5.0) for i in range(60)])
        self.assertEqual(music_kit.phrase_phase(e), 4)

    def test_edges_join_a_short_pickup_and_a_short_last_scrap_to_their_neighbours(self):
        beats = np.arange(0.1, 44, 0.5)  # phrases of 8 s from beat 4 (2.1 s): a 2.1 s pickup, a 1.9 s scrap
        edges = [round(e, 6) for e in music_kit.phrase_edges(beats, 4, 44.0)]
        self.assertEqual(edges, [0.0, 10.1, 18.1, 26.1, 34.1, 44.0])
        # a pickup or a last phrase of at least half a phrase stays on its own
        self.assertEqual(music_kit.phrase_edges(np.arange(0.0, 46, 0.5), 10, 46.0), [0.0, 5.0, 13.0, 21.0, 29.0, 37.0, 46.0])


@unittest.skipIf(SKIP, SKIP)
class ArrangeTest(unittest.TestCase):
    def setUp(self):
        # intro (quiet), two loud phrases (one bright, one dark), a quiet breakdown, the ending
        self.blocks = [
            block(0, 10, 0.0, 0.2),
            block(10, 20, 1.0, 0.9),
            block(20, 30, 1.0, 0.1),
            block(30, 40, 0.3, 0.5),
            block(40, 46, 0.2, 0.5),
        ]

    def test_opens_on_the_first_phrase_and_ends_with_the_video(self):
        plan = music_kit.arrange(self.blocks, 95.0, lambda a, b: (0.4, 0.0))
        self.assertEqual(plan[0][:2], (0, 0.0))
        k, t, d = plan[-1]
        self.assertEqual(k, 4)
        self.assertLessEqual(t + d, 95.0)
        self.assertGreater(t + d, 95.0 - music_kit.MIN_SCRAP_S)  # the ending starts at most this early
        for (_, t0, d0), (_, t1, _) in zip(plan, plan[1:]):
            self.assertAlmostEqual(t0 + d0, t1)
        self.assertTrue(all(d0 >= music_kit.MIN_SCRAP_S for _, _, d0 in plan[:-1]), plan)  # no scraps

    def test_the_adversary_gets_the_loud_dark_phrase(self):
        adversary = lambda a, b: (1.0, 1.0) if a >= 10 else (0.4, 0.0)  # noqa: E731
        plan = music_kit.arrange(self.blocks, 60.0, adversary)
        self.assertEqual(plan[1][0], 2)  # loud and dark, not the bright one that comes next in the track

    def test_under_the_voice_it_prefers_quiet_phrases_but_keeps_moving(self):
        plan = music_kit.arrange(self.blocks, 200.0, lambda a, b: (0.2, 0.0))
        body = [k for k, _, _ in plan[1:-1]]
        self.assertIn(3, body)
        self.assertGreater(len(set(body)), 1)  # reusing a phrase costs more each time


@unittest.skipIf(SKIP, SKIP)
class PlaceTest(unittest.TestCase):
    def test_joins_leave_no_gap(self):
        sr = 1000
        song = np.ones((46 * sr, 2))
        blocks = [block(0, 10, 0.0, 0.0), block(10, 20, 1.0, 0.0), block(20, 30, 0.5, 0.0), block(30, 46, 0.2, 0.0)]
        plan = [(0, 0.0, 10.0), (2, 10.0, 10.0), (1, 20.0, 10.0), (3, 30.0, 16.0)]
        out = music_kit.place(song, sr, blocks, plan, 46 * sr, xfade_s=0.08)
        self.assertGreater(np.min(np.abs(out[:, 0])), 0.7)  # equal-power: never dips to silence at a join
        self.assertLess(np.max(out[:, 0]), 1.5)


if __name__ == "__main__":
    unittest.main()
