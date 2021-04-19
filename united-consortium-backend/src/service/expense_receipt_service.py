from src.DAO.mongo_DAO import ExpensesReceiptDAO
from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt


class ExpenseReceipt(object):
    pass


class ExpensesReceiptService:

    def __init__(self):
        self.dao = ExpensesReceiptDAO()

    def get_expenses_for(self, consortium_name):
        exp = self.dao.get_all({'consortium.name': consortium_name})
        return exp

    def udpate_expense(self, new_expense):

        return self.dao.update_all({'consortium.name': new_expense.consortium_name(),
                                    'year': new_expense.get_year(),
                                    'month': new_expense.get_month()},
                                   new_expense)
