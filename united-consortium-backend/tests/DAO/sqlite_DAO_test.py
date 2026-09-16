import io
import sqlite3
import tempfile
import unittest
from pathlib import Path

from src.DAO.orm_db import dispose_engine
from src.DAO.sqlite_DAO import (
    ClaimsDAO,
    ConsortiumDAO,
    ExpensesReceiptDAO,
    ImageDAO,
    LoginDAO,
    NotificationDAO,
    SettingsDAO,
    UserDAO,
)
from src.model.claim import Claim, ClaimMessage
from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt, MemberExpensesReceipt
from src.model.user import ConsortiumMember, User


class SQLiteDAOTestCase(unittest.TestCase):

    dao_class = None

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.database_path = Path(self.directory.name) / 'united_consortium.db'
        self.dao = self.dao_class(self.database_path) if self.dao_class else None

    def tearDown(self):
        if self.dao is not None:
            self.dao._close()
            dispose_engine(self.dao.url)
        self.directory.cleanup()

    def columns_of(self, table):
        connection = sqlite3.connect(str(self.database_path))
        try:
            return [row[1] for row in connection.execute(f'PRAGMA table_info({table})')]
        finally:
            connection.close()

    def rows_of(self, table):
        connection = sqlite3.connect(str(self.database_path))
        connection.row_factory = sqlite3.Row
        try:
            return [dict(row) for row in connection.execute(f'SELECT * FROM {table} ORDER BY id')]
        finally:
            connection.close()


class UserDAOTest(SQLiteDAOTestCase):
    dao_class = UserDAO

    def test_user_properties_are_stored_on_their_own_columns(self):
        self.dao.insert(User('neighbour@mail.com', 'Neighbour'))

        self.assertEqual(self.columns_of('users'), ['id', 'email', 'name'])
        self.assertEqual(self.rows_of('users'),
                         [{'id': 1, 'email': 'neighbour@mail.com', 'name': 'Neighbour'}])

    def test_user_is_read_back_as_a_model(self):
        self.dao.insert(User('neighbour@mail.com', 'Neighbour'))

        users = self.dao.get_all({'email': 'neighbour@mail.com'})

        self.assertEqual(users, [User('neighbour@mail.com', 'Neighbour')])

    def test_unknown_user_is_not_returned(self):
        self.dao.insert(User('neighbour@mail.com', 'Neighbour'))

        self.assertEqual(self.dao.get_all({'email': 'other@mail.com'}), [])

    def test_inserting_the_same_email_twice_updates_the_existing_row(self):
        self.dao.insert(User('neighbour@mail.com', 'Neighbour'))
        self.dao.insert(User('neighbour@mail.com', 'Updated Neighbour'))

        rows = self.rows_of('users')

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['name'], 'Updated Neighbour')

    def test_data_survives_a_new_connection(self):
        self.dao.insert(User('neighbour@mail.com', 'Neighbour'))
        self.dao._close()

        self.dao = UserDAO(self.database_path)

        self.assertEqual(self.dao.get_all({'email': 'neighbour@mail.com'}),
                         [User('neighbour@mail.com', 'Neighbour')])


class LoginDAOTest(SQLiteDAOTestCase):
    dao_class = LoginDAO

    def test_credentials_are_stored_on_their_own_columns(self):
        self.dao.insert({'user_email': 'user@mail.com', 'password': 'secret'})

        self.assertEqual(self.columns_of('login'), ['id', 'user_email', 'password'])
        self.assertEqual(self.rows_of('login'),
                         [{'id': 1, 'user_email': 'user@mail.com', 'password': 'secret'}])

    def test_authentication_query_matches_email_and_password(self):
        self.dao.insert({'user_email': 'user@mail.com', 'password': 'secret'})

        self.assertTrue(self.dao.get_all({'user_email': 'user@mail.com', 'password': 'secret'}))
        self.assertFalse(self.dao.get_all({'user_email': 'user@mail.com', 'password': 'wrong'}))

    def test_or_query_over_an_unmapped_field_does_not_match(self):
        self.dao.insert({'user_email': 'user@mail.com', 'password': 'secret'})

        found = self.dao.get_all({'$or': [{'user_email': 'other@mail.com'},
                                          {'secondary_email': 'other@mail.com'}]})

        self.assertEqual(found, [])

    def test_or_query_matches_the_registered_email(self):
        self.dao.insert({'user_email': 'user@mail.com', 'password': 'secret'})

        found = self.dao.get_all({'$or': [{'user_email': 'user@mail.com'},
                                          {'secondary_email': 'user@mail.com'}]})

        self.assertEqual(len(found), 1)

    def test_password_is_replaced_for_an_existing_email(self):
        self.dao.insert({'user_email': 'user@mail.com', 'password': 'secret'})
        self.dao.insert({'user_email': 'user@mail.com', 'password': 'new-secret'})

        rows = self.rows_of('login')

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['password'], 'new-secret')


