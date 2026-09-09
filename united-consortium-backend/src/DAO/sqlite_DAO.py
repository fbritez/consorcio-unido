import datetime
import json
import os
import sqlite3
from pathlib import Path

from src.model.claim import Claim, ClaimMessage
from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt, MemberExpensesReceipt
from src.model.user import ConsortiumMember, User


DEFAULT_DATABASE_PATH = Path(__file__).resolve().parents[2] / 'data' / 'united_consortium.db'


def _database_path():
    configured_path = os.environ.get('SQLITE_DATABASE_PATH')
    path = Path(configured_path) if configured_path else DEFAULT_DATABASE_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def _json_default(value):
    if isinstance(value, (datetime.datetime, datetime.date)):
        return value.isoformat()
    if hasattr(value, '__dict__'):
        return value.__dict__
    raise TypeError(f'Object of type {type(value).__name__} is not JSON serializable')


def _to_document(element):
    return json.loads(json.dumps(element, default=_json_default))


def _matches(document, query):
    for key, expected in (query or {}).items():
        if key == '$or':
            if not any(_matches(document, option) for option in expected):
                return False
            continue
        actual = document.get(key)
        if key == '_id':
            actual = str(actual) if actual is not None else actual
            expected = str(expected)
        if actual != expected:
            return False
    return True


class SQLiteBaseDAO:
    table_name = None

    def __init__(self, database_path=None):
        self.database_path = str(database_path or _database_path())
        self.db = sqlite3.connect(self.database_path)
        self.db.row_factory = sqlite3.Row
        self.db.execute(
            f'CREATE TABLE IF NOT EXISTS {self.table_name} '
            '(id INTEGER PRIMARY KEY AUTOINCREMENT, document TEXT NOT NULL)'
        )
        self.db.commit()

    def _close(self):
        self.db.close()

    def _rows(self, query_obj=None):
        rows = self.db.execute(f'SELECT id, document FROM {self.table_name} ORDER BY id').fetchall()
        result = []
        for row in rows:
            document = json.loads(row['document'])
            document.setdefault('_id', row['id'])
            if _matches(document, query_obj):
                result.append(document)
        return result

    def get_all(self, query_obj=None):
        return [self.create_model(document) for document in self._rows(query_obj)]

    def get(self, query_obj):
        return [dict(document) for document in self._rows(query_obj)]

    def insert(self, element):
        document = _to_document(element)
        document.pop('_id', None)
        cursor = self.db.execute(
            f'INSERT INTO {self.table_name} (document) VALUES (?)',
            (json.dumps(document),),
        )
        self.db.commit()
        document['_id'] = cursor.lastrowid
        return element

    def insert_all(self, elements):
        for element in elements:
            self.insert(element)
        return elements

    def update_all(self, query_obj, new_element):
        documents = self._rows(query_obj)
        replacement = _to_document(new_element)
        for document in documents:
            row_id = document['_id']
            replacement_to_save = dict(replacement)
            replacement_to_save.pop('_id', None)
            self.db.execute(
                f'UPDATE {self.table_name} SET document = ? WHERE id = ?',
                (json.dumps(replacement_to_save), row_id),
            )
        if not documents:
            return self.insert(new_element)
        self.db.commit()
        return new_element

    def update(self, query_obj, new_element):
        return self.update_all(query_obj, new_element)

    def create_model(self, element):
        return element


class ConsortiumDAO(SQLiteBaseDAO):
    table_name = 'consortiums'

    def create_model(self, element):
        members = [
            ConsortiumMember(
                member.get('user_email'), member.get('member_name'),
                member.get('secondary_email', ''), member.get('notes', '')
            )
            for member in element.get('members', [])
        ]
        return Consortium(
            element.get('name'), element.get('address'), members,
            element.get('administrators', []), element.get('disabled', False),
            element.get('id')
        )


class ExpensesReceiptDAO(SQLiteBaseDAO):
    table_name = 'expenses_receipts'

    def create_model(self, element):
        items = [
            ExpenseItem(item.get('title'), item.get('description'), item.get('amount'),
                        item.get('ticket', ''), self._members(item))
            for item in element.get('expense_items', [])
        ]
        member_receipts = []
        for receipt in element.get('member_expenses_receipt_details', []):
            member = receipt.get('member', {})
            member_receipts.append(MemberExpensesReceipt(
                ConsortiumMember(member.get('user_email'), member.get('member_name'),
                                 member.get('secondary_email', ''), member.get('notes', '')),
                [], receipt.get('paid', False), receipt.get('paid_amount', 0),
                receipt.get('filename', '')
            ))
        return ExpensesReceipt(
            element.get('consortium_id'), element.get('month'), element.get('year'),
            items, element.get('is_open', True), str(element.get('_id')),
            member_receipts, element.get('payment_processed', False)
        )

    @staticmethod
    def _members(item):
        return [
            ConsortiumMember(member.get('user_email'), member.get('member_name'),
                             member.get('secondary_email', ''), member.get('notes', ''))
            for member in item.get('members', [])
        ]


class LoginDAO(SQLiteBaseDAO):
    table_name = 'login'

    def create_model(self, element):
        return element


class UserDAO(SQLiteBaseDAO):
    table_name = 'users'

    def create_model(self, element):
        return User(element.get('email'), element.get('name'))


class ImageDAO(SQLiteBaseDAO):
    table_name = 'images'

    def __init__(self, database_path=None):
        super().__init__(database_path)

    def store(self, file_id, file):
        document = json.dumps({'file_id': file_id, 'data': file.read().decode('latin1')})
        self.db.execute(f'INSERT INTO {self.table_name} (document) VALUES (?)', (document,))
        self.db.commit()

    def read(self, file_id):
        rows = self.db.execute(f'SELECT document FROM {self.table_name}').fetchall()
        for row in rows:
            document = json.loads(row['document'])
            if document.get('file_id') == file_id:
                return document['data'].encode('latin1')
        return None


class BasicDataTypeDAO(SQLiteBaseDAO):
    def get(self, query_obj):
        return [dict(document, _id=None) for document in self._rows(query_obj)]

    def create_model(self, element):
        return element


class SettingsDAO(BasicDataTypeDAO):
    table_name = 'settings'


class NotificationDAO(BasicDataTypeDAO):
    table_name = 'notifications'


class ClaimsDAO(SQLiteBaseDAO):
    table_name = 'claims'

    def create_model(self, element):
        messages = [
            ClaimMessage(message.get('owner'), message.get('message'), message.get('filename'))
            for message in element.get('messages', [])
        ]
        return Claim(
            element.get('identifier'), element.get('consortium_id'), element.get('owner'),
            element.get('title'), element.get('state'), element.get('creation_date'), messages
        )
