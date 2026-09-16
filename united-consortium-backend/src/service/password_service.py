from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash


class PasswordService:
    """Service for secure password hashing and validation using argon2."""

    _hasher = PasswordHasher()

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using argon2."""
        return PasswordService._hasher.hash(password)

    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """Verify a plain text password against an argon2 hash."""
        try:
            PasswordService._hasher.verify(hashed_password, password)
            return True
        except (VerifyMismatchError, InvalidHash):
            return False