class ConsortiumDAOTest(SQLiteDAOTestCase):
    dao_class = ConsortiumDAO

    def a_consortium(self, identifier='consortium-1'):
        members = [ConsortiumMember('member@mail.com', 'Member One', 'second@mail.com', 'a note'),
                   ConsortiumMember('another@mail.com', 'Member Two')]
        return Consortium('Los Tilos', 'Calle Falsa 123', members, ['admin@mail.com'], False,
                          identifier)

    def test_consortium_properties_are_stored_on_their_own_columns(self):
        self.dao.insert(self.a_consortium())

        self.assertEqual(self.columns_of('consortiums'), ['id', 'name', 'address', 'disabled'])
        self.assertEqual(self.rows_of('consortiums'),
                         [{'id': 'consortium-1', 'name': 'Los Tilos',
                           'address': 'Calle Falsa 123', 'disabled': 0}])

    def test_members_are_stored_on_their_own_table(self):
        self.dao.insert(self.a_consortium())

        self.assertEqual(self.columns_of('consortium_members'),
                         ['id', 'consortium_id', 'user_email', 'member_name',
                          'secondary_email', 'notes'])
        rows = self.rows_of('consortium_members')
        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[0]['user_email'], 'member@mail.com')
        self.assertEqual(rows[0]['secondary_email'], 'second@mail.com')
        self.assertEqual(rows[0]['notes'], 'a note')

    def test_administrators_are_stored_on_their_own_table(self):
        self.dao.insert(self.a_consortium())

        rows = self.rows_of('consortium_administrators')

        self.assertEqual([row['user_email'] for row in rows], ['admin@mail.com'])

    def test_consortium_is_read_back_with_members_and_administrators(self):
        self.dao.insert(self.a_consortium())

        consortium = self.dao.get_all({'id': 'consortium-1'})[0]

        self.assertEqual(consortium.get_name(), 'Los Tilos')
        self.assertEqual(consortium.get_address(), 'Calle Falsa 123')
        self.assertFalse(consortium.disabled)
        self.assertEqual(consortium.get_members_count(), 2)
        self.assertEqual(consortium.get_members()[0].get_name(), 'Member One')
        self.assertTrue(consortium.is_administrator('admin@mail.com'))

    def test_consortium_without_identifier_gets_one_generated(self):
        self.dao.insert(Consortium('Sin Id', 'Calle 1', [], [], False, None))

        rows = self.rows_of('consortiums')

        self.assertEqual(len(rows), 1)
        self.assertTrue(rows[0]['id'])

    def test_query_by_member_email(self):
        self.dao.insert(self.a_consortium())
        self.dao.insert(Consortium('Other', 'Other 1', [], [], False, 'consortium-2'))

        found = self.dao.get_all({'disabled': False,
                                  '$or': [{'$or': [{'members.user_email': 'member@mail.com'},
                                                   {'members.secondary_email': 'member@mail.com'}]},
                                          {'administrators': 'member@mail.com'}]})

        self.assertEqual([consortium.get_id() for consortium in found], ['consortium-1'])

    def test_query_by_member_secondary_email(self):
        self.dao.insert(self.a_consortium())

        found = self.dao.get_all({'disabled': False,
                                  '$or': [{'$or': [{'members.user_email': 'second@mail.com'},
                                                   {'members.secondary_email': 'second@mail.com'}]},
                                          {'administrators': 'second@mail.com'}]})

        self.assertEqual([consortium.get_id() for consortium in found], ['consortium-1'])

    def test_query_by_administrator(self):
        self.dao.insert(self.a_consortium())

        found = self.dao.get_all({'disabled': False,
                                  '$or': [{'$or': [{'members.user_email': 'admin@mail.com'},
                                                   {'members.secondary_email': 'admin@mail.com'}]},
                                          {'administrators': 'admin@mail.com'}]})

        self.assertEqual([consortium.get_id() for consortium in found], ['consortium-1'])

    def test_disabled_consortiums_are_filtered_out(self):
        self.dao.insert(Consortium('Disabled', 'Calle 1',
                                   [ConsortiumMember('member@mail.com', 'Member One')],
                                   [], True, 'consortium-3'))

        found = self.dao.get_all({'disabled': False,
                                  'members.user_email': 'member@mail.com'})

        self.assertEqual(found, [])

    def test_update_replaces_members_and_administrators(self):
        self.dao.insert(self.a_consortium())

        updated = Consortium('Los Tilos Renamed', 'Nueva 456',
                             [ConsortiumMember('new@mail.com', 'New Member')],
                             ['new-admin@mail.com'], True, 'consortium-1')
        self.dao.update_all({'id': 'consortium-1'}, updated)

        self.assertEqual(len(self.rows_of('consortiums')), 1)
        self.assertEqual(len(self.rows_of('consortium_members')), 1)
        consortium = self.dao.get_all({'id': 'consortium-1'})[0]
        self.assertEqual(consortium.get_name(), 'Los Tilos Renamed')
        self.assertTrue(consortium.disabled)
        self.assertEqual(consortium.get_members()[0].get_email(), 'new@mail.com')
        self.assertEqual(consortium.get_administrators(), ['new-admin@mail.com'])

    def test_update_of_a_missing_consortium_inserts_it(self):
        self.dao.update_all({'id': 'missing'}, self.a_consortium('missing'))

        self.assertEqual(len(self.rows_of('consortiums')), 1)

    def test_get_all_without_query_returns_every_consortium(self):
        self.dao.insert(self.a_consortium('consortium-1'))
        self.dao.insert(self.a_consortium('consortium-2'))

        self.assertEqual(len(self.dao.get_all()), 2)


