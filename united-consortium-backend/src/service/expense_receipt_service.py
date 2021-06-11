from bson import ObjectId

from src.DAO.mongo_DAO import ExpensesReceiptDAO
from src.notifications.notifications import EspensesReceiptNotification
from src.service.consorsium_service import ConsortiumService
from src.service.notification_service import NotificationService


class ExpensesReceiptService:

    def __init__(self, dao=ExpensesReceiptDAO(), consortium_service=ConsortiumService()):
        self.dao = dao
        self.consortium_service = consortium_service
        self.publisher_services = []

    def get_dao(self):
        return self.dao

    def create_model(self, expense_json):
        return self.dao.create_model(expense_json)

    def add_publisher(self, publihser):
        self.publisher_services.append(publihser)

    def get_expenses_for(self, consortium_id, user_email):
        consortium = self.consortium_service.get_consortium(consortium_id)
        is_administrator = consortium.is_administrator(user_email)

        expenses = self.dao.get_all(
            {'consortium_id': consortium_id}) if is_administrator else self.generate_expenses_for(consortium,
                                                                                                  user_email)

        expenses.sort(key=lambda exp: exp.get_sort_criteria(), reverse=True)
        return expenses

    def update_expense(self, new_expense):
        query_obj = {'consortium_id': new_expense.consortium_identifier(),
                     'year': new_expense.get_year(),
                     'month': new_expense.get_month()}

        if self.dao.get_all(query_obj):
            result = self.dao.update_all(query_obj, new_expense)
        else:
            result = self.dao.insert(new_expense)

        return result

    def generate_expenses_for(self, consortium, user_email):

        query_obj = {'consortium_id': consortium.get_id(),
                     'is_open': False
                     }

        expenses = self.dao.get_all(query_obj)
        for expense in expenses:
            items = [item for item in expense.get_expenses_items() if item.is_for(user_email)]
            [item.set_values_for(consortium, user_email) for item in items]

            expense.set_expenses_items(items)

        return expenses

    def get_expenses_receipt(self, expenses_id):
        return self.dao.get_all({'_id': ObjectId(expenses_id)})[0]

    def publish_receipt_close(self, expenses_receipt):
        self.update_expense(expenses_receipt)
        for service in self.publisher_services:
            p = EspensesReceiptNotification(expenses_receipt)
            service.notify(p)

