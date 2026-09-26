"""Text helpers for the Chatterbox worker (standard library only, so they test without the venv).

    python -m unittest discover -s video/engine/scripts -p "test_*.py"
"""
from __future__ import annotations

import re
import unicodedata
from difflib import SequenceMatcher

_NON_ALNUM = re.compile(r"[^a-z0-9]+")


def normalize(text: str) -> str:
    """Lowercase letters and digits only, accents folded (ñ -> n), no spaces or punctuation."""
    folded = unicodedata.normalize("NFD", text.lower())
    folded = "".join(ch for ch in folded if unicodedata.category(ch) != "Mn")
    return _NON_ALNUM.sub("", folded)


def script_score(script: str, transcript: str) -> float:
    """
    How closely a transcript follows the script, from 0 to 1, compared character by
    character after normalize(). Respellings the voice reads correctly ("jash" vs
    "hash") or numbers the recogniser writes as digits cost a few points; a take that
    drops or repeats a clause costs many, which is what the worker retries on.
    """
    a, b = normalize(script), normalize(transcript)
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a, b, autojunk=False).ratio()
