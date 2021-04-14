from pymongo import MongoClient

from src.model.consortium import Consortium
from src.model.expeses_receipt import ExpensesReceipt


class GenericDAO(object):

    def __init__(self):
        client = MongoClient('localhost:27017')
        self.db = client.unitedConsortiums

    def insert_all(self, elements):
        for element in elements:
            self.collection().insert_one(element.__dict__)

    def get_all(self):
        elements = self.collection().find()
        return [self.create_model(element) for element in elements]

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
        receipt = ExpensesReceipt(element.get('title'), element.get('description'))
        return receipt
