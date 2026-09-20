"""Relational mapping shared by the SQLite and PostgreSQL backends.

Every property of every entity gets its own column, and the nested collections
(members, expense items, claim messages...) live on their own tables linked by a
foreign key instead of being flattened into a JSON document.
"""

from sqlalchemy import (
    Boolean,
    Column,
    Float,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from src.DAO.orm_db import Base


class UserModel(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255))


class LoginModel(Base):
    __tablename__ = 'login'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255))


class ConsortiumModel(Base):
    __tablename__ = 'consortiums'

    id = Column(String(255), primary_key=True)
    name = Column(String(255))
    address = Column(String(255))
    disabled = Column(Boolean, default=False)

    members = relationship(
        'ConsortiumMemberModel',
        back_populates='consortium',
        cascade='all, delete-orphan',
        order_by='ConsortiumMemberModel.id',
    )
    administrators = relationship(
        'ConsortiumAdministratorModel',
        back_populates='consortium',
        cascade='all, delete-orphan',
        order_by='ConsortiumAdministratorModel.id',
    )


class ConsortiumMemberModel(Base):
    __tablename__ = 'consortium_members'

    id = Column(Integer, primary_key=True, autoincrement=True)
    consortium_id = Column(String(255), ForeignKey('consortiums.id'), nullable=False)
    user_email = Column(String(255))
    member_name = Column(String(255))
    secondary_email = Column(String(255), default='')
    notes = Column(Text, default='')

    consortium = relationship('ConsortiumModel', back_populates='members')


class ConsortiumAdministratorModel(Base):
    __tablename__ = 'consortium_administrators'

    id = Column(Integer, primary_key=True, autoincrement=True)
    consortium_id = Column(String(255), ForeignKey('consortiums.id'), nullable=False)
    user_email = Column(String(255))

    consortium = relationship('ConsortiumModel', back_populates='administrators')


class ExpensesReceiptModel(Base):
    __tablename__ = 'expenses_receipts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    consortium_id = Column(String(255))
    month = Column(String(50))
    year = Column(Integer)
    is_open = Column(Boolean, default=True)
    payment_processed = Column(Boolean, default=False)

    expense_items = relationship(
        'ExpenseItemModel',
        primaryjoin='and_(ExpensesReceiptModel.id == ExpenseItemModel.expenses_receipt_id, '
                    'ExpenseItemModel.member_expenses_receipt_id.is_(None))',
        foreign_keys='ExpenseItemModel.expenses_receipt_id',
        cascade='all, delete-orphan',
        order_by='ExpenseItemModel.id',
    )
    member_expenses_receipt_details = relationship(
        'MemberExpensesReceiptModel',
        back_populates='expenses_receipt',
        cascade='all, delete-orphan',
        order_by='MemberExpensesReceiptModel.id',
    )


class MemberExpensesReceiptModel(Base):
    __tablename__ = 'member_expenses_receipts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    expenses_receipt_id = Column(Integer, ForeignKey('expenses_receipts.id'), nullable=False)
    user_email = Column(String(255))
    member_name = Column(String(255))
    secondary_email = Column(String(255), default='')
    notes = Column(Text, default='')
    paid = Column(Boolean, default=False)
    paid_amount = Column(Float, default=0)
    filename = Column(String(255), default='')

    expenses_receipt = relationship(
        'ExpensesReceiptModel', back_populates='member_expenses_receipt_details'
    )
    expenses_items = relationship(
        'ExpenseItemModel',
        primaryjoin='MemberExpensesReceiptModel.id == ExpenseItemModel.member_expenses_receipt_id',
        foreign_keys='ExpenseItemModel.member_expenses_receipt_id',
        cascade='all, delete-orphan',
        order_by='ExpenseItemModel.id',
    )


class ExpenseItemModel(Base):
    __tablename__ = 'expense_items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    expenses_receipt_id = Column(Integer, ForeignKey('expenses_receipts.id'))
    member_expenses_receipt_id = Column(Integer, ForeignKey('member_expenses_receipts.id'))
    title = Column(String(255))
    description = Column(Text)
    amount = Column(Float)
    ticket = Column(String(255), default='')

    members = relationship(
        'ExpenseItemMemberModel',
        back_populates='expense_item',
        cascade='all, delete-orphan',
        order_by='ExpenseItemMemberModel.id',
    )


class ExpenseItemMemberModel(Base):
    __tablename__ = 'expense_item_members'

    id = Column(Integer, primary_key=True, autoincrement=True)
    expense_item_id = Column(Integer, ForeignKey('expense_items.id'), nullable=False)
    user_email = Column(String(255))
    member_name = Column(String(255))
    secondary_email = Column(String(255), default='')
    notes = Column(Text, default='')

    expense_item = relationship('ExpenseItemModel', back_populates='members')


class ClaimModel(Base):
    __tablename__ = 'claims'

    id = Column(Integer, primary_key=True, autoincrement=True)
    identifier = Column(String(255), unique=True)
    consortium_id = Column(String(255))
    owner = Column(String(255))
    title = Column(String(255))
    state = Column(String(50))
    creation_date = Column(String(50))

    messages = relationship(
        'ClaimMessageModel',
        back_populates='claim',
        cascade='all, delete-orphan',
        order_by='ClaimMessageModel.id',
    )


class ClaimMessageModel(Base):
    __tablename__ = 'claim_messages'

    id = Column(Integer, primary_key=True, autoincrement=True)
    claim_id = Column(Integer, ForeignKey('claims.id'), nullable=False)
    owner = Column(String(255))
    message = Column(Text)
    filename = Column(String(255), default='')

    claim = relationship('ClaimModel', back_populates='messages')


class NotificationModel(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, autoincrement=True)
    consortium_id = Column(String(255))
    message = Column(Text)
    publishDate = Column(String(50))
    extra_properties = Column(Text)


class SettingsModel(Base):
    __tablename__ = 'settings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(255))
    setting_id = Column(String(255))
    extra_properties = Column(Text)


class NotificationReactionModel(Base):
    __tablename__ = 'notification_reactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    notification_id = Column(Integer, ForeignKey('notifications.id'), nullable=False)
    user_email = Column(String(255), nullable=False)
    reaction_type = Column(String(50), nullable=False)

    notification = relationship('NotificationModel')


class ImageModel(Base):
    __tablename__ = 'images'

    id = Column(Integer, primary_key=True, autoincrement=True)
    file_id = Column(String(255), unique=True, nullable=False)
    data = Column(LargeBinary)
