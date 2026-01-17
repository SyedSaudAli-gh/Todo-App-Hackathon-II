"""
Add user_id column to todos table

Revision ID: 002
Revises: 001
Create Date: 2026-01-12
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add user_id column to todos table with index."""
    # Add user_id column (nullable to handle existing todos)
    op.add_column('todos', sa.Column('user_id', sa.String(length=255), nullable=True))

    # Create index on user_id for query performance
    op.create_index('idx_todos_user_id', 'todos', ['user_id'], unique=False)


def downgrade() -> None:
    """Remove user_id column and index from todos table."""
    # Drop index first
    op.drop_index('idx_todos_user_id', table_name='todos')

    # Drop user_id column
    op.drop_column('todos', 'user_id')
