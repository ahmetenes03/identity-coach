"""Test harness: an isolated file-based SQLite DB and the offline provider, so
the whole suite runs with zero external services and zero API keys.

Environment must be set BEFORE importing app.config/app.database, since settings
are cached at first import.
"""
import asyncio
import os
import pathlib
import tempfile

# --- isolate the database + force the deterministic provider -----------------
_TEST_DB = pathlib.Path(tempfile.gettempdir()) / "identity_coach_test.db"
if _TEST_DB.exists():
    _TEST_DB.unlink()

os.environ["DATABASE_URL"] = "sqlite:///" + str(_TEST_DB).replace("\\", "/")
os.environ["LLM_PROVIDER"] = "offline"
os.environ["EMBEDDING_PROVIDER"] = "offline"
# Seed explicitly below instead of on app startup, for deterministic control.
os.environ["AUTO_SEED_STRATEGIES"] = "false"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app import models  # noqa: E402,F401  (register all tables)
from app.database import Base, SessionLocal, engine  # noqa: E402
from app.services import strategy_service  # noqa: E402

Base.metadata.create_all(bind=engine)

# Seed the strategy pool once for the whole test session.
with SessionLocal() as _db:
    asyncio.run(strategy_service.seed_strategies(_db))


@pytest.fixture()
def client() -> TestClient:
    from app.main import app

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def auth_headers(client: TestClient):
    """Register a fresh user and return its Authorization header."""
    from uuid import uuid4

    def _make(name: str = "Test User") -> dict:
        email = f"user.{uuid4().hex}@example.com"
        resp = client.post(
            "/api/auth/register",
            json={"name": name, "email": email, "password": "StrongPass123"},
        )
        assert resp.status_code == 201, resp.text
        return {"Authorization": f"Bearer {resp.json()['access_token']}"}

    return _make
