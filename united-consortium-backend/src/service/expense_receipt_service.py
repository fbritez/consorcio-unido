from src.DAO.mongo_DAO import ExpensesReceiptDAO


class ExpensesReceiptService():

    def __init__(self, dao=ExpensesReceiptDAO()):
        self.dao = dao

    def get_dao(self):
        return self.dao

    def get_expenses_for(self, consortium_name):
        exp = self.dao.get_all({'consortium.name': consortium_name})
        return exp

    def update_expense(self, new_expense):
        return self.dao.update_all({'consortium.name': new_expense.consortium_name(),
                                    'year': new_expense.get_year(),
                                    'month': new_expense.get_month()},
                                   new_expense)
