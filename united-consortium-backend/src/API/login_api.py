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
    """Validate whether an email is registered.
        --
        tags: [Login]
        parameters:
            - name: user_email
                in: query
                required: true
                type: string
        responses:
            200:
                description: Email validation result
            401:
                description: Validation failed
    """

    try:
        user_email = request.args.get('user_email')

        return json.dumps(service.validate_user_email(user_email)), 200

    except Exception:
        abort(401)


@login_api.route('/setCredentials', methods=['POST'])
@cross_origin(support_credentials=True)
def set_credentials():
    """Set a user's password.
        --
        tags:
            - Login
        parameters:
            - in: body
                name: credentials
                required: true
                schema:
                    type: object
                    required:
                        - user_email
                        - password
                    properties:
                        user_email:
                            type: string
                        password:
                            type: string
        responses:
            200:
                description: Credentials updated
            500:
                description: Credentials could not be updated
    """
    try:
        user_email = request.json.get('user_email')
        password = request.json.get('password')

        service.set_credentials(user_email, password)
    except:
        abort(500)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@login_api.route('/authenticate', methods=['POST'])
@cross_origin(support_credentials=True)
def authenticate():
    """Authenticate a user.
        --
        tags:
            - Login
        parameters:
            - in: body
                name: credentials
                required: true
                schema:
                    type: object
                    required:
                        - user_email
                        - password
                    properties:
                        user_email:
                            type: string
                        password:
                            type: string
        responses:
            200:
                description: Authentication successful
            401:
                description: Invalid credentials
    """

    user_email = request.json.get('user_email')
    password = request.json.get('password')

    result = service.authenticate(user_email, password)

    if result:
        result = json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    else:
        abort(401)

    return result

