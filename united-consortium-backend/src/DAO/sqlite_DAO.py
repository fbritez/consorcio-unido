"""SQLite backend: the shared SQLAlchemy DAOs bound to a SQLite engine.

The persistence itself lives in :mod:`src.DAO.orm_DAO` and is identical to the
PostgreSQL one; only the engine changes.
"""

from src.DAO import orm_DAO
from src.DAO.orm_db import sqlite_database_path  # noqa: F401  (kept for callers/tests)


class _SQLiteBound:
    backend_name = 'sqlite'


class UserDAO(_SQLiteBound, orm_DAO.UserDAO):
    pass


class LoginDAO(_SQLiteBound, orm_DAO.LoginDAO):
    pass


class ConsortiumDAO(_SQLiteBound, orm_DAO.ConsortiumDAO):
    pass


class ExpensesReceiptDAO(_SQLiteBound, orm_DAO.ExpensesReceiptDAO):
    pass


class ClaimsDAO(_SQLiteBound, orm_DAO.ClaimsDAO):
    pass


class NotificationDAO(_SQLiteBound, orm_DAO.NotificationDAO):
    pass


class NotificationReactionDAO(_SQLiteBound, orm_DAO.NotificationReactionDAO):
    pass


class SettingsDAO(_SQLiteBound, orm_DAO.SettingsDAO):
    pass


class ImageDAO(_SQLiteBound, orm_DAO.ImageDAO):
    pass
