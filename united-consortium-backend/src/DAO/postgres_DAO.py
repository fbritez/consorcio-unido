"""PostgreSQL backend: the shared SQLAlchemy DAOs bound to a Postgres engine.

The persistence itself lives in :mod:`src.DAO.orm_DAO` and is identical to the
SQLite one; only the engine changes.
"""

from src.DAO import orm_DAO


class _PostgresBound:
    backend_name = 'postgres'


class UserDAO(_PostgresBound, orm_DAO.UserDAO):
    pass


class LoginDAO(_PostgresBound, orm_DAO.LoginDAO):
    pass


class ConsortiumDAO(_PostgresBound, orm_DAO.ConsortiumDAO):
    pass


class ExpensesReceiptDAO(_PostgresBound, orm_DAO.ExpensesReceiptDAO):
    pass


class ClaimsDAO(_PostgresBound, orm_DAO.ClaimsDAO):
    pass


class NotificationDAO(_PostgresBound, orm_DAO.NotificationDAO):
    pass


class SettingsDAO(_PostgresBound, orm_DAO.SettingsDAO):
    pass


class ImageDAO(_PostgresBound, orm_DAO.ImageDAO):
    pass
