"""Shared prompt-format contract.

CoachAgent renders the coaching prompt with these labels and OfflineLLM parses
them back; both sides import from this leaf module so the format can never
drift apart silently. Keep this module dependency-free (no app imports) to
avoid cycles between app.agents and app.llm.
"""

IDENTITY_LABEL = "Kimlik hedefi:"
CATEGORY_LABEL = "Kategori:"
HABIT_LABEL = "Alışkanlık:"
STRATEGY_BLOCK = "[BILIMSEL_STRATEJILER]"
NOTE_BLOCK = "[KULLANICI_NOTU]"
STRATEGY_SEPARATOR = " — "


def format_strategy_line(index: int, title: str, content: str) -> str:
    return f"{index}. {title}{STRATEGY_SEPARATOR}{content}"


# Turkish display names for failure categories. The backend owns presentation
# so the frontend never has to enumerate backend enum values.
CATEGORY_LABELS_TR = {
    "motivation": "Motivasyon",
    "time": "Zaman",
    "forgetting": "Unutma",
    "environment": "Ortam",
    "energy": "Enerji",
    "overwhelm": "Bunalma",
    "distraction": "Dikkat Dağınıklığı",
    "other": "Diğer",
}
