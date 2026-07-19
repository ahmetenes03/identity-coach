"""ai coach tables

Adds the RAG embedding column to strategies and the failure_reflections /
coach_interactions tables, then enables Row Level Security on the new tables to
match the existing security baseline.

Revision ID: 20260712_0003
Revises: 20260703_0002
Create Date: 2026-07-12
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260712_0003"
down_revision: Union[str, None] = "20260703_0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

NEW_TABLES = ("failure_reflections", "coach_interactions")


def upgrade() -> None:
    op.add_column("strategies", sa.Column("embedding", sa.JSON(), nullable=True))

    op.create_table(
        "failure_reflections",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("habit_id", sa.String(length=36), nullable=False),
        sa.Column("check_in_id", sa.String(length=36), nullable=True),
        sa.Column("reason_text", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=40), nullable=False),
        sa.Column("embedding", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["habit_id"], ["habits.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["check_in_id"], ["check_ins.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_failure_reflections_user_id"), "failure_reflections", ["user_id"], unique=False
    )
    op.create_index(
        op.f("ix_failure_reflections_habit_id"), "failure_reflections", ["habit_id"], unique=False
    )

    op.create_table(
        "coach_interactions",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("habit_id", sa.String(length=36), nullable=False),
        sa.Column("failure_reflection_id", sa.String(length=36), nullable=True),
        sa.Column("category", sa.String(length=40), nullable=True),
        sa.Column("response_text", sa.Text(), nullable=False),
        sa.Column("strategy_ids", sa.JSON(), nullable=True),
        sa.Column("provider", sa.String(length=40), nullable=True),
        sa.Column("model", sa.String(length=80), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["habit_id"], ["habits.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["failure_reflection_id"], ["failure_reflections.id"], ondelete="SET NULL"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_coach_interactions_user_id"), "coach_interactions", ["user_id"], unique=False
    )
    op.create_index(
        op.f("ix_coach_interactions_habit_id"), "coach_interactions", ["habit_id"], unique=False
    )

    # Enable RLS on Postgres only (SQLite ignores/rejects the statement).
    if op.get_bind().dialect.name == "postgresql":
        for table_name in NEW_TABLES:
            op.execute(f"ALTER TABLE public.{table_name} ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    if op.get_bind().dialect.name == "postgresql":
        for table_name in NEW_TABLES:
            op.execute(f"ALTER TABLE public.{table_name} DISABLE ROW LEVEL SECURITY")

    op.drop_index(op.f("ix_coach_interactions_habit_id"), table_name="coach_interactions")
    op.drop_index(op.f("ix_coach_interactions_user_id"), table_name="coach_interactions")
    op.drop_table("coach_interactions")

    op.drop_index(op.f("ix_failure_reflections_habit_id"), table_name="failure_reflections")
    op.drop_index(op.f("ix_failure_reflections_user_id"), table_name="failure_reflections")
    op.drop_table("failure_reflections")

    op.drop_column("strategies", "embedding")
