"""Pruebas reales: controles, variantes, errores y paquete entregado."""
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VERIFY = ROOT / "public/labs/yara-practice/verify.py"


def run_verifier(script=VERIFY, *args):
    return subprocess.run([sys.executable, "-X", "utf8", str(script), *map(str, args)],
                          capture_output=True, text=True, encoding="utf-8")


class RealEngineTests(unittest.TestCase):
    def test_reference_expectations(self):
        result = run_verifier()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("12/12", result.stdout)

    def test_overbroad_rule_fails_controls(self):
        with tempfile.TemporaryDirectory(prefix="alertopolis-yara-") as folder:
            rule = Path(folder) / "broad.yar"
            rule.write_text('rule MiRegla { condition: true }', encoding="utf-8")
            result = run_verifier(VERIFY, "--rule", rule, "--name", "MiRegla")
            self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
            self.assertIn("FAIL benign-route.dat", result.stdout)

    def test_overfit_rule_misses_variant_c(self):
        with tempfile.TemporaryDirectory(prefix="alertopolis-yara-") as folder:
            rule = Path(folder) / "overfit.yar"
            rule.write_text('rule MiRegla { strings: $a="cicada-demo-v1" ascii wide nocase '
                            '$b="route=/collect-demo" ascii wide condition: $a and $b }', encoding="utf-8")
            result = run_verifier(VERIFY, "--rule", rule, "--name", "MiRegla")
            self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
            self.assertIn("FAIL c-heldout.dat", result.stdout)

    def test_invalid_syntax_is_an_error_not_no_match(self):
        with tempfile.TemporaryDirectory(prefix="alertopolis-yara-") as folder:
            rule = Path(folder) / "invalid.yar"
            rule.write_text('rule Invalid { condition: and }', encoding="utf-8")
            result = run_verifier(VERIFY, "--rule", rule)
            self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
            self.assertIn("ERROR de compilacion", result.stderr)

    def test_download_bundle_runs_independently(self):
        with tempfile.TemporaryDirectory(prefix="alertopolis-yara-zip-") as folder:
            with zipfile.ZipFile(ROOT / "public/labs/yara-practice.zip") as archive:
                self.assertEqual(len(archive.namelist()), 18)
                self.assertTrue(all(not Path(name).is_absolute() and ".." not in Path(name).parts
                                    for name in archive.namelist()))
                archive.extractall(folder)
            result = run_verifier(Path(folder) / "verify.py")
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main(verbosity=2)
