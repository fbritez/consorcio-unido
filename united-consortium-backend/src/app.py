# coding=utf-8
from flask import Flask, request
from flask_cors import CORS, cross_origin
import json

from src.service.consorsium_service import ConsortiumService
from src.service.expense_service import ExpenseService

app = Flask(__name__)
CORS(app, suppport_credentials=True)

consortium_service = ConsortiumService()

@app.route('/expenses', methods=['GET'])
@cross_origin(support_credentials=True)
def expenses():

    return ExpenseService.get_expense_for()

@app.route('/consortiums', methods=['GET'])
@cross_origin(support_credentials=True)
def consortiums():

    return {
        'consortiums': [consortium.__dict__ for consortium in consortium_service.get_consortium_for()]
    }

if __name__ == '__main__':
    app.run()