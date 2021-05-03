import json

from pymongo import MongoClient

from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt


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

        members = [ConsortiumMember(member.get('user_email'), member.get('member_name')) for member in
                   element.get('members')]

        return Consortium(element.get('name'), element.get('address'), members, element.get('id'))


class ExpensesReceiptDAO(GenericDAO):

    def collection(self):
        return self.db.espenses_receipts

    def create_model(self, element):
        items = [ExpenseItem(item.get('title'), item.get('description'), item.get('amount')) for item in
                 element.get('expense_items')]

        receipt = ExpensesReceipt(element.get('consortium_id'), element.get('month'), element.get('year'),
                                  expense_items=items)
        return receipt


class LoginDAO(GenericDAO):

    def collection(self):
        return self.db.login

    def create_model(self, element):
        return element
