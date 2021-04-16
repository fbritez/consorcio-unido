import unittest
from unittest import mock
from src.model.consortium import Consortium
from src.service.consorsium_service import ConsortiumService

name = 'some name'
address = 'some address'


class ConsortiumServiceTests(unittest.TestCase):

    @mock.patch('src.service.consorsium_service.ConsortiumDAO.get_all')
    def test_consortiums_for(self, mock_dao):
        mock_dao.return_value = [Consortium(name, address)]
        service = ConsortiumService()
        consortiums = service.get_consortium_for()

        self.assertEqual(consortiums, [Consortium(name, address)])
