"""Backwards compatible entry point for the PostgreSQL engine.

The mapping and the engine handling are shared with SQLite and live in
:mod:`src.DAO.orm_db`.
"""

from src.DAO.orm_db import (  # noqa: F401
    Base,
    create_schema,
    database_url,
    get_db_session,
    get_engine,
    get_session,
    postgres_database_url,
)


DATABASE_URL = postgres_database_url()


def engine():
    return get_engine(DATABASE_URL)


def SessionLocal():
    return get_session(DATABASE_URL)
