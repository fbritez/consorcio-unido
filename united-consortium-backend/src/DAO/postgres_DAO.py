from datetime import datetime

from src.DAO.postgres_db import SessionLocal
from src.DAO.postgres_models import (
    ClaimMessageModel,
    ClaimModel,
    ConsortiumAdministratorModel,
    ConsortiumMemberModel,
    ConsortiumModel,
    ExpenseItemModel,
    ExpensesReceiptModel,
    UserModel,
)
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
        self.db.add(self.to_orm(element))
        self.db.commit()
        return element

    def insert_all(self, elements):
        self.db.add_all([self.to_orm(element) for element in elements])
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
        return [self.from_orm(element) for element in query.all()]

    def get(self, query_obj):
        if self.model is None:
            return []
        query = self.db.query(self.model)
        for key, value in query_obj.items():
            if key.startswith('$'):
                continue
            query = query.filter(getattr(self.model, key) == value)
        return [self.from_orm(element) for element in query.all()]

    def update_all(self, query_obj, new_element):
        if self.model is None:
            return None
        db_obj = self.db.query(self.model).filter_by(**query_obj).first()
        if db_obj is None:
            return self.insert(new_element)
        self.update_orm(db_obj, new_element)
        self.db.commit()
        return new_element

    def to_orm(self, element):
        raise NotImplementedError

    def from_orm(self, element):
        raise NotImplementedError

    def update_orm(self, db_obj, element):
        raise NotImplementedError

    def create_model(self, element):
        raise NotImplementedError


class UserDAO(PostgresBaseDAO):
    model = UserModel

    def create_model(self, element):
        return User(element.get('email'), element.get('name'))

    def to_orm(self, element):
        return UserModel(email=element.email, name=element.name)

    def from_orm(self, element):
        return User(element.email, element.name)

    def update_orm(self, db_obj, element):
        db_obj.email = element.email
        db_obj.name = element.name


class LoginDAO(PostgresBaseDAO):
    model = User

    def create_model(self, element):
        return element


class ConsortiumDAO(PostgresBaseDAO):
    model = ConsortiumModel

    def create_model(self, element):
        members = [ConsortiumMember(member.get('user_email'), member.get('member_name'), member.get('secondary_email'), member.get('notes')) for member in element.get('members', [])]
        return Consortium(element.get('name'), element.get('address'), members, element.get('administrators', []), element.get('disabled'), element.get('id'))

    def to_orm(self, element):
        return ConsortiumModel(
            id=element.id,
            name=element.name,
            address=element.address,
            disabled=element.disabled,
            members=[ConsortiumMemberModel(user_email=member.user_email, member_name=member.member_name, secondary_email=member.secondary_email, notes=member.notes) for member in element.members],
            administrators=[ConsortiumAdministratorModel(user_email=email) for email in element.administrators],
        )

    def from_orm(self, element):
        members = [ConsortiumMember(member.user_email, member.member_name, member.secondary_email, member.notes) for member in element.members]
        return Consortium(element.name, element.address, members, [admin.user_email for admin in element.administrators], element.disabled, element.id)

    def update_orm(self, db_obj, element):
        db_obj.name = element.name
        db_obj.address = element.address
        db_obj.disabled = element.disabled
        db_obj.members = [ConsortiumMemberModel(user_email=member.user_email, member_name=member.member_name, secondary_email=member.secondary_email, notes=member.notes) for member in element.members]
        db_obj.administrators = [ConsortiumAdministratorModel(user_email=email) for email in element.administrators]


class ExpensesReceiptDAO(PostgresBaseDAO):
    model = ExpensesReceiptModel

    def create_model(self, element):
        items = []
        member_receipts = []
        return ExpensesReceipt(element.get('consortium_id'), element.get('month'), element.get('year'), expense_items=items, is_open=element.get('is_open'), identifier=str(element.get('_id')), member_expenses_receipt_details=member_receipts, payment_processed=element.get('payment_processed'))

    def to_orm(self, element):
        return ExpensesReceiptModel(
            identifier=element.identifier,
            consortium_id=element.consortium_id,
            month=element.month,
            year=element.year,
            is_open=element.is_open,
            payment_processed=element.payment_processed,
            expense_items=[ExpenseItemModel(title=item.title, description=item.description, amount=item.amount, ticket=item.ticket) for item in element.expense_items],
        )

    def from_orm(self, element):
        items = [ExpenseItem(item.title, item.description, item.amount, item.ticket) for item in element.expense_items]
        return ExpensesReceipt(element.consortium_id, element.month, element.year, items, element.is_open, element.identifier, payment_processed=element.payment_processed)

    def update_orm(self, db_obj, element):
        db_obj.consortium_id = element.consortium_id
        db_obj.month = element.month
        db_obj.year = element.year
        db_obj.is_open = element.is_open
        db_obj.payment_processed = element.payment_processed
        db_obj.expense_items = [ExpenseItemModel(title=item.title, description=item.description, amount=item.amount, ticket=item.ticket) for item in element.expense_items]


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
    model = ClaimModel

    def create_model(self, element):
        messages = [ClaimMessage(message.get('owner'), message.get('message'), message.get('filename')) for message in element.get('messages', [])]
        return Claim(element.get('identifier'), element.get('consortium_id'), element.get('owner'), element.get('title'), element.get('state', None), element.get('creation_date'), messages=messages)

    def to_orm(self, element):
        creation_date = element.creation_date
        if isinstance(creation_date, str):
            creation_date = datetime.fromisoformat(creation_date)
        return ClaimModel(
            identifier=element.identifier,
            consortium_id=element.consortium_id,
            owner=element.owner,
            title=element.title,
            state=element.state,
            creation_date=creation_date,
            messages=[ClaimMessageModel(owner=message.owner, message=message.message, filename=message.filename) for message in element.messages],
        )

    def from_orm(self, element):
        messages = [ClaimMessage(message.owner, message.message, message.filename) for message in element.messages]
        return Claim(element.identifier, element.consortium_id, element.owner, element.title, element.state, element.creation_date, messages)

    def update_orm(self, db_obj, element):
        db_obj.consortium_id = element.consortium_id
        db_obj.owner = element.owner
        db_obj.title = element.title
        db_obj.state = element.state
        db_obj.creation_date = element.creation_date
        db_obj.messages = [ClaimMessageModel(owner=message.owner, message=message.message, filename=message.filename) for message in element.messages]
