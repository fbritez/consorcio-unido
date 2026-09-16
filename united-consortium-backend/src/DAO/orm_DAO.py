"""DAO layer built on SQLAlchemy, shared by the SQLite and PostgreSQL backends.

The services keep talking in the Mongo-like query language they always used
(``{'field': value}`` plus ``$or``); every supported key is translated here into
an ORM filter over a real column, or into an ``any()`` clause over a child table.
Unmapped keys never match, which is the behaviour the document based DAO had.
"""

import datetime
import json
import uuid

from sqlalchemy import and_, false, or_, true

from src.DAO.orm_db import database_url, get_session
from src.DAO.orm_models import (
    ClaimMessageModel,
    ClaimModel,
    ConsortiumAdministratorModel,
    ConsortiumMemberModel,
    ConsortiumModel,
    ExpenseItemMemberModel,
    ExpenseItemModel,
    ExpensesReceiptModel,
    ImageModel,
    LoginModel,
    MemberExpensesReceiptModel,
    NotificationModel,
    SettingsModel,
    UserModel,
)
from src.model.claim import Claim, ClaimMessage
from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt, MemberExpensesReceipt
from src.model.user import ConsortiumMember, User


MEMBER_COLUMNS = ('user_email', 'member_name', 'secondary_email', 'notes')


def _to_column_value(value):
    if isinstance(value, (datetime.datetime, datetime.date)):
        return value.isoformat()
    return value


def _attribute(element, name, default=None):
    if isinstance(element, dict):
        value = element.get(name, default)
    else:
        value = getattr(element, name, default)
    return default if value is None else value


def _member_values(member):
    return {name: _attribute(member, name, '') for name in MEMBER_COLUMNS}


def _member_document(row):
    return {name: getattr(row, name) for name in MEMBER_COLUMNS}


class ORMBaseDAO:
    backend_name = 'sqlite'
    model = None
    columns = {}
    relations = {}
    integer_columns = ()
    entity_columns = ()

    def __init__(self, database_path=None, session=None):
        self.url = database_url(self.backend_name, database_path)
        self.db = session or get_session(self.url)

    def _close(self):
        if self.db is not None:
            self.db.close()

    # --- query translation -------------------------------------------------

    def _coerce(self, key, value):
        if key in self.integer_columns:
            try:
                return int(value)
            except (TypeError, ValueError):
                return value
        return _to_column_value(value)

    def _criterion(self, query_obj):
        clauses = []
        for key, expected in (query_obj or {}).items():
            if key == '$or':
                clauses.append(or_(*[self._criterion(option) for option in expected]))
            elif key in self.relations:
                clauses.append(self.relations[key](self._coerce(key, expected)))
            elif key in self.columns:
                column = getattr(self.model, self.columns[key])
                clauses.append(column == self._coerce(key, expected))
            else:
                clauses.append(false())
        return and_(true(), *clauses)

    def _rows(self, query_obj=None):
        query = self.db.query(self.model).filter(self._criterion(query_obj))
        return query.order_by(self.model.id).all()

    # --- reads -------------------------------------------------------------

    def _document(self, row):
        return {name: getattr(row, name) for name in self.entity_columns}

    def get_all(self, query_obj=None):
        return [self.create_model(self._document(row)) for row in self._rows(query_obj)]

    def get(self, query_obj):
        return [self._document(row) for row in self._rows(query_obj)]

    # --- writes ------------------------------------------------------------

    def insert(self, element):
        row = self.model()
        self._apply(row, element)
        self.db.add(row)
        self.db.commit()
        self._after_save(row, element)
        return element

    def insert_all(self, elements):
        for element in elements:
            self.insert(element)
        return elements

    def update_all(self, query_obj, new_element):
        rows = self._rows(query_obj)
        if not rows:
            return self.insert(new_element)
        for row in rows:
            self._apply(row, new_element)
        self.db.commit()
        for row in rows:
            self._after_save(row, new_element)
        return new_element

    def update(self, query_obj, new_element):
        return self.update_all(query_obj, new_element)

    def _apply(self, row, element):
        for name in self.entity_columns:
            setattr(row, name, _to_column_value(_attribute(element, name)))

    def _after_save(self, row, element):
        pass

    def create_model(self, element):
        return element


class UpsertDAO(ORMBaseDAO):
    """Entities identified by a natural unique key instead of the row id."""

    unique_column = None

    def insert(self, element):
        key = _attribute(element, self.unique_column)
        column = getattr(self.model, self.unique_column)
        row = self.db.query(self.model).filter(column == key).first()
        if row is None:
            return super().insert(element)
        self._apply(row, element)
        self.db.commit()
        return element


class UserDAO(UpsertDAO):
    model = UserModel
    unique_column = 'email'
    columns = {'_id': 'id', 'id': 'id', 'email': 'email', 'name': 'name'}
    integer_columns = ('_id', 'id')
    entity_columns = ('email', 'name')

    def create_model(self, element):
        return User(element.get('email'), element.get('name'))


