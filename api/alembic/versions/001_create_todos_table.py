"""
Create todos table

Revision ID: 001
Revises:
Create Date: 2026-01-06
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create todos table with indexes."""
    op.create_table(
        'todos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.String(length=2000), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index('idx_todos_created_at', 'todos', ['created_at'], unique=False, postgresql_ops={'created_at': 'DESC'})
    op.create_index('idx_todos_completed', 'todos', ['completed'], unique=False)


def downgrade() -> None:
    """Drop todos table and indexes."""
    op.drop_index('idx_todos_completed', table_name='todos')
    op.drop_index('idx_todos_created_at', table_name='todos')
    op.drop_table('todos')
