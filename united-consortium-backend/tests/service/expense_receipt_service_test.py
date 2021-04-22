import unittest
from unittest.mock import Mock, patch

from src.service.expense_receipt_service import ExpensesReceiptService

name = 'some name'
address = 'some address'


class ExpenseReceiptServiceTests(unittest.TestCase):

    def test_get_dao(self):
        mock_dao = Mock()
        service = ExpensesReceiptService(mock_dao)

        self.assertEqual(service.get_dao(), mock_dao)

    def test_expenses_for(self):
        mock_expense = Mock()
        mock_dao = Mock()
        mock_dao.get_all.return_value = [mock_expense]
        service = ExpensesReceiptService(mock_dao)
        expenses = service.get_expenses_for(name)

        mock_dao.get_all.assert_called_once_with({'consortium.name': name})
        self.assertEqual(expenses, [mock_expense])

    def test_update_expense(self):
        year_number = 2021
        month_string = 'April'
        mock_expense = Mock()
        mock_dao = Mock()

        mock_expense.consortium_name.return_value = name
        mock_expense.get_year.return_value = year_number
        mock_expense.get_month.return_value = month_string

        expected_value = {'consortium.name': name,
                          'year': year_number,
                          'month': month_string}

        service = ExpensesReceiptService(mock_dao)
        service.update_expense(mock_expense)

        mock_dao.update_all.assert_called_once_with(expected_value, mock_expense)