class ExpensesReceiptDAOTest(SQLiteDAOTestCase):
    dao_class = ExpensesReceiptDAO

    def a_member(self):
        return ConsortiumMember('member@mail.com', 'Member One', 'second@mail.com', 'a note')

    def a_receipt(self, month='Enero', year=2024, is_open=True):
        items = [ExpenseItem('Luz', 'Factura de luz', 1000, 'ticket.png', [self.a_member()]),
                 ExpenseItem('Agua', 'Factura de agua', 500, '', [])]
        member_receipts = [MemberExpensesReceipt(
            self.a_member(),
            [ExpenseItem('Luz', 'Factura de luz', 500, '', [self.a_member()])],
            False, 200, 'comprobante.png')]
        return ExpensesReceipt('consortium-1', month, year, items, is_open, None,
                               member_receipts, False)

    def test_receipt_properties_are_stored_on_their_own_columns(self):
        self.dao.insert(self.a_receipt())

        self.assertEqual(self.columns_of('expenses_receipts'),
                         ['id', 'consortium_id', 'month', 'year', 'is_open', 'payment_processed'])
        self.assertEqual(self.rows_of('expenses_receipts'),
                         [{'id': 1, 'consortium_id': 'consortium-1', 'month': 'Enero',
                           'year': 2024, 'is_open': 1, 'payment_processed': 0}])

    def test_expense_items_are_stored_on_their_own_table(self):
        self.dao.insert(self.a_receipt())

        self.assertEqual(self.columns_of('expense_items'),
                         ['id', 'expenses_receipt_id', 'member_expenses_receipt_id',
                          'title', 'description', 'amount', 'ticket'])
        receipt_items = [row for row in self.rows_of('expense_items')
                         if row['expenses_receipt_id'] is not None]
        self.assertEqual([row['title'] for row in receipt_items], ['Luz', 'Agua'])
        self.assertEqual(receipt_items[0]['amount'], 1000)
        self.assertEqual(receipt_items[0]['ticket'], 'ticket.png')

    def test_expense_item_members_are_stored_on_their_own_table(self):
        self.dao.insert(self.a_receipt())

        rows = self.rows_of('expense_item_members')

        self.assertEqual([row['user_email'] for row in rows],
                         ['member@mail.com', 'member@mail.com'])

    def test_member_receipts_are_stored_on_their_own_table(self):
        self.dao.insert(self.a_receipt())

        self.assertEqual(self.columns_of('member_expenses_receipts'),
                         ['id', 'expenses_receipt_id', 'user_email', 'member_name',
                          'secondary_email', 'notes', 'paid', 'paid_amount', 'filename'])
        rows = self.rows_of('member_expenses_receipts')
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['user_email'], 'member@mail.com')
        self.assertEqual(rows[0]['paid'], 0)
        self.assertEqual(rows[0]['paid_amount'], 200)
        self.assertEqual(rows[0]['filename'], 'comprobante.png')

    def test_receipt_is_read_back_with_the_whole_object_graph(self):
        self.dao.insert(self.a_receipt())

        receipt = self.dao.get_all({'consortium_id': 'consortium-1'})[0]

        self.assertEqual(receipt.get_month(), 'Enero')
        self.assertEqual(receipt.get_year(), 2024)
        self.assertTrue(receipt.is_open)
        self.assertFalse(receipt.payment_processed)
        self.assertEqual(receipt.get_total_amount(), 1500)
        self.assertEqual(receipt.get_expenses_items()[0].get_members()[0], self.a_member())
        self.assertEqual(receipt.get_expenses_items()[1].get_members(), [])

    def test_member_receipt_items_are_read_back(self):
        self.dao.insert(self.a_receipt())

        receipt = self.dao.get_all({'consortium_id': 'consortium-1'})[0]
        member_receipt = receipt.member_expenses_receipt_details[0]

        self.assertEqual(member_receipt.get_member(), self.a_member())
        self.assertEqual(member_receipt.total_amount(), 500)
        self.assertEqual(member_receipt.get_pending_amount(), 300)
        self.assertEqual(receipt.get_non_payment_receipts(), [member_receipt])

    def test_identifier_is_the_generated_row_id(self):
        receipt = self.a_receipt()

        self.dao.insert(receipt)

        self.assertEqual(receipt.identifier, '1')
        self.assertEqual(self.dao.get_all({'_id': '1'})[0].identifier, '1')

    def test_query_by_consortium_month_and_year(self):
        self.dao.insert(self.a_receipt(month='Enero', year=2024))
        self.dao.insert(self.a_receipt(month='Febrero', year=2024))

        found = self.dao.get_all({'consortium_id': 'consortium-1', 'year': 2024, 'month': 'Febrero'})

        self.assertEqual([receipt.get_month() for receipt in found], ['Febrero'])

    def test_query_by_open_state(self):
        self.dao.insert(self.a_receipt(month='Enero', is_open=True))
        self.dao.insert(self.a_receipt(month='Febrero', is_open=False))

        found = self.dao.get_all({'consortium_id': 'consortium-1', 'is_open': False})

        self.assertEqual([receipt.get_month() for receipt in found], ['Febrero'])

    def test_query_by_payment_processed(self):
        self.dao.insert(self.a_receipt(month='Enero', is_open=False))

        self.assertEqual(len(self.dao.get_all({'consortium_id': 'consortium-1',
                                               'is_open': False,
                                               'payment_processed': False})), 1)
        self.assertEqual(self.dao.get_all({'consortium_id': 'consortium-1',
                                           'payment_processed': True}), [])

    def test_update_replaces_items_without_leaving_orphans(self):
        self.dao.insert(self.a_receipt())

        updated = ExpensesReceipt('consortium-1', 'Enero', 2024,
                                  [ExpenseItem('Gas', 'Factura de gas', 300, '', [])],
                                  False, None, [], True)
        self.dao.update_all({'consortium_id': 'consortium-1', 'year': 2024, 'month': 'Enero'},
                            updated)

        self.assertEqual(len(self.rows_of('expenses_receipts')), 1)
        self.assertEqual(len(self.rows_of('expense_items')), 1)
        self.assertEqual(self.rows_of('member_expenses_receipts'), [])
        self.assertEqual(self.rows_of('expense_item_members'), [])
        receipt = self.dao.get_all({'consortium_id': 'consortium-1'})[0]
        self.assertEqual(receipt.get_total_amount(), 300)
        self.assertFalse(receipt.is_open)
        self.assertTrue(receipt.payment_processed)

    def test_update_of_a_missing_receipt_inserts_it(self):
        self.dao.update_all({'consortium_id': 'consortium-1', 'year': 2024, 'month': 'Enero'},
                            self.a_receipt())

        self.assertEqual(len(self.rows_of('expenses_receipts')), 1)

    def test_create_model_from_api_json(self):
        receipt = self.dao.create_model({
            'consortium_id': 'consortium-1',
            'month': 'Marzo',
            'year': 2024,
            'is_open': True,
            'payment_processed': False,
            'expense_items': [{'title': 'Luz', 'description': 'Factura', 'amount': 100,
                               'ticket': '', 'members': []}],
            'member_expenses_receipt_details': [],
        })

        self.dao.insert(receipt)

        self.assertEqual(self.dao.get_all({'consortium_id': 'consortium-1'})[0].get_total_amount(),
                         100)


