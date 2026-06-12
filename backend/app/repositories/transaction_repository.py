from uuid import UUID

from sqlalchemy.orm import Session, joinedload

from app.models.transaction import Transaction


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
) -> list[Transaction]:
    return (
        db.query(Transaction)
        .options(joinedload(Transaction.category))
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.transaction_date.desc(), Transaction.created_at.desc())
        .all()
    )