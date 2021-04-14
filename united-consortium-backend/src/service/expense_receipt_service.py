from src.DAO.mongo_DAO import ExpensesReceiptDAO
from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt


class ExpenseReceipt(object):
    pass


class ExpensesReceiptService:

    def __init__(self):
        self.dao = ExpensesReceiptDAO()
        self.initMockData()

    def initMockData(self):
        receipt = ExpensesReceipt(Consortium('Deco Torre', 'address'), expense_items = [ExpenseItem('titulo', 'description', 100), ExpenseItem('titulo', 'description', 100)])
        return receipt

    def get_expenses_for(self):
        return {}
