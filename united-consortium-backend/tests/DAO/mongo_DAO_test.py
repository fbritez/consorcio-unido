import unittest
from src.DAO.mongo_DAO import ConsortiumDAO, GenericDAO
from src.model.consortium import Consortium

name = 'some name'
address = 'some address'


class ConsortiumDAOTest(unittest.TestCase):

    def test_create_Model(self):
        service = ConsortiumDAO()
        element = {'name': name, 'address': address, 'members': []}
        model_obj = service.create_model(element)

        self.assertEqual(model_obj, Consortium(name, address))
