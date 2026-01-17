"""
Database connection and session management using SQLModel.
"""
from sqlmodel import create_engine, Session, SQLModel
from src.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    Dependency for getting database session.

    Yields:
        Session: Database session
    """
    with Session(engine) as session:
        yield session
