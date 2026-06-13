from datetime import date
from uuid import UUID

from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.transaction import Transaction


def get_monthly_summary(
    db: Session,
    user_id: UUID,
    year: int,
    month: int,
) -> dict:
    income = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(Transaction.user_id == user_id)
        .filter(Transaction.type == "income")
        .filter(func.extract("year", Transaction.transaction_date) == year)
        .filter(func.extract("month", Transaction.transaction_date) == month)
        .scalar()
    )

    expense = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(Transaction.user_id == user_id)
        .filter(Transaction.type == "expense")
        .filter(func.extract("year", Transaction.transaction_date) == year)
        .filter(func.extract("month", Transaction.transaction_date) == month)
        .scalar()
    )

    total_income = int(income or 0)
    total_expense = int(expense or 0)

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense,
    }


def get_category_expense_summary(
    db: Session,
    user_id: UUID,
    year: int,
    month: int,
) -> list[dict]:
    rows = (
        db.query(
            Category.id.label("category_id"),
            Category.name.label("category_name"),
            func.coalesce(func.sum(Transaction.amount), 0).label("total_amount"),
        )
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(Transaction.user_id == user_id)
        .filter(Transaction.type == "expense")
        .filter(func.extract("year", Transaction.transaction_date) == year)
        .filter(func.extract("month", Transaction.transaction_date) == month)
        .group_by(Category.id, Category.name)
        .order_by(func.coalesce(func.sum(Transaction.amount), 0).desc())
        .all()
    )

    return [
        {
            "category_id": row.category_id,
            "category_name": row.category_name,
            "total_amount": int(row.total_amount or 0),
        }
        for row in rows
    ]


def get_balance_before_date(
    db: Session,
    user_id: UUID,
    start_date: date,
) -> int:
    balance = (
        db.query(
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.type == "income", Transaction.amount),
                        else_=-Transaction.amount,
                    )
                ),
                0,
            )
        )
        .filter(Transaction.user_id == user_id)
        .filter(Transaction.transaction_date < start_date)
        .scalar()
    )

    return int(balance or 0)


def get_transactions_between_dates(
    db: Session,
    user_id: UUID,
    start_date: date,
    end_date: date,
) -> list[Transaction]:
    return (
        db.query(Transaction)
        .filter(Transaction.user_id == user_id)
        .filter(Transaction.transaction_date >= start_date)
        .filter(Transaction.transaction_date <= end_date)
        .order_by(Transaction.transaction_date.asc(), Transaction.created_at.asc())
        .all()
    )