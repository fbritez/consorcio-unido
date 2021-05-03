import unittest
from unittest.mock import Mock, patch

from src.service.login_service import LoginService


class LoginServiceTest(unittest.TestCase):

    def test_invalidate_email_user(self):
        mock_service = Mock()
        mock_service.get_consortium_for.return_value = []
        service = LoginService(consortium_service=mock_service)

        with self.assertRaises(Exception) as context:
            service.validate_user_email('no@email.com')

    def test_valid_user_first_login(self):
        mock_service = Mock()
        mock_service.get_consortium_for.return_value = [1]
        mock_dao = Mock()
        mock_dao.get_all.return_value = []
        service = LoginService(dao=mock_dao, consortium_service=mock_service)

        result = service.validate_user_email('email@example.com')
        self.assertEqual(result, [])

    def test_set_credentials(self):
        mock_dao = Mock()
        service = LoginService(dao=mock_dao, consortium_service=Mock())
        password = 'qwertyuiop'
        email = 'example@example.com'
        service.set_credentials(email, password)

        mock_dao.insert.assert_called_with({'user_email': email, 'password': password})

    def test_authenticate(self):
        mock_dao = Mock()
        service = LoginService(dao=mock_dao, consortium_service=Mock())
        password = 'qwertyuiop'
        email = 'example@example.com'
        service.authenticate(email, password)

        mock_dao.get_all.assert_called_with({'user_email': email, 'password': password})


