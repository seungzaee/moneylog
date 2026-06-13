from datetime import date
from uuid import UUID

from sqlalchemy.orm import Session, joinedload

from app.models.transaction import Transaction


def get_month_range(year: int, month: int) -> tuple[date, date]:
    start_date = date(year, month, 1)

    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    return start_date, end_date


def create_transaction(
    db: Session,
    user_id: UUID,
    category_id: UUID,
    type: str,
    amount: int,
    memo: str | None,
    transaction_date,
) -> Transaction:
    transaction = Transaction(
        user_id=user_id,
        category_id=category_id,
        type=type,
        amount=amount,
        memo=memo,
        transaction_date=transaction_date,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction


def get_transactions_by_user_id(
    db: Session,
    user_id: UUID,
    year: int | None = None,
    month: int | None = None,
) -> list[Transaction]:
    query = (
        db.query(Transaction)
        .options(joinedload(Transaction.category))
        .filter(Transaction.user_id == user_id)
    )

    if year is not None and month is not None:
        start_date, end_date = get_month_range(year, month)

        query = query.filter(
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date < end_date,
        )

    return (
        query.order_by(Transaction.transaction_date.desc(), Transaction.created_at.desc())
        .all()
    )


def get_transaction_by_id_and_user_id(
    db: Session,
    transaction_id: UUID,
    user_id: UUID,
) -> Transaction | None:
    return (
        db.query(Transaction)
        .options(joinedload(Transaction.category))
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == user_id,
        )
        .first()
    )


def update_transaction(
    db: Session,
    transaction: Transaction,
    category_id: UUID,
    type: str,
    amount: int,
    memo: str | None,
    transaction_date,
) -> Transaction:
    transaction.category_id = category_id
    transaction.type = type
    transaction.amount = amount
    transaction.memo = memo
    transaction.transaction_date = transaction_date

    db.commit()
    db.refresh(transaction)

    return transaction


def delete_transaction(
    db: Session,
    transaction: Transaction,
) -> None:
    db.delete(transaction)
    db.commit()