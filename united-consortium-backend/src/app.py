# coding=utf-8
from flask import Flask, request
from flask_cors import CORS, cross_origin
import json

from src.DAO.mongo_DAO import ExpensesReceiptDAO
from src.service.consorsium_service import ConsortiumService
from src.service.expense_receipt_service import ExpensesReceiptService

app = Flask(__name__)
CORS(app, suppport_credentials=True)

consortium_service = ConsortiumService()
expenses_service = ExpensesReceiptService()


def json_dumps(some_object):
    return json.loads(json.dumps(some_object.__dict__, default=lambda obj: obj.__dict__))

@app.route('/expenses', methods=['GET'])
@cross_origin(support_credentials=True)
def expenses():
    consortium_name = request.args.get('consortium_name')

    return {
        'expenses': [json_dumps(expense_receipt) for expense_receipt in expenses_service.get_expenses_for(consortium_name)]
    }

@app.route('/newExpenses', methods=['POST'])
@cross_origin(support_credentials=True)
def newExpenses():
    # remove this dependency:
    # other dummy change
    expense_receipt = ExpensesReceiptDAO().create_model(request.json.get('newExpense'))

    expenses_service.udpate_expense(expense_receipt)



@app.route('/consortiums', methods=['GET'])
@cross_origin(support_credentials=True)
def consortiums():

    return {
        'consortiums': [consortium.__dict__ for consortium in consortium_service.get_consortium_for()]
    }

if __name__ == '__main__':
    app.run()