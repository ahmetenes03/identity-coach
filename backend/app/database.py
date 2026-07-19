from collections.abc import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings


settings = get_settings()
_is_sqlite = settings.database_url.startswith("sqlite")
# On SQLite give writers up to 15s to acquire the lock instead of failing
# immediately with "database is locked" (Postgres/Supabase ignores this).
connect_args = {"check_same_thread": False, "timeout": 15} if _is_sqlite else {}

engine = create_engine(settings.database_url, connect_args=connect_args)

if _is_sqlite:
    @event.listens_for(engine, "connect")
    def _sqlite_pragmas(dbapi_connection, _record):
        cursor = dbapi_connection.cursor()
        # WAL lets reads run concurrently with a writer; busy_timeout backs the
        # connect timeout at the SQL layer.
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA busy_timeout=15000")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
