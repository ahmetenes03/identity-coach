"""Dependency-free, deterministic provider used as the default and as the
graceful fallback whenever a real provider is selected but unavailable.

- ``OfflineEmbedder`` hashes tokens into a fixed-dim L2-normalised vector, so
  lexically similar texts land close together under cosine similarity. It needs
  no model download and is fully reproducible (``hashlib``, not the salted
  built-in ``hash``).
- ``OfflineLLM`` renders an empathetic, identity-based coaching reply from the
  structured prompt the CoachAgent builds. It never executes anything found in
  the user's note; it only reads the labelled context lines.
"""
from __future__ import annotations

import hashlib
import math
import re
from typing import Any

from app.llm.base import BaseEmbedder, BaseLLM
from app.llm.prompt_format import (
    CATEGORY_LABEL as _CATEGORY_LABEL,
    HABIT_LABEL as _HABIT_LABEL,
    IDENTITY_LABEL as _IDENTITY_LABEL,
    STRATEGY_BLOCK as _STRATEGY_BLOCK,
    STRATEGY_SEPARATOR as _STRATEGY_SEPARATOR,
)

_TOKEN_RE = re.compile(r"\w+", re.UNICODE)

_CATEGORY_HINTS = {
    "motivation": "Motivasyonun düştüğü anlar normaldir; kimliğin, motivasyondan daha güvenilir bir pusuladır.",
    "time": "Zaman darlığında hedefi küçült: iki dakikalık bir versiyonu bile kimliğini besler.",
    "forgetting": "Unutmayı iradeyle değil, ortamla çöz: alışkanlığı zaten yaptığın bir işe iliştir.",
    "environment": "Ortamını sana çalışır hale getir; doğru olanı yapması kolay olsun.",
    "energy": "Enerjin düşükken küçük ama tutarlı bir adım, hiç adım atmamaktan değerlidir.",
    "overwhelm": "Kendini bunalmış hissettiğinde tek ve en küçük adıma odaklan; gerisi sonra gelir.",
    "distraction": "Dikkat dağıtıcıları önceden azalt; irade yerine tasarımına güven.",
    "other": "Bir günlük aksama, olmak istediğin kişiyi tanımlamaz; yarın geri dönmen tanımlar.",
}


def _tokens(text: str) -> list[str]:
    return _TOKEN_RE.findall(text.lower())


class OfflineEmbedder(BaseEmbedder):
    name = "offline"
    model = "hashing-bow"

    def __init__(self, dim: int = 256) -> None:
        self.dim = max(16, dim)

    def _embed_one(self, text: str) -> list[float]:
        vec = [0.0] * self.dim
        for token in _tokens(text):
            digest = hashlib.md5(token.encode("utf-8")).digest()
            idx = int.from_bytes(digest[:4], "big") % self.dim
            sign = 1.0 if digest[4] & 1 else -1.0
            vec[idx] += sign
        norm = math.sqrt(sum(v * v for v in vec))
        if norm > 0:
            vec = [v / norm for v in vec]
        return vec

    async def embed(self, texts: list[str]) -> list[list[float]]:
        return [self._embed_one(t) for t in texts]


class OfflineLLM(BaseLLM):
    name = "offline"
    model = "template-coach"

    async def chat(
        self,
        messages: list[dict],
        tools: list[dict] | None = None,
        temperature: float = 0.7,
    ) -> dict[str, Any]:
        user_text = ""
        for message in reversed(messages):
            if message.get("role") == "user":
                user_text = str(message.get("content", ""))
                break

        content = self._render(user_text)
        return {"content": content, "tool_calls": None}

    def _render(self, prompt: str) -> str:
        identity = self._field(prompt, _IDENTITY_LABEL)
        habit = self._field(prompt, _HABIT_LABEL)
        category = (self._field(prompt, _CATEGORY_LABEL) or "other").strip().lower()
        strategy = self._first_strategy(prompt)

        hint = _CATEGORY_HINTS.get(category, _CATEGORY_HINTS["other"])
        parts: list[str] = []

        if identity:
            parts.append(
                f"Bugün olmadı diye kendine yüklenme. Tek bir aksama, "
                f"“{identity}” olma yolculuğunu geçersiz kılmaz."
            )
        else:
            parts.append(
                "Bugün olmadı diye kendine yüklenme; bir aksama seni tanımlamaz."
            )

        parts.append(hint)

        if strategy:
            parts.append(f"Küçük bir deneme: {strategy}")

        habit_ref = f" “{habit}” alışkanlığında" if habit else ""
        parts.append(
            f"Yarın{habit_ref} en küçük adımı at — önemli olan kusursuzluk değil, "
            "kimliğine tekrar tekrar dönmen."
        )
        return " ".join(parts)

    @staticmethod
    def _field(prompt: str, label: str) -> str:
        for line in prompt.splitlines():
            stripped = line.strip()
            if stripped.startswith(label):
                return stripped[len(label):].strip()
        return ""

    @staticmethod
    def _first_strategy(prompt: str) -> str:
        lines = prompt.splitlines()
        try:
            start = next(i for i, ln in enumerate(lines) if _STRATEGY_BLOCK in ln)
        except StopIteration:
            return ""
        for line in lines[start + 1:]:
            stripped = line.strip()
            if not stripped:
                continue
            if stripped.startswith("["):
                break
            # Lines are rendered by prompt_format.format_strategy_line.
            match = re.match(r"^\d+\.\s*(.+)$", stripped)
            candidate = match.group(1) if match else stripped
            # Prefer the actionable content after the separator when present.
            if _STRATEGY_SEPARATOR.strip() in candidate:
                candidate = candidate.split(_STRATEGY_SEPARATOR.strip(), 1)[1].strip()
            return candidate
        return ""
