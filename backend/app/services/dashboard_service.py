from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.dashboard_repository import (
    get_category_expense_summary,
    get_total_amount_by_type,
)
from app.schemas.dashboard import MonthlySummaryResponse


def validate_year_month(year: int, month: int) -> None:
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


def get_monthly_summary(
    db: Session,
    current_user: User,
    year: int,
    month: int,
) -> MonthlySummaryResponse:
    validate_year_month(year=year, month=month)

    total_income = get_total_amount_by_type(
        db=db,
        user_id=current_user.id,
        year=year,
        month=month,
        transaction_type="income",
    )

    total_expense = get_total_amount_by_type(
        db=db,
        user_id=current_user.id,
        year=year,
        month=month,
        transaction_type="expense",
    )

    return MonthlySummaryResponse(
        total_income=total_income,
        total_expense=total_expense,
        balance=total_income - total_expense,
    )


def get_user_category_expense_summary(
    db: Session,
    current_user: User,
    year: int,
    month: int,
) -> list[dict]:
    validate_year_month(year=year, month=month)

    return get_category_expense_summary(
        db=db,
        user_id=current_user.id,
        year=year,
        month=month,
    )