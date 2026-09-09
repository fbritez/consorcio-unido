import os
import unittest
from unittest.mock import MagicMock, patch

from src.DAO.dao_factory import DAOFactory, MongoBackend, PostgresBackend, SQLiteBackend


class StrategyFactoryTest(unittest.TestCase):

    def setUp(self):
        self.previous = os.environ.get('DB_BACKEND')

    def tearDown(self):
        if self.previous is not None:
            os.environ['DB_BACKEND'] = self.previous
        else:
            os.environ.pop('DB_BACKEND', None)

    def test_default_backend_is_mongo(self):
        os.environ.pop('DB_BACKEND', None)

        backend_name = DAOFactory.resolve_backend_name()

        self.assertEqual(backend_name, 'mongo')
        self.assertIsInstance(DAOFactory.create_default_backend(), MongoBackend)

    def test_invalid_backend_defaults_to_mongo(self):
        os.environ['DB_BACKEND'] = 'oracle'

        self.assertEqual(DAOFactory.resolve_backend_name(), 'mongo')
        self.assertIsInstance(DAOFactory.create_default_backend(), MongoBackend)

    def test_postgres_backend_is_supported(self):
        os.environ['DB_BACKEND'] = 'postgres'

        backend_name = DAOFactory.resolve_backend_name()

        self.assertEqual(backend_name, 'postgres')
        self.assertIsInstance(DAOFactory.create_default_backend(), PostgresBackend)

    def test_sqlite_backend_is_supported(self):
        os.environ['DB_BACKEND'] = 'sqlite'

        backend_name = DAOFactory.resolve_backend_name()

        self.assertEqual(backend_name, 'sqlite')
        self.assertIsInstance(DAOFactory.create_default_backend(), SQLiteBackend)

    def test_postgres_factory_exposes_core_dao_methods(self):
        os.environ['DB_BACKEND'] = 'postgres'

        for dao_name in ['claims', 'consortium', 'expenses_receipt', 'login', 'notification', 'settings', 'user']:
            dao = DAOFactory.create_dao(dao_name)
            self.assertTrue(hasattr(dao, 'get_all'))
            self.assertTrue(hasattr(dao, 'insert'))

    def test_sqlite_factory_exposes_core_dao_methods(self):
        os.environ['DB_BACKEND'] = 'sqlite'

        for dao_name in ['claims', 'consortium', 'expenses_receipt', 'login', 'notification', 'settings', 'user']:
            dao = DAOFactory.create_dao(dao_name)
            self.assertTrue(hasattr(dao, 'get_all'))
            self.assertTrue(hasattr(dao, 'insert'))

    def test_mongo_backend_returns_user_dao_when_pymongo_available(self):
        backend = MongoBackend()
        fake_client = MagicMock()
        fake_client.unitedConsortiums = MagicMock()

        with patch('src.DAO.mongo_DAO.MongoClient', return_value=fake_client):
            dao = backend.get_dao('user')

        self.assertTrue(hasattr(dao, 'get_all'))
        self.assertTrue(hasattr(dao, 'insert'))

    def test_unknown_dao_name_raises_value_error(self):
        for backend in [MongoBackend(), PostgresBackend(), SQLiteBackend()]:
            with self.assertRaises(ValueError):
                backend.get_dao('unsupported_dao')
