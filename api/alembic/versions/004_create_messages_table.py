"""
Create messages table

Revision ID: 004
Revises: 003
Create Date: 2026-02-02
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

# revision identifiers, used by Alembic.
revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create messages table for Phase III AI chatbot."""
    op.create_table(
        'messages',
        sa.Column('message_id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('conversation_id', UUID(as_uuid=True), nullable=False),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('message_text', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('tool_calls', JSONB, nullable=True),
        sa.Column('message_metadata', JSONB, nullable=True),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.conversation_id'], ondelete='CASCADE'),
        sa.CheckConstraint("role IN ('user', 'assistant')", name='check_message_role')
    )

    # Create indexes for query performance
    op.create_index('idx_messages_conversation_id', 'messages', ['conversation_id'])
    op.create_index('idx_messages_timestamp', 'messages', ['timestamp'])
    op.create_index('idx_messages_conversation_timestamp', 'messages', ['conversation_id', 'timestamp'])


def downgrade() -> None:
    """Drop messages table."""
    op.drop_index('idx_messages_conversation_timestamp', table_name='messages')
    op.drop_index('idx_messages_timestamp', table_name='messages')
    op.drop_index('idx_messages_conversation_id', table_name='messages')
    op.drop_table('messages')
