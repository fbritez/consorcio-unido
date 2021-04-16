import unittest
from unittest.mock import Mock

from src.model.expeses_receipt import ExpensesReceipt


class ExpensesReceiptTest(unittest.TestCase):

    def test_initialization(self):
        mock_consortium = Mock()
        mock_consortium.get_name.return_value = 'some name'
        receipt = ExpensesReceipt(mock_consortium, 'April', 2021)

        self.assertEqual(receipt.get_consortium(), mock_consortium)
        self.assertEqual(receipt.consortium_name(), mock_consortium.get_name())
        self.assertEqual(receipt.get_year(), 2021)
        self.assertEqual(receipt.get_month(), 'April')
        self.assertEqual(receipt.get_expeses_items(), [])

    def test_total_amount(self):
        mock_consortium = Mock()
        mock_item_1 = Mock()
        mock_item_1.get_amount.return_value = 100
        mock_item_2 = Mock()
        mock_item_2.get_amount.return_value = 100
        items = [mock_item_1, mock_item_2]
        receipt = ExpensesReceipt(mock_consortium, expese_items=items)

        self.assertEqual(receipt.get_total_amount(), 200)

