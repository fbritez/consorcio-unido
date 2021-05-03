import unittest

from src.model.user import User, ConsortiumMember


class UserTests(unittest.TestCase):

    def test_initialization(self):
        email = 'axample@domain.com'
        name = 'some name'
        user = User(email, name)

        self.assertEqual(user.get_name(), name)
        self.assertEqual(user.get_email(), email)


class ConsortiumMemberTests(unittest.TestCase):

    def test_initialization(self):
        email = 'axample@domain.com'
        member_id = 'identifier'
        user = User(email, '')

        member = ConsortiumMember(user, member_id)

        self.assertEqual(member.get_name(), member_id)
        self.assertEqual(member.get_email(), email)