class ClaimsDAOTest(SQLiteDAOTestCase):
    dao_class = ClaimsDAO

    def a_claim(self, identifier='LOSTILOS-1', owner='Member One'):
        messages = [ClaimMessage(owner, 'No hay agua', 'foto.png'),
                    ClaimMessage('admin@mail.com', 'Lo revisamos', '')]
        return Claim(identifier, 'consortium-1', owner, 'Sin agua', 'Open',
                     '2024-01-01T10:00:00', messages)

    def test_claim_properties_are_stored_on_their_own_columns(self):
        self.dao.insert(self.a_claim())

        self.assertEqual(self.columns_of('claims'),
                         ['id', 'identifier', 'consortium_id', 'owner', 'title',
                          'state', 'creation_date'])
        self.assertEqual(self.rows_of('claims'),
                         [{'id': 1, 'identifier': 'LOSTILOS-1', 'consortium_id': 'consortium-1',
                           'owner': 'Member One', 'title': 'Sin agua', 'state': 'Open',
                           'creation_date': '2024-01-01T10:00:00'}])

    def test_messages_are_stored_on_their_own_table(self):
        self.dao.insert(self.a_claim())

        self.assertEqual(self.columns_of('claim_messages'),
                         ['id', 'claim_id', 'owner', 'message', 'filename'])
        rows = self.rows_of('claim_messages')
        self.assertEqual([row['message'] for row in rows], ['No hay agua', 'Lo revisamos'])
        self.assertEqual(rows[0]['filename'], 'foto.png')

    def test_claim_is_read_back_with_its_messages(self):
        self.dao.insert(self.a_claim())

        claim = self.dao.get_all({'consortium_id': 'consortium-1'})[0]

        self.assertEqual(claim.get_identifier(), 'LOSTILOS-1')
        self.assertEqual(claim.get_state(), 'Open')
        self.assertEqual(claim.creation_date, '2024-01-01T10:00:00')
        self.assertEqual(len(claim.messages), 2)
        self.assertEqual(claim.messages[0].message, 'No hay agua')

    def test_query_by_owner(self):
        self.dao.insert(self.a_claim('LOSTILOS-1', 'Member One'))
        self.dao.insert(self.a_claim('LOSTILOS-2', 'Member Two'))

        found = self.dao.get_all({'consortium_id': 'consortium-1', 'owner': 'Member Two'})

        self.assertEqual([claim.get_identifier() for claim in found], ['LOSTILOS-2'])

    def test_update_by_identifier_replaces_messages(self):
        self.dao.insert(self.a_claim())

        updated = Claim('LOSTILOS-1', 'consortium-1', 'Member One', 'Sin agua', 'Closed',
                        '2024-01-01T10:00:00', [ClaimMessage('admin@mail.com', 'Resuelto', '')])
        self.dao.update_all({'identifier': 'LOSTILOS-1'}, updated)

        self.assertEqual(len(self.rows_of('claims')), 1)
        self.assertEqual(len(self.rows_of('claim_messages')), 1)
        claim = self.dao.get_all({'identifier': 'LOSTILOS-1'})[0]
        self.assertEqual(claim.get_state(), 'Closed')
        self.assertEqual(claim.messages[0].message, 'Resuelto')

    def test_update_of_a_missing_claim_inserts_it(self):
        self.dao.update_all({'identifier': 'LOSTILOS-9'}, self.a_claim('LOSTILOS-9'))

        self.assertEqual(len(self.rows_of('claims')), 1)


