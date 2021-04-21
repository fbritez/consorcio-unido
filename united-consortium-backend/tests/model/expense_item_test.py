import unittest

from src.model.expense_item import ExpenseItem


class ExpensesReceiptTest(unittest.TestCase):

    def test_initialization(self):
        amount = 1000
        item = ExpenseItem('title', 'description', amount)

        self.assertEqual(item.get_amount(), amount)
