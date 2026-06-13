from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.user import User
from app.repositories.category_repository import get_category_by_id_and_user_id
from app.repositories.transaction_repository import (
    create_transaction,
    delete_transaction,
    get_transaction_by_id_and_user_id,
    get_transactions_by_user_id,
    update_transaction,
)
from app.schemas.transaction import TransactionCreate, TransactionUpdate


def validate_transaction_input(type: str, amount: int) -> None:
    if type not in ["income", "expense"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transaction type must be income or expense",
        )

    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Amount must be greater than 0",
        )


def create_user_transaction(
    db: Session,
    current_user: User,
    transaction_create: TransactionCreate,
) -> Transaction:
    validate_transaction_input(
        type=transaction_create.type,
        amount=transaction_create.amount,
    )

    category = get_category_by_id_and_user_id(
        db=db,
        category_id=transaction_create.category_id,
        user_id=current_user.id,
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return create_transaction(
        db=db,
        user_id=current_user.id,
        category_id=transaction_create.category_id,
        type=transaction_create.type,
        amount=transaction_create.amount,
        memo=transaction_create.memo,
        transaction_date=transaction_create.transaction_date,
    )


def get_user_transactions(
    db: Session,
    current_user: User,
    year: int | None = None,
    month: int | None = None,
) -> list[Transaction]:
    if year is not None and month is not None:
        if year < 2000 or year > 2100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid year",
            )

        if month < 1 or month > 12:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid month",
            )

    return get_transactions_by_user_id(
        db=db,
        user_id=current_user.id,
        year=year,
        month=month,
    )

def update_user_transaction(
    db: Session,
    current_user: User,
    transaction_id: UUID,
    transaction_update: TransactionUpdate,
) -> Transaction:
    transaction = get_transaction_by_id_and_user_id(
        db=db,
        transaction_id=transaction_id,
        user_id=current_user.id,
    )

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    validate_transaction_input(
        type=transaction_update.type,
        amount=transaction_update.amount,
    )

    category = get_category_by_id_and_user_id(
        db=db,
        category_id=transaction_update.category_id,
        user_id=current_user.id,
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return update_transaction(
        db=db,
        transaction=transaction,
        category_id=transaction_update.category_id,
        type=transaction_update.type,
        amount=transaction_update.amount,
        memo=transaction_update.memo,
        transaction_date=transaction_update.transaction_date,
    )


def delete_user_transaction(
    db: Session,
    current_user: User,
    transaction_id: UUID,
) -> None:
    transaction = get_transaction_by_id_and_user_id(
        db=db,
        transaction_id=transaction_id,
        user_id=current_user.id,
    )

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    delete_transaction(
        db=db,
        transaction=transaction,
    )