from bson import ObjectId
import copy

from src.DAO.mongo_DAO import ExpensesReceiptDAO
from src.model.expense_item import ExpenseItem
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

    def update_expenses_receipts(self, expenses_receipts):
        for receipts in expenses_receipts:
            self.update_expenses_receipt(receipts)

    def update_expenses_receipt(self, new_receipt):
        query_obj = {'consortium_id': new_receipt.consortium_identifier(),
                     'year': new_receipt.get_year(),
                     'month': new_receipt.get_month()}

        if self.dao.get_all(query_obj):
            result = self.dao.update_all(query_obj, new_receipt)
        else:
            result = self.dao.insert(new_receipt)

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

    def get_expenses_receipt(self, receipt_id):
        return self.dao.get_all({'_id': ObjectId(receipt_id)})[0]

    def publish_receipt_close(self, expenses_receipt):
        consortium = self.consortium_service.get_consortium(expenses_receipt.consortium_identifier())
        for service in self.publisher_services:
            notification = EspensesReceiptNotification(expenses_receipt, consortium)
            service.notify(notification)

    def generate_receipt(self, expenses_receipt):
        consortium = self.consortium_service.get_consortium(expenses_receipt.consortium_identifier())

        non_process_receipts = self._get_non_process_receipts_from(expenses_receipt.consortium_identifier())

        items = self._get_accumulated_debts(non_process_receipts)
        expenses_receipt.add_expenses_items(items)

        self._generate_member_recepits(consortium, expenses_receipt)

        self.update_expenses_receipt(expenses_receipt)
        self._mark_as_processed(non_process_receipts)

        self.publish_receipt_close(expenses_receipt)

    def _get_non_process_receipts_from(self, consortium_id):
        query_obj = {'consortium_id': consortium_id,
                     'is_open': False,
                     'payment_processed': False
                     }

        return self.dao.get_all(query_obj)

    def _mark_as_processed(self, non_process_receipts):

        for receipt in non_process_receipts:
            receipt.process_payment()

        self.update_expenses_receipts(non_process_receipts)

    def _get_accumulated_debts(self, expenses_receipts):

        result = []
        for expense in expenses_receipts:
            for member_expenses_receipt in expense.get_non_payment_receipts():
                result.append(self._create_expenses_item_from(expense, member_expenses_receipt))

        return result

    def _create_expenses_item_from(self, expense, member_expenses_receipt):
        title = f'Deuda Pendiente {member_expenses_receipt.get_member().get_name()}'
        description = f'{title} {expense.get_month()} - {expense.get_year()}'
        amount = member_expenses_receipt.get_pending_amount()
        members = [member_expenses_receipt.get_member()]
        return ExpenseItem(title, description, amount, members=members)

    def _generate_member_recepits(self, consortium, expenses_receipt):
        receipts = []
        for member in consortium.get_members():
            items = [copy.deepcopy(item) for item in expenses_receipt.get_expenses_items() if item.is_for(member)]
            [item.set_values_for(consortium, member) for item in items]
            receipt = MemberExpensesReceipt(member, items)
            receipts.append(receipt)
        expenses_receipt.set_member_receipts(receipts)
