# coding=utf-8
from flask import Flask

from src.API.image_api import image_api
from src.API.login_api import login_api
from src.API.consortium_api import consortium_api
from src.API.claims_api import claims_api
from src.API.expenses_receipt_api import expenses_receipt_api
from src.API.notification_api import notification_api
from src.API.settings_api import settings_api
from src.API.user_api import user_api

app = Flask(__name__)

app.register_blueprint(consortium_api)
app.register_blueprint(expenses_receipt_api)
app.register_blueprint(login_api)
app.register_blueprint(user_api)
app.register_blueprint(image_api)
app.register_blueprint(settings_api)
app.register_blueprint(notification_api)
app.register_blueprint(claims_api)

if __name__ == '__main__':
    app.run()