class LoginDAO(UpsertDAO):
    model = LoginModel
    unique_column = 'user_email'
    columns = {'_id': 'id', 'id': 'id', 'user_email': 'user_email', 'password': 'password'}
    integer_columns = ('_id', 'id')
    entity_columns = ('user_email', 'password')

    def create_model(self, element):
        return element


class ConsortiumDAO(ORMBaseDAO):
    model = ConsortiumModel
    columns = {'_id': 'id', 'id': 'id', 'name': 'name', 'address': 'address',
               'disabled': 'disabled'}
    entity_columns = ('id', 'name', 'address', 'disabled')
    relations = {
        'members.user_email':
            lambda value: ConsortiumModel.members.any(ConsortiumMemberModel.user_email == value),
        'members.secondary_email':
            lambda value: ConsortiumModel.members.any(
                ConsortiumMemberModel.secondary_email == value),
        'members.member_name':
            lambda value: ConsortiumModel.members.any(ConsortiumMemberModel.member_name == value),
        'administrators':
            lambda value: ConsortiumModel.administrators.any(
                ConsortiumAdministratorModel.user_email == value),
    }

    def _document(self, row):
        return {
            'id': row.id,
            'name': row.name,
            'address': row.address,
            'disabled': bool(row.disabled),
            'members': [_member_document(member) for member in row.members],
            'administrators': [administrator.user_email for administrator in row.administrators],
        }

    def _apply(self, row, element):
        row.id = _attribute(element, 'id') or uuid.uuid4().hex
        row.name = _attribute(element, 'name')
        row.address = _attribute(element, 'address')
        row.disabled = bool(_attribute(element, 'disabled', False))
        row.members = [ConsortiumMemberModel(**_member_values(member))
                       for member in _attribute(element, 'members', [])]
        row.administrators = [ConsortiumAdministratorModel(user_email=administrator)
                              for administrator in _attribute(element, 'administrators', [])]

    def _after_save(self, row, element):
        if hasattr(element, 'set_id'):
            element.set_id(row.id)

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


class ExpensesReceiptDAO(ORMBaseDAO):
    model = ExpensesReceiptModel
    columns = {'_id': 'id', 'id': 'id', 'identifier': 'id', 'consortium_id': 'consortium_id',
               'month': 'month', 'year': 'year', 'is_open': 'is_open',
               'payment_processed': 'payment_processed'}
    integer_columns = ('_id', 'id', 'identifier', 'year')
    entity_columns = ('consortium_id', 'month', 'year', 'is_open', 'payment_processed')

    def _document(self, row):
        return {
            'id': row.id,
            'consortium_id': row.consortium_id,
            'month': row.month,
            'year': row.year,
            'is_open': bool(row.is_open),
            'payment_processed': bool(row.payment_processed),
            'expense_items': [self._item_document(item) for item in row.expense_items],
            'member_expenses_receipt_details': [
                {
                    'member': _member_document(member_receipt),
                    'expenses_items': [self._item_document(item)
                                       for item in member_receipt.expenses_items],
                    'paid': bool(member_receipt.paid),
                    'paid_amount': member_receipt.paid_amount,
                    'filename': member_receipt.filename,
                }
                for member_receipt in row.member_expenses_receipt_details
            ],
        }

    @staticmethod
    def _item_document(item):
        return {
            'title': item.title,
            'description': item.description,
            'amount': item.amount,
            'ticket': item.ticket,
            'members': [_member_document(member) for member in item.members],
        }

    def _apply(self, row, element):
        row.consortium_id = _attribute(element, 'consortium_id')
        row.month = _attribute(element, 'month')
        row.year = _attribute(element, 'year')
        row.is_open = bool(_attribute(element, 'is_open', True))
        row.payment_processed = bool(_attribute(element, 'payment_processed', False))
        row.expense_items = [self._item_row(item)
                             for item in _attribute(element, 'expense_items', [])]
        row.member_expenses_receipt_details = [
            self._member_receipt_row(member_receipt)
            for member_receipt in _attribute(element, 'member_expenses_receipt_details', [])
        ]

    def _member_receipt_row(self, member_receipt):
        member = _attribute(member_receipt, 'member', {})
        items = _attribute(member_receipt, 'expenses_items', [])
        if not items and isinstance(member_receipt, dict):
            items = member_receipt.get('expense_items', [])
        return MemberExpensesReceiptModel(
            paid=bool(_attribute(member_receipt, 'paid', False)),
            paid_amount=_attribute(member_receipt, 'paid_amount', 0),
            filename=_attribute(member_receipt, 'filename', ''),
            expenses_items=[self._item_row(item) for item in items],
            **_member_values(member)
        )

    @staticmethod
    def _item_row(item):
        return ExpenseItemModel(
            title=_attribute(item, 'title'),
            description=_attribute(item, 'description'),
            amount=_attribute(item, 'amount'),
            ticket=_attribute(item, 'ticket', ''),
            members=[ExpenseItemMemberModel(**_member_values(member))
                     for member in _attribute(item, 'members', [])],
        )

    def _after_save(self, row, element):
        if hasattr(element, 'identifier'):
            element.identifier = str(row.id)

    def create_model(self, element):
        items = [self._item(item) for item in element.get('expense_items', [])]
        member_receipts = []
        for receipt in element.get('member_expenses_receipt_details', []):
            member = receipt.get('member', {})
            member_items = receipt.get('expenses_items', receipt.get('expense_items', []))
            member_receipts.append(MemberExpensesReceipt(
                ConsortiumMember(member.get('user_email'), member.get('member_name'),
                                 member.get('secondary_email', ''), member.get('notes', '')),
                [self._item(item) for item in member_items],
                receipt.get('paid', False), receipt.get('paid_amount', 0),
                receipt.get('filename', '')
            ))
        identifier = next((element[key] for key in ('identifier', '_id', 'id')
                           if element.get(key) is not None), None)
        return ExpensesReceipt(
            element.get('consortium_id'), element.get('month'), element.get('year'),
            items, element.get('is_open', True),
            str(identifier) if identifier is not None else None,
            member_receipts, element.get('payment_processed', False)
        )

    def _item(self, item):
        return ExpenseItem(item.get('title'), item.get('description'), item.get('amount'),
                           item.get('ticket', ''), self._members(item))

    @staticmethod
    def _members(item):
        return [
            ConsortiumMember(member.get('user_email'), member.get('member_name'),
                             member.get('secondary_email', ''), member.get('notes', ''))
            for member in item.get('members', [])
        ]


