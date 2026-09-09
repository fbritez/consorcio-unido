from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from src.DAO.postgres_db import SessionLocal
from src.model.claim import Claim, ClaimMessage
from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt, MemberExpensesReceipt
from src.model.user import User, ConsortiumMember


class PostgresBaseDAO:
    model = None

    def __init__(self, db_session=None):
        self.db = db_session or SessionLocal()

    def _close(self):
        if self.db is not None:
            self.db.close()

    def insert(self, element):
        self.db.add(element)
        self.db.commit()
        self.db.refresh(element)
        return element

    def insert_all(self, elements):
        self.db.add_all(elements)
        self.db.commit()
        return elements

    def get_all(self, query_obj=None):
        if self.model is None:
            return []
        query = self.db.query(self.model)
        if query_obj:
            for key, value in query_obj.items():
                if key.startswith('$'):
                    continue
                query = query.filter(getattr(self.model, key) == value)
        return query.all()

    def get(self, query_obj):
        if self.model is None:
            return []
        query = self.db.query(self.model)
        for key, value in query_obj.items():
            if key.startswith('$'):
                continue
            query = query.filter(getattr(self.model, key) == value)
        return query.all()

    def update_all(self, query_obj, new_element):
        if self.model is None:
            return None
        db_obj = self.db.query(self.model).filter_by(**query_obj).first()
        if db_obj is None:
            return self.insert(new_element)
        for key, value in new_element.__dict__.items():
            if key.startswith('_'):
                continue
            setattr(db_obj, key, value)
        self.db.commit()
        return db_obj

    def create_model(self, element):
        raise NotImplementedError


class UserDAO(PostgresBaseDAO):
    model = User

    def create_model(self, element):
        return User(element.get('email'), element.get('name'))


class LoginDAO(PostgresBaseDAO):
    model = User

    def create_model(self, element):
        return element


class ConsortiumDAO(PostgresBaseDAO):
    model = Consortium

    def create_model(self, element):
        members = [ConsortiumMember(member.get('user_email'), member.get('member_name'), member.get('secondary_email'), member.get('notes')) for member in element.get('members', [])]
        return Consortium(element.get('name'), element.get('address'), members, element.get('administrators', []), element.get('disabled'), element.get('id'))


class ExpensesReceiptDAO(PostgresBaseDAO):
    model = ExpensesReceipt

    def create_model(self, element):
        items = []
        member_receipts = []
        return ExpensesReceipt(element.get('consortium_id'), element.get('month'), element.get('year'), expense_items=items, is_open=element.get('is_open'), identifier=str(element.get('_id')), member_expenses_receipt_details=member_receipts, payment_processed=element.get('payment_processed'))


class SettingsDAO(PostgresBaseDAO):
    model = dict

    def get(self, query_obj):
        return []

    def insert(self, element):
        return element

    def update_all(self, query_obj, new_element):
        return new_element


class NotificationDAO(PostgresBaseDAO):
    model = dict

    def get(self, query_obj):
        return []

    def insert(self, element):
        return element

    def update_all(self, query_obj, new_element):
        return new_element


class ClaimsDAO(PostgresBaseDAO):
    model = Claim

    def create_model(self, element):
        messages = [ClaimMessage(message.get('owner'), message.get('message'), message.get('filename')) for message in element.get('messages', [])]
        return Claim(element.get('identifier'), element.get('consortium_id'), element.get('owner'), element.get('title'), element.get('state', None), element.get('creation_date'), messages=messages)
