
import unittest
from unittest.mock import Mock, patch

from src.model.user import User
from src.service.user_service import UserService


class UserServiceTest(unittest.TestCase):

    def test_get_user_data(self):
        mock_dao = Mock()
        email = 'some@email.com'
        name = 'some name'

        mock_dao.get_all.return_value = User(email, name)

        service = UserService(mock_dao)

        user = service.get_user(email)

        self.assertEqual(user.get_email(), email)
        self.assertEqual(user.get_name(), name)