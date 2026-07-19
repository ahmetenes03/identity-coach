"""enable row level security

Revision ID: 20260703_0002
Revises: 20260703_0001
Create Date: 2026-07-03
"""
from typing import Sequence, Union

from alembic import op


revision: str = "20260703_0002"
down_revision: Union[str, None] = "20260703_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


APP_TABLES = (
    "users",
    "habits",
    "check_ins",
    "strategies",
    "user_statistics",
)


def upgrade() -> None:
    # RLS is a Postgres feature; skip on SQLite so local dev / tests can run the
    # full migration chain. Postgres behaviour is unchanged.
    if op.get_bind().dialect.name != "postgresql":
        return
    for table_name in APP_TABLES:
        op.execute(f"ALTER TABLE public.{table_name} ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    if op.get_bind().dialect.name != "postgresql":
        return
    for table_name in APP_TABLES:
        op.execute(f"ALTER TABLE public.{table_name} DISABLE ROW LEVEL SECURITY")
