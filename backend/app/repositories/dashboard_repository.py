from datetime import date
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.transaction import Transaction


def get_month_range(year: int, month: int) -> tuple[date, date]:
    start_date = date(year, month, 1)

    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    return start_date, end_date


def get_total_amount_by_type(
    db: Session,
    user_id: UUID,
    year: int,
    month: int,
    transaction_type: str,
) -> int:
    start_date, end_date = get_month_range(year, month)

    total = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == transaction_type,
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date < end_date,
        )
        .scalar()
    )

    return int(total)


def get_category_expense_summary(
    db: Session,
    user_id: UUID,
    year: int,
    month: int,
) -> list[dict]:
    start_date, end_date = get_month_range(year, month)

    rows = (
        db.query(
            Category.id.label("category_id"),
            Category.name.label("category_name"),
            func.coalesce(func.sum(Transaction.amount), 0).label("total_amount"),
        )
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date < end_date,
        )
        .group_by(Category.id, Category.name)
        .order_by(func.sum(Transaction.amount).desc())
        .all()
    )

    return [
        {
            "category_id": row.category_id,
            "category_name": row.category_name,
            "total_amount": int(row.total_amount),
        }
        for row in rows
    ]