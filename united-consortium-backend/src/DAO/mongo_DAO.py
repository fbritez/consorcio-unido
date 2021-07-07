import json

from pymongo import MongoClient

from src.model.claim import Claim, ClaimMessage
from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt, MemberExpensesReceipt
from src.model.user import User, ConsortiumMember
import gridfs


class GenericDAO(object):

    def __init__(self, db_client=MongoClient('localhost:27017')):
        self.db = db_client.unitedConsortiums

    def object_to_json(self, element):
        return json.loads(json.dumps(element, default=lambda obj: obj.__dict__))

    def insert_all(self, elements):
        for element in elements:
            json_element = self.object_to_json(element)
            self.collection().insert_one(json_element)

    def insert(self, element):
        self.insert_all([element])

    def get_all(self, query_obj=None):
        elements = self.collection().find(query_obj)
        return self.create_model_from_collection(elements)

    def create_model_from_collection(self, elements):
        return [self.create_model(element) for element in elements]

    def update_all(self, query_obj, new_element):
        json_element = self.object_to_json(new_element)
        self.collection().update_one(query_obj, {"$set": json_element})

    def collection(self):
        pass

    def create_model(self):
        pass


class ConsortiumDAO(GenericDAO):

    def collection(self):
        return self.db.consortiums

    def create_model(self, element):
        from src.model.user import ConsortiumMember

        members = [ConsortiumMember(member.get('user_email'), member.get('member_name'), member.get('secondary_email'),
                                    member.get('notes')) for member in
                   element.get('members', [])]

        name = element.get('name')
        address = element.get('address')
        administrators = [adm for adm in element.get('administrators', [])]
        disabled = element.get('disabled')
        c_id = element.get('id')

        return Consortium(name, address, members, administrators, disabled, c_id)


class ExpensesReceiptDAO(GenericDAO):

    def collection(self):
        return self.db.espenses_receipts

    def create_model(self, element):
        object_id = element.get('_id')
        items = self.generate_items_from(element.get('expense_items'))

        member_receipts = [self.generate_member_receipt(r) for r in element.get('member_expenses_receipt_details', [])]

        receipt = ExpensesReceipt(element.get('consortium_id'), element.get('month'), element.get('year'),
                                  expense_items=items, is_open=element.get('is_open'), identifier=str(object_id),
                                  member_expenses_receipt_details=member_receipts,
                                  payment_processed=element.get('payment_processed'))
        return receipt

    def generate_member_receipt(self, element):
        consortium = consortiumMemberBuilder(element.get('member'))
        items = self.generate_items_from(element.get('expenses_items', []))
        filename = element.get('filename')

        return MemberExpensesReceipt(consortium, items, element.get('paid'), element.get('paid_amount'), filename)

    def _generate_members(self, item):
        return [ConsortiumMember(member.get('user_email'), member.get('member_name')) for member in
                item.get('members', [])]

    def generate_items_from(self, items=[]):
        return [ExpenseItem(item.get('title'),
                            item.get('description'),
                            item.get('amount'),
                            item.get('ticket'),
                            self._generate_members(item))
                for item in items]


class LoginDAO(GenericDAO):

    def collection(self):
        return self.db.login

    def create_model(self, element):
        return element


class UserDAO(GenericDAO):

    def collection(self):
        return self.db.users

    def create_model(self, element):
        return User(element.get('email'), element.get('name'))


class ImageDAO(GenericDAO):

    def store(self, file_id, file):
        fs = gridfs.GridFS(self.db)
        fs.put(file.read(), filename=file_id)

    def read(self, file_id):
        fs = gridfs.GridFS(self.db)
        file = fs.find_one({'filename': file_id})

        return file.read()


class BasicDataTypeDAO(GenericDAO):

    def get(self, query_obj):
        response = self.collection().find(query_obj)
        values = [value for value in response]
        for value in values:
            value.pop('_id', None)
        return values

    def update(self, query_obj, settings):
        self.collection().update_one(query_obj, {"$set": settings})

    def insert_all(self, elements):
        for element in elements:
            self.collection().insert_one(element)


class SettingsDAO(BasicDataTypeDAO):

    def collection(self):
        return self.db.settings


class NotificationDAO(BasicDataTypeDAO):

    def collection(self):
        return self.db.notifications


class ClaimsDAO(GenericDAO):

    def collection(self):
        return self.db.claims

    def create_model(self, element):
        messages = [ClaimMessage(message.get('owner'), message.get('message'), message.get('filename')) for message in element.get('messages')]
        return Claim(element.get('identifier'), element.get('consortium_id'), element.get('owner'), element.get('title'), element.get('state', None), element.get('creation_date'), messages=messages)


def consortiumMemberBuilder(json_dict):
    return ConsortiumMember(json_dict.get('user_email'), json_dict.get('member_name'), json_dict.get('secondary_email'), json_dict.get('notes'))


