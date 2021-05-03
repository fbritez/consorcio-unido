import unittest
import uuid
from unittest.mock import Mock

from src.model.consortium import Consortium


class ConsortiumTests(unittest.TestCase):

    def test_initialization(self):
        name = 'some name'
        address = 'some address'
        consortium = Consortium(name, address, [])
        self.assertEqual(consortium.get_name(), name)
        self.assertEqual(consortium.get_address(), address)
        self.assertEqual(consortium.get_members(), [])

    def test_add_member(self):
        name = 'some name'
        address = 'some address'
        mock_member = Mock()
        consortium = Consortium(name, address)
        consortium.add_member(mock_member)
        self.assertEqual(consortium.get_members(), [mock_member])

    def test_id(self):
        name = 'some name'
        address = 'some address'
        consortium = Consortium(name, address)

        id = uuid.uuid4()

        consortium.set_id(id)

        self.assertEqual(consortium.get_id(), id)


if __name__ == '__main__':
    unittest.main()