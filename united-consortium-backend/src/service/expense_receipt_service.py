from bson import ObjectId
import copy

from src.DAO.mongo_DAO import ExpensesReceiptDAO
from src.model.expeses_receipt import MemberExpensesReceipt
from src.notifications.notifications import EspensesReceiptNotification
from src.service.consorsium_service import ConsortiumService


class ExpensesReceiptService:

    def __init__(self, dao=ExpensesReceiptDAO(), consortium_service=ConsortiumService()):
        self.dao = dao
        self.consortium_service = consortium_service
        self.publisher_services = []

    def get_dao(self):
        return self.dao

    def create_model(self, expense_json):
        return self.dao.create_model(expense_json)

    def add_publisher(self, publisher):
        self.publisher_services.append(publisher)

    def add_publishers(self, publishers):
        for publisher in publishers:
            self.publisher_services.append(publisher)

    def get_expenses_for(self, consortium_id, user_email):
        consortium = self.consortium_service.get_consortium(consortium_id)
        is_administrator = consortium.is_administrator(user_email)

        query_obj = {'consortium_id': consortium_id}

        if not is_administrator:
            query_obj['is_open'] = False

        expenses = self.dao.get_all(query_obj)

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
        consortium = self.consortium_service.get_consortium(expenses_receipt.consortium_identifier())
        for service in self.publisher_services:
            notification = EspensesReceiptNotification(expenses_receipt, consortium)
            service.notify(notification)

    def generate_receipt(self, expenses_receipt):
        consortium = self.consortium_service.get_consortium(expenses_receipt.consortium_identifier())
        self.generate_member_recepits(consortium, expenses_receipt)

        self.update_expense(expenses_receipt)
        self.publish_receipt_close(expenses_receipt)

    def generate_member_recepits(self, consortium, expenses_receipt):
        receipts = []
        for member in consortium.get_members():
            items = [copy.deepcopy(item) for item in expenses_receipt.get_expenses_items() if item.is_for(member)]
            [item.set_values_for(consortium, member) for item in items]
            receipt = MemberExpensesReceipt(member, items)
            receipts.append(receipt)
        expenses_receipt.set_member_receipts(receipts)
