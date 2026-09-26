"""stream_safetensors_into() against safetensors' own writer. Needs torch (run with the Chatterbox venv):

    video/engine/.venv-chatterbox/Scripts/python.exe -m unittest discover -s video/engine/scripts -p "test_*.py"
"""
import tempfile
import unittest
from pathlib import Path

try:
    import torch
    from safetensors.torch import save_file
except ImportError:  # system Python without the venv
    torch = None


@unittest.skipIf(torch is None, "needs the Chatterbox venv (torch + safetensors)")
class StreamSafetensorsTest(unittest.TestCase):
    def _module(self):
        m = torch.nn.Sequential(torch.nn.Linear(4, 3), torch.nn.LayerNorm(3), torch.nn.Embedding(5, 2))
        m.register_buffer("counts", torch.zeros(2, dtype=torch.int64))
        return m

    def test_loads_every_tensor_with_its_dtype(self):
        from chatterbox_worker import stream_safetensors_into

        src = self._module()
        with torch.no_grad():
            for t in src.state_dict().values():
                t.copy_(torch.randint(0, 9, t.shape).to(t.dtype))
        dst = self._module()
        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / "m.safetensors"
            save_file({k: v.contiguous() for k, v in src.state_dict().items()}, str(path))
            stream_safetensors_into(dst, path)
        for key, value in src.state_dict().items():
            self.assertTrue(torch.equal(value, dst.state_dict()[key]), key)
            self.assertEqual(value.dtype, dst.state_dict()[key].dtype, key)

    def test_missing_buffer_keeps_its_built_value(self):
        from chatterbox_worker import stream_safetensors_into

        src = self._module()
        dst = self._module()
        with torch.no_grad():
            dst.counts.fill_(7)
        state = {k: v.contiguous() for k, v in src.state_dict().items() if k != "counts"}
        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / "m.safetensors"
            save_file(state, str(path))
            stream_safetensors_into(dst, path)
        self.assertTrue(torch.equal(dst.counts, torch.full((2,), 7, dtype=torch.int64)))

    def test_rejects_missing_weights(self):
        from chatterbox_worker import stream_safetensors_into

        state = {k: v.contiguous() for k, v in self._module().state_dict().items() if k != "0.weight"}
        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / "m.safetensors"
            save_file(state, str(path))
            with self.assertRaises(KeyError):
                stream_safetensors_into(self._module(), path)

    def test_rejects_mismatched_keys(self):
        from chatterbox_worker import stream_safetensors_into

        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / "m.safetensors"
            save_file({"other.weight": torch.ones(2)}, str(path))
            with self.assertRaises(KeyError):
                stream_safetensors_into(self._module(), path)


if __name__ == "__main__":
    unittest.main()
