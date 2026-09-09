import os


class BaseBackend:
    def __init__(self, backend_name):
        self.backend_name = backend_name

    def get_dao(self, name):
        raise NotImplementedError


class MongoBackend(BaseBackend):
    def __init__(self):
        super().__init__('mongo')
        from src.DAO.mongo_DAO import (
            ClaimsDAO,
            ConsortiumDAO,
            ExpensesReceiptDAO,
            ImageDAO,
            LoginDAO,
            NotificationDAO,
            SettingsDAO,
            UserDAO,
        )
        self.daos = {
            'claims': ClaimsDAO,
            'consortium': ConsortiumDAO,
            'expenses_receipt': ExpensesReceiptDAO,
            'image': ImageDAO,
            'login': LoginDAO,
            'notification': NotificationDAO,
            'settings': SettingsDAO,
            'user': UserDAO,
        }

    def get_dao(self, name):
        dao_class = self.daos.get(name)
        if dao_class is None:
            raise ValueError(f'Unsupported Mongo DAO: {name}')
        return dao_class()


class PostgresBackend(BaseBackend):
    def __init__(self):
        super().__init__('postgres')
        from src.DAO.postgres_DAO import (
            ClaimsDAO,
            ConsortiumDAO,
            ExpensesReceiptDAO,
            LoginDAO,
            NotificationDAO,
            SettingsDAO,
            UserDAO,
        )
        self.daos = {
            'claims': ClaimsDAO,
            'consortium': ConsortiumDAO,
            'expenses_receipt': ExpensesReceiptDAO,
            'login': LoginDAO,
            'notification': NotificationDAO,
            'settings': SettingsDAO,
            'user': UserDAO,
        }

    def get_dao(self, name):
        dao_class = self.daos.get(name)
        if dao_class is None:
            raise ValueError(f'Unsupported PostgreSQL DAO: {name}')
        return dao_class()


class SQLiteBackend(BaseBackend):
    def __init__(self):
        super().__init__('sqlite')
        from src.DAO.sqlite_DAO import (
            ClaimsDAO,
            ConsortiumDAO,
            ExpensesReceiptDAO,
            ImageDAO,
            LoginDAO,
            NotificationDAO,
            SettingsDAO,
            UserDAO,
        )
        self.daos = {
            'claims': ClaimsDAO,
            'consortium': ConsortiumDAO,
            'expenses_receipt': ExpensesReceiptDAO,
            'image': ImageDAO,
            'login': LoginDAO,
            'notification': NotificationDAO,
            'settings': SettingsDAO,
            'user': UserDAO,
        }

    def get_dao(self, name):
        dao_class = self.daos.get(name)
        if dao_class is None:
            raise ValueError(f'Unsupported SQLite DAO: {name}')
        return dao_class()


class DAOFactory:
    @staticmethod
    def resolve_backend_name():
        backend_name = os.environ.get('DB_BACKEND', 'mongo').strip().lower()
        if backend_name not in {'mongo', 'postgres', 'sqlite'}:
            backend_name = 'mongo'
        return backend_name

    @staticmethod
    def create_default_backend():
        backend_name = DAOFactory.resolve_backend_name()
        if backend_name == 'postgres':
            return PostgresBackend()
        if backend_name == 'sqlite':
            return SQLiteBackend()
        return MongoBackend()

    @staticmethod
    def create_dao(name):
        return DAOFactory.create_default_backend().get_dao(name)