class ClaimsDAO(ORMBaseDAO):
    model = ClaimModel
    columns = {'_id': 'id', 'id': 'id', 'identifier': 'identifier',
               'consortium_id': 'consortium_id', 'owner': 'owner', 'title': 'title',
               'state': 'state', 'creation_date': 'creation_date'}
    entity_columns = ('identifier', 'consortium_id', 'owner', 'title', 'state', 'creation_date')

    def _document(self, row):
        document = super()._document(row)
        document['messages'] = [
            {'owner': message.owner, 'message': message.message, 'filename': message.filename}
            for message in row.messages
        ]
        return document

    def _apply(self, row, element):
        super()._apply(row, element)
        row.messages = [
            ClaimMessageModel(
                owner=_attribute(message, 'owner'),
                message=_attribute(message, 'message'),
                filename=_attribute(message, 'filename', ''),
            )
            for message in _attribute(element, 'messages', [])
        ]

    def create_model(self, element):
        messages = [
            ClaimMessage(message.get('owner'), message.get('message'), message.get('filename'))
            for message in element.get('messages', [])
        ]
        return Claim(
            element.get('identifier'), element.get('consortium_id'), element.get('owner'),
            element.get('title'), element.get('state'), element.get('creation_date'), messages
        )


class BasicDataTypeDAO(ORMBaseDAO):
    """Free shaped dictionaries: the known properties get their own columns and
    anything else is kept on ``extra_properties``."""

    def _document(self, row):
        document = {name: getattr(row, name) for name in self.entity_columns}
        if row.extra_properties:
            document.update(json.loads(row.extra_properties))
        return document

    def _apply(self, row, element):
        for name in self.entity_columns:
            setattr(row, name, _to_column_value(element.get(name)))
        extra = {key: _to_column_value(value) for key, value in element.items()
                 if key not in self.entity_columns}
        row.extra_properties = json.dumps(extra) if extra else None

    def get_all(self, query_obj=None):
        return self.get(query_obj)

    def create_model(self, element):
        return element


class NotificationDAO(BasicDataTypeDAO):
    model = NotificationModel
    columns = {'consortium_id': 'consortium_id', 'message': 'message',
               'publishDate': 'publishDate'}
    entity_columns = ('consortium_id', 'message', 'publishDate')


class SettingsDAO(BasicDataTypeDAO):
    model = SettingsModel
    columns = {'type': 'type', 'id': 'setting_id'}
    entity_columns = ('type', 'setting_id')

    def _document(self, row):
        document = super()._document(row)
        document['id'] = document.pop('setting_id', None)
        return document

    def _apply(self, row, element):
        row.type = element.get('type')
        row.setting_id = element.get('id')
        extra = {key: _to_column_value(value) for key, value in element.items()
                 if key not in ('type', 'id')}
        row.extra_properties = json.dumps(extra) if extra else None


class ImageDAO(ORMBaseDAO):
    model = ImageModel
    columns = {'_id': 'id', 'id': 'id', 'file_id': 'file_id'}
    integer_columns = ('_id', 'id')
    entity_columns = ('file_id', 'data')

    def store(self, file_id, file):
        content = file.read()
        if isinstance(content, str):
            content = content.encode('latin1')
        row = self.db.query(ImageModel).filter(ImageModel.file_id == file_id).first()
        if row is None:
            row = ImageModel(file_id=file_id)
            self.db.add(row)
        row.data = content
        self.db.commit()

    def read(self, file_id):
        row = self.db.query(ImageModel).filter(ImageModel.file_id == file_id).first()
        return bytes(row.data) if row is not None and row.data is not None else None
