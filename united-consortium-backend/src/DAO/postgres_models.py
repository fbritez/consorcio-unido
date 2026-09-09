from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from src.DAO.postgres_db import Base


class UserModel(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)


class ConsortiumModel(Base):
    __tablename__ = 'consortiums'

    id = Column(String(255), primary_key=True)
    name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    disabled = Column(Boolean, default=False)

    members = relationship('ConsortiumMemberModel', back_populates='consortium')
    administrators = relationship('ConsortiumAdministratorModel', back_populates='consortium')


class ConsortiumMemberModel(Base):
    __tablename__ = 'consortium_members'

    id = Column(Integer, primary_key=True, autoincrement=True)
    consortium_id = Column(String(255), ForeignKey('consortiums.id'))
    user_email = Column(String(255), nullable=False)
    member_name = Column(String(255), nullable=False)
    secondary_email = Column(String(255), default='')
    notes = Column(Text, default='')

    consortium = relationship('ConsortiumModel', back_populates='members')


class ConsortiumAdministratorModel(Base):
    __tablename__ = 'consortium_administrators'

    id = Column(Integer, primary_key=True, autoincrement=True)
    consortium_id = Column(String(255), ForeignKey('consortiums.id'))
    user_email = Column(String(255), nullable=False)

    consortium = relationship('ConsortiumModel', back_populates='administrators')


class ClaimModel(Base):
    __tablename__ = 'claims'

    id = Column(Integer, primary_key=True, autoincrement=True)
    identifier = Column(String(255), unique=True, nullable=False)
    consortium_id = Column(String(255), nullable=False)
    owner = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    state = Column(String(50), nullable=True)
    creation_date = Column(DateTime, nullable=True)


class ClaimMessageModel(Base):
    __tablename__ = 'claim_messages'

    id = Column(Integer, primary_key=True, autoincrement=True)
    claim_id = Column(Integer, ForeignKey('claims.id'))
    owner = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    filename = Column(String(255), default='')


class ExpenseItemModel(Base):
    __tablename__ = 'expense_items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    amount = Column(String(255), nullable=False)
    ticket = Column(String(255), default='')


class ExpensesReceiptModel(Base):
    __tablename__ = 'expenses_receipts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    consortium_id = Column(String(255), nullable=False)
    month = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    is_open = Column(Boolean, default=True)
    payment_processed = Column(Boolean, default=False)


class NotificationModel(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, autoincrement=True)
    consortium_id = Column(String(255), nullable=False)
    publish_date = Column(DateTime, nullable=True)
    payload = Column(Text, nullable=False)


class SettingsModel(Base):
    __tablename__ = 'settings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(255), nullable=False)
    value = Column(Text, nullable=False)
