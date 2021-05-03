import json
from flask import Blueprint, request, abort
from flask_cors import cross_origin, CORS

from src.service.login_service import LoginService

login_api = Blueprint('login_api', __name__)
CORS(login_api, suppport_credentials=True)

service = LoginService()

@login_api.route('/validateUserEmail', methods=['GET'])
@cross_origin(support_credentials=True)
def validate_user_email():

    try:
        user_email = request.args.get('user_email')

        return json.dumps(service.validate_user_email(user_email)), 200

    except Exception:
        abort(401)


@login_api.route('/setCredentials', methods=['POST'])
@cross_origin(support_credentials=True)
def set_credentials():
    try:
        user_email = request.args.get('user_email')
        password = request.args.get('password')

        service.set_credentials(user_email, password)
    except:
        abort(500)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@login_api.route('/authenticate', methods=['POST'])
@cross_origin(support_credentials=True)
def authenticate():

    user_email = request.args.get('user_email')
    password = request.args.get('password')

    result = service.authenticate(user_email, password)

    if result:
        result = json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    else:
        abort(401)

    return result

