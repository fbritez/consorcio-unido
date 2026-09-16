import json
from flask import Blueprint, request, abort, make_response
from flask_cors import cross_origin, CORS

from src.service.login_service import LoginService
from src.service.token_service import InvalidTokenError
from src.API.auth import (
    clear_auth_cookie,
    generate_token_for,
    is_local_environment,
    resolve_current_user,
    set_auth_cookie,
)
from src.API.utils import handle_errors

login_api = Blueprint('login_api', __name__)
CORS(login_api, supports_credentials=True)

service = LoginService()

@login_api.route('/validateUserEmail', methods=['GET'])
@cross_origin(supports_credentials=True)
@handle_errors(return_error_code=401)
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


    user_email = request.args.get('user_email')

    return json.dumps(service.validate_user_email(user_email)), 200



@login_api.route('/setCredentials', methods=['POST'])
@cross_origin(supports_credentials=True)
@handle_errors(return_error_code=500)
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
    user_email = request.json.get('user_email')
    password = request.json.get('password')
    service.set_credentials(user_email, password)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@login_api.route('/authenticate', methods=['POST'])
@cross_origin(supports_credentials=True)
@handle_errors(return_error_code=401)
def authenticate():
    """Authenticate a user.
        --
        tags:
            - Login
        parameters:
            - in: body
                name: credentials
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

    if not service.authenticate(user_email, password):
        abort(401)

    response = make_response(json.dumps({'success': True, 'user_email': user_email}), 200)
    response.headers['Content-Type'] = 'application/json'

    return set_auth_cookie(response, generate_token_for(user_email))


@login_api.route('/session', methods=['GET'])
@cross_origin(supports_credentials=True)
@handle_errors(return_error_code=401)
def session():
    """Return the logged user carried by the session cookie.
        --
        tags:
            - Login
        responses:
            200:
                description: Details of the logged user
            401:
                description: No valid session
    """
    if is_local_environment():
        return json.dumps({'authenticated': True, 'local': True}), 200, {'ContentType': 'application/json'}

    try:
        claims = resolve_current_user()
    except InvalidTokenError as error:
        return json.dumps({'authenticated': False, 'error': str(error)}), 401, {'ContentType': 'application/json'}

    return json.dumps({'authenticated': True, 'user_email': claims.get('user_email')}), 200, \
        {'ContentType': 'application/json'}


@login_api.route('/logout', methods=['POST'])
@cross_origin(supports_credentials=True)
@handle_errors(return_error_code=500)
def logout():
    """Drop the session cookie.
        --
        tags:
            - Login
        responses:
            200:
                description: Session closed
    """
    response = make_response(json.dumps({'success': True}), 200)
    response.headers['Content-Type'] = 'application/json'

    return clear_auth_cookie(response)

