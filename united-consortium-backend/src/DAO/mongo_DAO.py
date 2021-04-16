import json

from pymongo import MongoClient

from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt


class GenericDAO(object):

    def __init__(self):
        client = MongoClient('localhost:27017')
        self.db = client.unitedConsortiums

    def insert_all(self, elements):
        for element in elements:
            json_element = json.loads(json.dumps(element.__dict__, default= lambda obj: obj.__dict__ ))
            self.collection().insert_one(json_element)

    def get_all(self, query_obj = None):
        elements = self.collection().find(query_obj)
        return self.create_model_from_collection(elements)

    def create_model_from_collection(self, elements):
        return [self.create_model(element) for element in elements]

    def update_all(self, query_obj, new_element):
        self.collection().update_one(query_obj, {"$set": new_element})

    def collection(self):
        pass


class ConsortiumDAO(GenericDAO):

    def collection(self):
        return self.db.consortiums

    def create_model(self, element):
        return Consortium(element.get('name'), element.get('address'), element.get('members'))


class ExpensesReceiptDAO(GenericDAO):

    def collection(self):
        return self.db.espenses_receipts

    def create_model(self, element):
        items = [ExpenseItem(item.get('title'), item.get('description'), item.get('amount')) for item in element.get('expense_items')]

        consortium = ConsortiumDAO().create_model(element.get('consortium'))
        receipt = ExpensesReceipt(consortium, element.get('month'), element.get('year'), expense_items=items)
        return receipt
