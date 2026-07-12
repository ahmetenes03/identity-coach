from pydantic import BaseModel, Field

from app.config import get_settings

# Tek doğruluk kaynağı Settings.coach_reason_max_chars (COACH_REASON_MAX_CHARS).
# Ayarlar import anında okunur ve süreç boyunca sabittir.
_REASON_MAX_CHARS = get_settings().coach_reason_max_chars


class CoachRequest(BaseModel):
    habit_id: str = Field(min_length=1, max_length=36)
    reason_text: str = Field(min_length=3, max_length=_REASON_MAX_CHARS)
    check_in_id: str | None = Field(default=None, max_length=36)


class StrategyOut(BaseModel):
    """Public view of a strategy — deliberately excludes the raw embedding."""

    id: str
    title: str
    source: str | None = None
    trigger_category: str | None = None
    content: str
    example_advice: str | None = None

    model_config = {"from_attributes": True}


class CoachResponse(BaseModel):
    reflection_id: str
    category: str
    category_label: str
    message: str
    strategies: list[StrategyOut]
    streak: int
    top_pattern: str | None = None
    provider: str
    model: str
