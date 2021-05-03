import unittest
from unittest.mock import Mock, patch

from src.DAO.mongo_DAO import ConsortiumDAO, GenericDAO
from src.model.consortium import Consortium

name = 'some name'
address = 'some address'

mock_db_client = Mock()

class DummyObject:

    def __init__(self):
        self.string_value = 'String'
        self.integer_value = 12345
        self.list_value = [1, 'string', 1.5, "string"]
        self.dict_value = {
                            'string':'string',
                            'number': 1,
                            'list' : ['string, 1'],
                            'dict': { 'value' : 'value'}
                            }

    def json(self):
        return {'dict_value': {'dict': {'value': 'value'},
                'list': ['string, 1'],
                'number': 1,
                'string': 'string'},
                'integer_value': 12345,
                'list_value': [1, 'string', 1.5, 'string'],
                'string_value': 'String'
                }

class GenericDAOTest(unittest.TestCase):

    def test_object_to_json(self):
        some_object = DummyObject()
        expected_json = some_object.json()
        service = GenericDAO(mock_db_client)

        json = service.object_to_json(some_object)

        self.assertEqual(json, expected_json)


    @patch('src.DAO.mongo_DAO.GenericDAO.collection')
    def test_insert_all(self, mock_collection_access):
        some_object = DummyObject()
        expected_json = some_object.json()
        service = GenericDAO(mock_db_client)
        service.insert_all([some_object])

        mock_collection_access.asset_called_with(expected_json)

    @patch('src.DAO.mongo_DAO.GenericDAO.insert_all')
    def test_insert(self, mock_insert_all_method):
        some_object = DummyObject()
        service = GenericDAO(mock_db_client)
        service.insert(some_object)

        mock_insert_all_method.assert_called_with([some_object])

    @patch('src.DAO.mongo_DAO.GenericDAO.create_model')
    def test_create_model_from_collection(self, mock_create_model_function):
        some_object = DummyObject()
        service = GenericDAO(mock_db_client)
        service.create_model_from_collection([some_object])

        mock_create_model_function.assert_called_with(some_object)

    @patch('src.DAO.mongo_DAO.GenericDAO.object_to_json')
    @patch('src.DAO.mongo_DAO.GenericDAO.collection')
    def test_update_all(self, mock_collection_access, mock_object_json_func):
        some_object = DummyObject()
        expectedJson = some_object.json()
        query_dict = {}
        service = GenericDAO(mock_db_client)
        service.update_all(query_dict, some_object)

        mock_object_json_func.asset_called_with(some_object)
        mock_collection_access.update_one.asset_called_with(query_dict, {"$set": expectedJson})




class ConsortiumDAOTest(unittest.TestCase):

    def test_create_Model(self):
        service = ConsortiumDAO()
        element = {'name': name, 'address': address, 'members': []}
        model_obj = service.create_model(element)

        self.assertEqual(model_obj, Consortium(name, address))
