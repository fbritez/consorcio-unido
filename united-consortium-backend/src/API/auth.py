"""Cookie based authentication for the API.

Two behaviours, driven by ``APP_ENV``:

* running locally (the default) every request is allowed through without
  looking at the cookie or the token, so development and the test suite keep
  working with no setup;
* running anywhere else the signed token is read from the auth cookie (or from
  an ``Authorization: Bearer`` header), verified, and the request is only served
  when the user it names still exists.
"""

import json
import logging
import os
from functools import wraps

from flask import g, request

from src.service.token_service import InvalidTokenError, TokenService
from src.service.user_service import UserService

AUTH_COOKIE_NAME = 'united_consortium_session'
LOCAL_ENVIRONMENTS = {'local', 'dev', 'development', 'test', 'tests'}

token_service = TokenService()
user_service = UserService()


def is_local_environment():
    """Whether the service is running locally, and so skips every check."""
    return os.environ.get('APP_ENV', 'local').strip().lower() in LOCAL_ENVIRONMENTS


def _use_secure_cookie():
    return not is_local_environment()


def read_token():
    """Get the raw token from the cookie, falling back to the bearer header."""
    token = request.cookies.get(AUTH_COOKIE_NAME)
    if token:
        return token

    authorization = request.headers.get('Authorization', '')
    if authorization.startswith('Bearer '):
        return authorization[len('Bearer '):].strip()

    return None


def build_claims(email, user=None):
    """Build the logged user details carried inside the token."""
    claims = {'sub': email, 'user_email': email}
    if user:
        claims['name'] = user.get('name') if isinstance(user, dict) else getattr(user, 'name', None)

    return claims


def generate_token_for(email, user=None):
    return token_service.generate_token(build_claims(email, user))


def set_auth_cookie(response, token):
    """Attach the session token as an HttpOnly cookie on the given response."""
    response.set_cookie(
        AUTH_COOKIE_NAME,
        token,
        httponly=True,
        secure=_use_secure_cookie(),
        samesite='None' if _use_secure_cookie() else 'Lax',
        max_age=token_service.ttl_seconds,
        path='/')

    return response


def clear_auth_cookie(response):
    response.set_cookie(
        AUTH_COOKIE_NAME,
        '',
        expires=0,
        httponly=True,
        secure=_use_secure_cookie(),
        samesite='None' if _use_secure_cookie() else 'Lax',
        path='/')

    return response


def _unauthorized(message):
    return json.dumps({'error': message}), 401, {'ContentType': 'application/json'}


def current_user():
    """The claims of the logged user, or ``None`` when running locally."""
    return getattr(g, 'current_user', None)


def resolve_current_user():
    """Validate the request token and return its claims, or raise.

    Raises ``InvalidTokenError`` when the token is missing, invalid, expired or
    names a user that is no longer available.
    """
    claims = token_service.decode_token(read_token())

    email = claims.get('user_email')
    if not email or not user_service.get_user(email):
        raise InvalidTokenError('User is no longer available')

    return claims


def authenticate(f):
    """Protect an endpoint with the session token.

    A no-op while the service runs locally, as required by the local
    development flow.
    """

    @wraps(f)
    def wrapper(*args, **kwargs):
        # CORS preflight requests never carry cookies, so they must not 401.
        if is_local_environment() or request.method == 'OPTIONS':
            return f(*args, **kwargs)

        try:
            g.current_user = resolve_current_user()
        except InvalidTokenError as error:
            logging.info('Rejected unauthenticated request to %s: %s', request.path, error)
            return _unauthorized(str(error))

        return f(*args, **kwargs)

    return wrapper
