"""Issue and verify the signed session tokens stored in the auth cookie.

The token is a standard HS256 JWT built with the standard library only, so no
extra dependency is needed and any JWT aware client can still read the claims.
The signature is what makes it secure: the payload is readable but it cannot be
modified without the secret configured in ``AUTH_SECRET_KEY``.
"""

import base64
import hashlib
import hmac
import json
import logging
import os
import secrets
import time

ALGORITHM = 'HS256'
DEFAULT_TOKEN_TTL_SECONDS = 60 * 60 * 8

_HEADER = {'alg': ALGORITHM, 'typ': 'JWT'}

# Generated per process when no secret is configured, so a local run works out
# of the box while any real deployment is forced to set AUTH_SECRET_KEY (a new
# secret on every restart would invalidate every cookie issued before it).
_EPHEMERAL_SECRET = secrets.token_urlsafe(64)


class InvalidTokenError(Exception):
    """Raised when a token is malformed, tampered with or expired."""


def _base64url_encode(raw_bytes):
    return base64.urlsafe_b64encode(raw_bytes).rstrip(b'=').decode('ascii')


def _base64url_decode(segment):
    padding = '=' * (-len(segment) % 4)
    return base64.urlsafe_b64decode(segment + padding)


def _encode_segment(payload):
    return _base64url_encode(json.dumps(payload, sort_keys=True, separators=(',', ':')).encode('utf-8'))


class TokenService:

    def __init__(self, secret_key=None, ttl_seconds=None):
        self.secret_key = secret_key or self._resolve_secret_key()
        self.ttl_seconds = ttl_seconds or int(os.environ.get('AUTH_TOKEN_TTL_SECONDS', DEFAULT_TOKEN_TTL_SECONDS))

    @staticmethod
    def _resolve_secret_key():
        secret_key = os.environ.get('AUTH_SECRET_KEY')
        if secret_key:
            return secret_key
        logging.warning(
            'AUTH_SECRET_KEY is not set, falling back to a per process secret. '
            'Sessions will not survive a restart and will not be shared between workers.')
        return _EPHEMERAL_SECRET

    def _sign(self, signing_input):
        return hmac.new(self.secret_key.encode('utf-8'), signing_input.encode('ascii'), hashlib.sha256).digest()

    def generate_token(self, claims):
        """Build a signed token carrying the given user claims."""
        issued_at = int(time.time())
        payload = dict(claims)
        payload.update({'iat': issued_at, 'exp': issued_at + self.ttl_seconds})

        signing_input = '%s.%s' % (_encode_segment(_HEADER), _encode_segment(payload))

        return '%s.%s' % (signing_input, _base64url_encode(self._sign(signing_input)))

    def decode_token(self, token):
        """Return the claims of a valid token, or raise ``InvalidTokenError``."""
        if not token:
            raise InvalidTokenError('Missing token')

        segments = token.split('.')
        if len(segments) != 3:
            raise InvalidTokenError('Malformed token')

        header_segment, payload_segment, signature_segment = segments
        signing_input = '%s.%s' % (header_segment, payload_segment)

        try:
            signature = _base64url_decode(signature_segment)
            header = json.loads(_base64url_decode(header_segment))
            payload = json.loads(_base64url_decode(payload_segment))
        except (ValueError, TypeError) as error:
            raise InvalidTokenError('Malformed token') from error

        # Pin the algorithm instead of trusting the header, otherwise a client
        # could downgrade it to "none" and sign its own claims.
        if header.get('alg') != ALGORITHM:
            raise InvalidTokenError('Unsupported signing algorithm')

        if not hmac.compare_digest(signature, self._sign(signing_input)):
            raise InvalidTokenError('Invalid token signature')

        expiration = payload.get('exp')
        if not isinstance(expiration, int) or expiration <= int(time.time()):
            raise InvalidTokenError('Expired token')

        return payload