class SettingsDAOTest(SQLiteDAOTestCase):
    dao_class = SettingsDAO

    def test_known_properties_are_stored_on_their_own_columns(self):
        self.dao.insert({'type': 'theme', 'id': 'consortium-1', 'color': 'blue'})

        self.assertEqual(self.columns_of('settings'),
                         ['id', 'type', 'setting_id', 'extra_properties'])
        row = self.rows_of('settings')[0]
        self.assertEqual(row['type'], 'theme')
        self.assertEqual(row['setting_id'], 'consortium-1')

    def test_settings_are_read_back_with_every_property(self):
        self.dao.insert({'type': 'theme', 'id': 'consortium-1', 'color': 'blue'})

        settings = self.dao.get({'type': 'theme', 'id': 'consortium-1'})

        self.assertEqual(settings, [{'type': 'theme', 'id': 'consortium-1', 'color': 'blue'}])

    def test_settings_of_another_consortium_are_not_returned(self):
        self.dao.insert({'type': 'theme', 'id': 'consortium-1', 'color': 'blue'})

        self.assertEqual(self.dao.get({'type': 'theme', 'id': 'consortium-2'}), [])

    def test_update_replaces_the_stored_settings(self):
        self.dao.insert({'type': 'theme', 'id': 'consortium-1', 'color': 'blue'})

        self.dao.update({'type': 'theme', 'id': 'consortium-1'},
                        {'type': 'theme', 'id': 'consortium-1', 'color': 'red'})

        self.assertEqual(len(self.rows_of('settings')), 1)
        self.assertEqual(self.dao.get({'type': 'theme', 'id': 'consortium-1'})[0]['color'], 'red')


