# coding=utf-8
from flask import Flask
from flasgger import Swagger

from src.API.image_api import image_api
from src.API.login_api import login_api
from src.API.consortium_api import consortium_api
from src.API.claims_api import claims_api
from src.API.expenses_receipt_api import expenses_receipt_api
from src.API.notification_api import notification_api
from src.API.settings_api import settings_api
from src.API.user_api import user_api
from src.swagger_config import swagger_template

app = Flask(__name__)
app.config['SWAGGER'] = {
    'title': 'United Consortium API',
    'uiversion': 3,
    'openapi': '3.0.2'
}

Swagger(app, template=swagger_template)

app.register_blueprint(consortium_api)
app.register_blueprint(expenses_receipt_api)
app.register_blueprint(login_api)
app.register_blueprint(user_api)
app.register_blueprint(image_api)
app.register_blueprint(settings_api)
app.register_blueprint(notification_api)
app.register_blueprint(claims_api)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
