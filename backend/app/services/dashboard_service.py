from calendar import monthrange
from datetime import date
from uuid import UUID

from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import (
    get_balance_before_date,
    get_category_expense_summary,
    get_monthly_summary,
    get_transactions_between_dates,
)
from app.schemas.dashboard import AssetTrendItem, CategorySummary, MonthlySummary


def get_user_monthly_summary(
    db: Session,
    user_id: UUID,
    year: int,
    month: int,
) -> MonthlySummary:
    summary = get_monthly_summary(
        db=db,
        user_id=user_id,
        year=year,
        month=month,
    )

    return MonthlySummary(
        total_income=summary["total_income"],
        total_expense=summary["total_expense"],
        balance=summary["balance"],
    )


def get_user_category_expense_summary(
    db: Session,
    user_id: UUID,
    year: int,
    month: int,
) -> list[CategorySummary]:
    rows = get_category_expense_summary(
        db=db,
        user_id=user_id,
        year=year,
        month=month,
    )

    return [
        CategorySummary(
            category_id=row["category_id"],
            category_name=row["category_name"],
            total_amount=row["total_amount"],
        )
        for row in rows
    ]


def get_month_date_range(year: int, month: int) -> tuple[date, date]:
    last_day = monthrange(year, month)[1]

    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)

    return start_date, end_date


def get_asset_trend(
    db: Session,
    user_id: UUID,
    year: int,
    month: int,
    period: str,
) -> list[AssetTrendItem]:
    start_date, end_date = get_month_date_range(year, month)

    starting_balance = get_balance_before_date(
        db=db,
        user_id=user_id,
        start_date=start_date,
    )

    transactions = get_transactions_between_dates(
        db=db,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date,
    )

    if period == "weekly":
        return create_weekly_asset_trend(
            year=year,
            month=month,
            starting_balance=starting_balance,
            transactions=transactions,
        )

    return create_daily_asset_trend(
        year=year,
        month=month,
        starting_balance=starting_balance,
        transactions=transactions,
    )


def create_daily_asset_trend(
    year: int,
    month: int,
    starting_balance: int,
    transactions,
) -> list[AssetTrendItem]:
    last_day = monthrange(year, month)[1]

    daily_map: dict[date, dict[str, int]] = {}

    for day in range(1, last_day + 1):
        current_date = date(year, month, day)

        daily_map[current_date] = {
            "income": 0,
            "expense": 0,
        }

    for transaction in transactions:
        transaction_date = transaction.transaction_date

        if transaction_date not in daily_map:
            continue

        if transaction.type == "income":
            daily_map[transaction_date]["income"] += transaction.amount
        else:
            daily_map[transaction_date]["expense"] += transaction.amount

    running_balance = starting_balance
    trend_items: list[AssetTrendItem] = []

    for day in range(1, last_day + 1):
        current_date = date(year, month, day)

        income = daily_map[current_date]["income"]
        expense = daily_map[current_date]["expense"]

        running_balance += income - expense

        trend_items.append(
            AssetTrendItem(
                label=f"{day}일",
                date=current_date,
                income=income,
                expense=expense,
                balance=running_balance,
            )
        )

    return trend_items


def create_weekly_asset_trend(
    year: int,
    month: int,
    starting_balance: int,
    transactions,
) -> list[AssetTrendItem]:
    last_day = monthrange(year, month)[1]
    week_count = ((last_day - 1) // 7) + 1

    weekly_map: dict[int, dict[str, int | date]] = {}

    for week_index in range(1, week_count + 1):
        week_start_day = ((week_index - 1) * 7) + 1
        week_start_date = date(year, month, week_start_day)

        weekly_map[week_index] = {
            "income": 0,
            "expense": 0,
            "date": week_start_date,
        }

    for transaction in transactions:
        day = transaction.transaction_date.day
        week_index = ((day - 1) // 7) + 1

        if week_index not in weekly_map:
            continue

        if transaction.type == "income":
            weekly_map[week_index]["income"] = (
                int(weekly_map[week_index]["income"]) + transaction.amount
            )
        else:
            weekly_map[week_index]["expense"] = (
                int(weekly_map[week_index]["expense"]) + transaction.amount
            )

    running_balance = starting_balance
    trend_items: list[AssetTrendItem] = []

    for week_index in range(1, week_count + 1):
        income = int(weekly_map[week_index]["income"])
        expense = int(weekly_map[week_index]["expense"])
        week_start_date = weekly_map[week_index]["date"]

        running_balance += income - expense

        trend_items.append(
            AssetTrendItem(
                label=f"{week_index}주차",
                date=week_start_date,
                income=income,
                expense=expense,
                balance=running_balance,
            )
        )

    return trend_items