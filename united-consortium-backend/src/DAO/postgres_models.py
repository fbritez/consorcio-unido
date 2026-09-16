"""Backwards compatible entry point for the ORM mapping.

The mapping is shared by the SQLite and PostgreSQL backends and lives in
:mod:`src.DAO.orm_models`.
"""

from src.DAO.orm_models import (  # noqa: F401
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
