import bcrypt
import os


class PasswordService:
    """Service for secure password encryption and validation."""

    ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY', 'default-secure-key-change-in-production')

    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a password using bcrypt with a salt.

        Args:
            password: Plain text password to hash

        Returns:
            Hashed password as a string
        """
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """
        Verify a plain text password against a hashed password.

        Args:
            password: Plain text password to verify
            hashed_password: Previously hashed password to compare against

        Returns:
            True if password matches, False otherwise
        """
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