class NotificationDAOTest(SQLiteDAOTestCase):
    dao_class = NotificationDAO

    def test_known_properties_are_stored_on_their_own_columns(self):
        self.dao.insert({'consortium_id': 'consortium-1', 'message': 'Nueva liquidacion',
                         'publishDate': '2024-01-01T10:00:00'})

        self.assertEqual(self.columns_of('notifications'),
                         ['id', 'consortium_id', 'message', 'publishDate', 'extra_properties'])
        row = self.rows_of('notifications')[0]
        self.assertEqual(row['consortium_id'], 'consortium-1')
        self.assertEqual(row['message'], 'Nueva liquidacion')
        self.assertEqual(row['publishDate'], '2024-01-01T10:00:00')

    def test_notifications_are_read_back_by_consortium(self):
        self.dao.insert({'consortium_id': 'consortium-1', 'message': 'Uno',
                         'publishDate': '2024-01-01T10:00:00'})
        self.dao.insert({'consortium_id': 'consortium-2', 'message': 'Dos',
                         'publishDate': '2024-01-02T10:00:00'})

        notifications = self.dao.get({'consortium_id': 'consortium-1'})

        self.assertEqual(notifications, [{'consortium_id': 'consortium-1', 'message': 'Uno',
                                          'publishDate': '2024-01-01T10:00:00'}])

    def test_update_replaces_the_stored_notification(self):
        self.dao.insert({'consortium_id': 'consortium-1', 'message': 'Uno',
                         'publishDate': '2024-01-01T10:00:00'})

        self.dao.update({'consortium_id': 'consortium-1'},
                        {'consortium_id': 'consortium-1', 'message': 'Actualizada',
                         'publishDate': '2024-01-03T10:00:00'})

        self.assertEqual(len(self.rows_of('notifications')), 1)
        self.assertEqual(self.dao.get({'consortium_id': 'consortium-1'})[0]['message'],
                         'Actualizada')


class ImageDAOTest(SQLiteDAOTestCase):
    dao_class = ImageDAO

    def test_image_is_stored_on_a_blob_column(self):
        self.dao.store('ticket.png', io.BytesIO(b'\x89PNG\x00binary'))

        self.assertEqual(self.columns_of('images'), ['id', 'file_id', 'data'])
        self.assertEqual(self.dao.read('ticket.png'), b'\x89PNG\x00binary')

    def test_unknown_image_returns_none(self):
        self.assertIsNone(self.dao.read('missing.png'))

    def test_storing_the_same_file_id_replaces_the_content(self):
        self.dao.store('ticket.png', io.BytesIO(b'first'))
        self.dao.store('ticket.png', io.BytesIO(b'second'))

        self.assertEqual(len(self.rows_of('images')), 1)
        self.assertEqual(self.dao.read('ticket.png'), b'second')


if __name__ == '__main__':
    unittest.main()
