import json

from flask import Blueprint, request
from flask_cors import cross_origin, CORS

from src.service.expense_receipt_service import ExpensesReceiptService
from src.utils.utils import json_dumps
import logging

expenses_receipt_api = Blueprint('expenses_receipt_api', __name__)
CORS(expenses_receipt_api, suppport_credentials=True)

service = ExpensesReceiptService()

@expenses_receipt_api.route('/expenses', methods=['GET'])
@cross_origin(support_credentials=True)
def expenses():
    consortium_id = request.args.get('consortium_identifier')
    selectedExpenses = service.get_expenses_for(consortium_id)
    return {
        'expenses': [json_dumps(expense_receipt) for expense_receipt in
                     selectedExpenses]
    }


@expenses_receipt_api.route('/newExpenses', methods=['POST'])
@cross_origin(support_credentials=True)
def new_expenses():
    try:
        updatedExpensesReceipt = request.json.get('updatedExpensesReceipt')
        expense_receipt = service.create_model(updatedExpensesReceipt)

        service.update_expense(expense_receipt)
    except Exception as ex:
        logging.error(ex)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}