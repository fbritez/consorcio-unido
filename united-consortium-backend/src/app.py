# coding=utf-8
from flask import Flask, request
from src.API.consortium_api import consortium_api
from src.API.expenses_receipt_api import expenses_receipt_api


app = Flask(__name__)

app.register_blueprint(consortium_api)
app.register_blueprint(expenses_receipt_api)


if __name__ == '__main__':
    app.run()
