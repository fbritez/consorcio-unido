import unittest
from unittest.mock import Mock, patch
from unittest import mock

name = 'some name'
address = 'some address'


class ExpenseReceiptServiceTests(unittest.TestCase):

    @mock.patch('src.service.expense_receipt_service.ExpenseReceiptDAO.get_all')
    def test_expenses_for(self, mock_dao):
        mock_dao.return_value = [Consortium(name, address)]
        service = ConsortiumService()
        consortiums = service.get_consortium_for()

        self.assertEqual(consortiums, [Consortium(name, address)])