"""add category type

Revision ID: b810481d2c49
Revises: 07aaec0b35de
Create Date: 2026-06-13 13:07:39.435060

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b810481d2c49"
down_revision: Union[str, Sequence[str], None] = "07aaec0b35de"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "categories",
        sa.Column(
            "type",
            sa.String(),
            nullable=False,
            server_default="expense",
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("categories", "type")