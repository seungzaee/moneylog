from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.user import User
from app.repositories.category_repository import get_category_by_id_and_user_id
from app.repositories.transaction_repository import (
    create_transaction,
    get_transactions_by_user_id,
)
from app.schemas.transaction import TransactionCreate


def create_user_transaction(
    db: Session,
    current_user: User,
    transaction_create: TransactionCreate,
) -> Transaction:
    if transaction_create.type not in ["income", "expense"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transaction type must be income or expense",
        )

    if transaction_create.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Amount must be greater than 0",
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
) -> list[Transaction]:
    return get_transactions_by_user_id(
        db=db,
        user_id=current_user.id,
    )