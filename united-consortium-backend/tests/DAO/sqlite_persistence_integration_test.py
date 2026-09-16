import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import MagicMock

from src.DAO.dao_factory import DAOFactory
from src.DAO.orm_db import dispose_engine
from src.model.claim import Claim, ClaimMessage
from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt
from src.model.user import ConsortiumMember
from src.service.claims_service import ClaimsService
from src.service.consorsium_service import ConsortiumService
from src.service.expense_receipt_service import ExpensesReceiptService
from src.service.login_service import LoginService
from src.service.notification_service import NotificationService
from src.service.settings_service import SettingsService
from src.service.user_service import UserService


class SQLitePersistenceIntegrationTest(unittest.TestCase):
    """Drives the services against a real SQLite file through the DAO factory."""

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.previous_backend = os.environ.get('DB_BACKEND')
        self.previous_path = os.environ.get('SQLITE_DATABASE_PATH')
        os.environ['DB_BACKEND'] = 'sqlite'
        os.environ['SQLITE_DATABASE_PATH'] = str(Path(self.directory.name) / 'integration.db')

        self.services = []
        self.user_service = self._track(UserService())
        self.consortium_service = self._track(ConsortiumService(user_service=self.user_service))
        self.consortium_service.email_service = MagicMock()
        self.login_service = self._track(
            LoginService(consortium_service=self.consortium_service))
        self.receipt_service = self._track(
            ExpensesReceiptService(consortium_service=self.consortium_service))
        self.claims_service = self._track(
            ClaimsService(consortium_service=self.consortium_service))
        self.settings_service = self._track(SettingsService())
        self.notification_service = self._track(NotificationService())

    def _track(self, service):
        """Keeps the service DAO so its connection can be closed on teardown."""
        self.services.append(service)
        return service

    def tearDown(self):
        for service in self.services:
            service.dao._close()
        for url in {service.dao.url for service in self.services}:
            dispose_engine(url)
        self._restore('DB_BACKEND', self.previous_backend)
        self._restore('SQLITE_DATABASE_PATH', self.previous_path)
        self.directory.cleanup()

    @staticmethod
    def _restore(name, value):
        if value is None:
            os.environ.pop(name, None)
        else:
            os.environ[name] = value

    def save_consortium(self):
        members = [ConsortiumMember('member@mail.com', 'Member One', 'second@mail.com'),
                   ConsortiumMember('other@mail.com', 'Member Two')]
        consortium = Consortium('Los Tilos', 'Calle Falsa 123', members, ['admin@mail.com'])
        self.consortium_service.save_update_consortium(consortium)
        return consortium

    def test_the_factory_returns_sqlite_daos(self):
        self.assertEqual(DAOFactory.resolve_backend_name(), 'sqlite')
        self.assertEqual(self.consortium_service.dao.__class__.__module__, 'src.DAO.sqlite_DAO')

    def test_consortium_round_trip(self):
        saved = self.save_consortium()

        read = self.consortium_service.get_consortium(saved.get_id())

        self.assertEqual(read.get_name(), 'Los Tilos')
        self.assertEqual(read.get_address(), 'Calle Falsa 123')
        self.assertEqual(read.get_members_count(), 2)
        self.assertEqual(read.get_administrators(), ['admin@mail.com'])

    def test_saving_a_consortium_registers_its_members_as_users(self):
        self.save_consortium()

        self.assertTrue(self.user_service.get_user('member@mail.com'))
        self.assertTrue(self.user_service.get_user('second@mail.com'))
        self.assertTrue(self.user_service.get_user('other@mail.com'))
        self.assertFalse(self.user_service.get_user('unknown@mail.com'))

    def test_consortium_lookup_by_member_and_administrator(self):
        saved = self.save_consortium()

        for email in ['member@mail.com', 'second@mail.com', 'admin@mail.com']:
            found = self.consortium_service.get_consortium_for(email)
            self.assertEqual([consortium.get_id() for consortium in found], [saved.get_id()], email)

        self.assertEqual(self.consortium_service.get_consortium_for('nobody@mail.com'), [])

    def test_consortium_update_is_persisted(self):
        saved = self.save_consortium()

        saved.add_member(ConsortiumMember('third@mail.com', 'Member Three'))
        saved.name = 'Los Tilos II'
        self.consortium_service.save_update_consortium(saved)

        read = self.consortium_service.get_consortium(saved.get_id())
        self.assertEqual(read.get_name(), 'Los Tilos II')
        self.assertEqual(read.get_members_count(), 3)
        self.assertEqual(len(self.consortium_service.dao.get_all()), 1)

    def test_login_credentials_round_trip(self):
        self.login_service.set_credentials('member@mail.com', 'secret')

        self.assertTrue(self.login_service.authenticate('member@mail.com', 'secret'))
        self.assertFalse(self.login_service.authenticate('member@mail.com', 'wrong'))
        self.assertFalse(self.login_service.validate_user_email('member@mail.com'))
        self.assertTrue(self.login_service.validate_user_email('nobody@mail.com'))

    def test_expenses_receipt_round_trip(self):
        consortium = self.save_consortium()
        receipt = ExpensesReceipt(consortium.get_id(), 'Enero', 2024,
                                  [ExpenseItem('Luz', 'Factura de luz', 1000)])

        self.receipt_service.update_expenses_receipt(receipt)

        read = self.receipt_service.get_expenses_for(consortium.get_id(), 'admin@mail.com')
        self.assertEqual(len(read), 1)
        self.assertEqual(read[0].get_month(), 'Enero')
        self.assertEqual(read[0].get_total_amount(), 1000)
        self.assertEqual(len(read[0].get_expenses_items()[0].get_members()), 2)

    def test_updating_a_receipt_does_not_duplicate_it(self):
        consortium = self.save_consortium()
        self.receipt_service.update_expenses_receipt(
            ExpensesReceipt(consortium.get_id(), 'Enero', 2024,
                            [ExpenseItem('Luz', 'Factura de luz', 1000)]))

        self.receipt_service.update_expenses_receipt(
            ExpensesReceipt(consortium.get_id(), 'Enero', 2024,
                            [ExpenseItem('Luz', 'Factura de luz', 1500)], is_open=False))

        read = self.receipt_service.get_expenses_for(consortium.get_id(), 'admin@mail.com')
        self.assertEqual(len(read), 1)
        self.assertEqual(read[0].get_total_amount(), 1500)
        self.assertFalse(read[0].is_open)

    def test_closed_receipts_only_are_visible_for_a_plain_member(self):
        consortium = self.save_consortium()
        self.receipt_service.update_expenses_receipt(
            ExpensesReceipt(consortium.get_id(), 'Enero', 2024,
                            [ExpenseItem('Luz', 'Factura', 1000)], is_open=True))
        self.receipt_service.update_expenses_receipt(
            ExpensesReceipt(consortium.get_id(), 'Febrero', 2024,
                            [ExpenseItem('Agua', 'Factura', 500)], is_open=False))

        member_view = self.receipt_service.get_expenses_for(consortium.get_id(), 'member@mail.com')
        admin_view = self.receipt_service.get_expenses_for(consortium.get_id(), 'admin@mail.com')

        self.assertEqual([receipt.get_month() for receipt in member_view], ['Febrero'])
        self.assertEqual([receipt.get_month() for receipt in admin_view], ['Febrero', 'Enero'])

    def test_receipt_by_identifier_is_read_back(self):
        consortium = self.save_consortium()
        receipt = ExpensesReceipt(consortium.get_id(), 'Enero', 2024,
                                  [ExpenseItem('Luz', 'Factura', 1000)])
        self.receipt_service.update_expenses_receipt(receipt)

        stored = self.receipt_service.get_expenses_for(consortium.get_id(), 'admin@mail.com')[0]
        read = self.receipt_service.get_expenses_receipt(stored.identifier)

        self.assertEqual(read.get_month(), 'Enero')
        self.assertEqual(read.identifier, stored.identifier)

    def test_generating_a_receipt_persists_the_member_receipts(self):
        consortium = self.save_consortium()
        receipt = ExpensesReceipt(consortium.get_id(), 'Enero', 2024,
                                  [ExpenseItem('Luz', 'Factura de luz', 1000)])

        self.receipt_service.generate_receipt(receipt)

        read = self.receipt_service.get_expenses_for(consortium.get_id(), 'admin@mail.com')[0]
        member_receipts = read.member_expenses_receipt_details
        self.assertEqual(len(member_receipts), 2)
        self.assertEqual({item.get_member().get_email() for item in member_receipts},
                         {'member@mail.com', 'other@mail.com'})
        self.assertEqual(member_receipts[0].total_amount(), 500)
        self.assertEqual(member_receipts[0].get_pending_amount(), 500)

    def test_claims_round_trip(self):
        consortium = self.save_consortium()
        claim = Claim(None, consortium.get_id(), 'Member One', 'Sin agua', None, None,
                      [ClaimMessage('Member One', 'No hay agua', 'foto.png')])

        self.claims_service.save_or_update(claim)

        read = self.claims_service.get_claims_for(consortium.get_id())
        self.assertEqual(len(read), 1)
        self.assertEqual(read[0].get_identifier(), 'LOSTILOS-1')
        self.assertEqual(read[0].get_state(), 'Open')
        self.assertEqual(read[0].messages[0].message, 'No hay agua')

    def test_updating_a_claim_does_not_duplicate_it(self):
        consortium = self.save_consortium()
        claim = Claim(None, consortium.get_id(), 'Member One', 'Sin agua', None, None, [])
        self.claims_service.save_or_update(claim)

        claim.messages = [ClaimMessage('admin@mail.com', 'Resuelto', '')]
        claim.state = 'Closed'
        self.claims_service.save_or_update(claim)

        read = self.claims_service.get_claims_for(consortium.get_id())
        self.assertEqual(len(read), 1)
        self.assertEqual(read[0].get_state(), 'Closed')
        self.assertEqual(read[0].messages[0].message, 'Resuelto')

    def test_claims_are_filtered_by_owner(self):
        consortium = self.save_consortium()
        self.claims_service.save_or_update(
            Claim(None, consortium.get_id(), 'Member One', 'Sin agua', None, None, []))
        self.claims_service.save_or_update(
            Claim(None, consortium.get_id(), 'Member Two', 'Sin luz', None, None, []))

        read = self.claims_service.get_claims_for(consortium.get_id(), 'Member Two')

        self.assertEqual([claim.title for claim in read], ['Sin luz'])

    def test_settings_round_trip(self):
        self.settings_service.save_or_update({'type': 'theme', 'id': 'consortium-1',
                                              'color': 'blue'})

        self.assertEqual(self.settings_service.get('theme', 'consortium-1'),
                         {'type': 'theme', 'id': 'consortium-1', 'color': 'blue'})

        self.settings_service.save_or_update({'type': 'theme', 'id': 'consortium-1',
                                              'color': 'red'})

        self.assertEqual(self.settings_service.get('theme', 'consortium-1')['color'], 'red')
        self.assertEqual(self.settings_service.get('theme', 'consortium-2'), {})

    def test_notifications_round_trip(self):
        self.notification_service.save_or_update({'consortium_id': 'consortium-1',
                                                  'message': 'Nueva liquidacion'})

        notifications = self.notification_service.get_notifications('consortium-1')

        self.assertEqual(len(notifications), 1)
        self.assertEqual(notifications[0]['message'], 'Nueva liquidacion')
        self.assertTrue(notifications[0]['publishDate'])

    def test_everything_survives_a_fresh_set_of_daos(self):
        consortium = self.save_consortium()
        self.receipt_service.update_expenses_receipt(
            ExpensesReceipt(consortium.get_id(), 'Enero', 2024,
                            [ExpenseItem('Luz', 'Factura', 1000)]))
        self.login_service.set_credentials('member@mail.com', 'secret')

        new_consortium_service = self._track(
            ConsortiumService(user_service=self._track(UserService())))
        new_consortium_service.email_service = MagicMock()
        new_receipt_service = self._track(
            ExpensesReceiptService(consortium_service=new_consortium_service))
        new_login_service = self._track(
            LoginService(consortium_service=new_consortium_service))

        self.assertEqual(
            new_consortium_service.get_consortium(consortium.get_id()).get_members_count(), 2)
        self.assertEqual(
            new_receipt_service.get_expenses_for(consortium.get_id(), 'admin@mail.com')[0]
            .get_total_amount(), 1000)
        self.assertTrue(new_login_service.authenticate('member@mail.com', 'secret'))


if __name__ == '__main__':
    unittest.main()
