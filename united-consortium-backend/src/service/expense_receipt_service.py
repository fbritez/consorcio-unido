from src.DAO.mongo_DAO import ExpensesReceiptDAO


class ExpensesReceiptService():

    def __init__(self, dao=ExpensesReceiptDAO()):
        self.dao = dao

    def get_dao(self):
        return self.dao

    def create_model(self, expense_json):
        return self.dao.create_model(expense_json)

    def get_expenses_for(self, consortium_id):
        exp = self.dao.get_all({'consortium_id': consortium_id})
        return exp

    def update_expense(self, new_expense):
        query_obj = {'consortium_id': new_expense.consortium_identifier(),
                     'year': new_expense.get_year(),
                     'month': new_expense.get_month()}

        if self.dao.get_all(query_obj):
            result = self.dao.update_all(query_obj, new_expense)
        else:
            result = self.dao.insert(new_expense)

        return result
