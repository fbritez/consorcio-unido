from datetime import datetime
import os

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.DAO.postgres_DAO import ClaimsDAO, ConsortiumDAO, ExpensesReceiptDAO, UserDAO
from src.DAO.postgres_db import Base
from src.model.claim import Claim, ClaimMessage
from src.model.consortium import Consortium
from src.model.expense_item import ExpenseItem
from src.model.expeses_receipt import ExpensesReceipt
from src.model.user import ConsortiumMember, User


@pytest.fixture()
def db_session():
    engine = create_engine(os.getenv('TEST_DATABASE_URL', 'sqlite:///:memory:'))
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine, expire_on_commit=False)()
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        Base.metadata.drop_all(engine)
        engine.dispose()


def test_user_can_be_created_read_and_updated(db_session):
    dao = UserDAO(db_session)
    created = dao.insert(User('ana@example.com', 'Ana'))

    db_session.expunge_all()
    stored = dao.get_all({'email': 'ana@example.com'})[0]
    assert stored == User('ana@example.com', 'Ana')

    updated = dao.update_all({'email': 'ana@example.com'}, User('ana@example.com', 'Ana Updated'))
    db_session.expunge_all()
    assert dao.get_all({'email': 'ana@example.com'})[0] == updated
    assert created.email == 'ana@example.com'


def test_consortium_persists_members_and_administrators(db_session):
    dao = ConsortiumDAO(db_session)
    consortium = Consortium(
        'Consorcio Norte',
        'Calle 1',
        [ConsortiumMember('ana@example.com', 'Ana', 'ana.secondary@example.com', '5B')],
        ['admin@example.com'],
        identifier='consortium-1',
    )

    dao.insert(consortium)
    db_session.expunge_all()
    stored = dao.get_all({'id': 'consortium-1'})[0]
    assert stored.get_name() == 'Consorcio Norte'
    assert stored.get_address() == 'Calle 1'
    assert stored.get_members() == consortium.get_members()
    assert stored.get_administrators() == ['admin@example.com']

    consortium.address = 'Calle 2'
    consortium.disabled = True
    dao.update_all({'id': 'consortium-1'}, consortium)
    db_session.expunge_all()
    updated = dao.get_all({'id': 'consortium-1'})[0]
    assert updated.get_address() == 'Calle 2'
    assert updated.disabled is True


def test_claim_can_be_created_read_and_updated_with_messages(db_session):
    dao = ClaimsDAO(db_session)
    claim = Claim(
        'claim-1', 'consortium-1', 'ana@example.com', 'Broken gate', 'Open',
        datetime(2026, 9, 13),
        [ClaimMessage('ana@example.com', 'The gate does not close', 'gate.jpg')],
    )

    dao.insert(claim)
    db_session.expunge_all()
    stored = dao.get_all({'identifier': 'claim-1'})[0]
    assert stored.title == 'Broken gate'
    assert stored.messages[0].message == 'The gate does not close'
    assert stored.messages[0].filename == 'gate.jpg'

    claim.title = 'Gate repaired'
    claim.state = 'Closed'
    dao.update_all({'identifier': 'claim-1'}, claim)
    db_session.expunge_all()
    updated = dao.get_all({'identifier': 'claim-1'})[0]
    assert updated.title == 'Gate repaired'
    assert updated.state == 'Closed'


def test_expenses_receipt_persists_items_and_can_be_updated(db_session):
    dao = ExpensesReceiptDAO(db_session)
    receipt = ExpensesReceipt(
        'consortium-1',
        'Septiembre',
        2026,
        [ExpenseItem('Water', 'Monthly water bill', 125.50, 'water.pdf')],
        is_open=True,
        identifier='receipt-1',
    )

    dao.insert(receipt)
    db_session.expunge_all()
    stored = dao.get_all({'identifier': 'receipt-1'})[0]
    assert stored.get_month() == 'Septiembre'
    assert stored.get_expenses_items()[0].title == 'Water'
    assert stored.get_expenses_items()[0].get_amount() == 125.5

    receipt.is_open = False
    receipt.payment_processed = True
    receipt.expense_items[0].amount = 200
    dao.update_all({'identifier': 'receipt-1'}, receipt)
    db_session.expunge_all()
    updated = dao.get_all({'identifier': 'receipt-1'})[0]
    assert updated.is_open is False
    assert updated.payment_processed is True
    assert updated.get_expenses_items()[0].get_amount() == 200