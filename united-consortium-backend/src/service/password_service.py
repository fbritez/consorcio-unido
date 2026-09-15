import bcrypt


class PasswordService:
    """Service for secure password hashing and validation using bcrypt."""

    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a password using bcrypt with auto-generated salt.

        bcrypt automatically:
        - Generates a random salt
        - Applies it to the password
        - Returns a hash that includes the salt embedded within it

        Args:
            password: Plain text password to hash

        Returns:
            Hashed password string (includes salt, format: $2b$rounds$salt+hash)
        """
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """
        Verify a plain text password against a bcrypt hash.

        bcrypt.checkpw automatically:
        - Extracts the salt from the stored hash
        - Applies that same salt to the incoming password
        - Compares the results

        Args:
            password: Plain text password to verify
            hashed_password: Previously hashed password from database

        Returns:
            True if password matches, False otherwise
        """
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
        except Exception:
            return False
