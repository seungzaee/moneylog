from datetime import date as Date
from uuid import UUID

from pydantic import BaseModel


class MonthlySummary(BaseModel):
    total_income: int
    total_expense: int
    balance: int


class CategorySummary(BaseModel):
    category_id: UUID
    category_name: str
    total_amount: int


class AssetTrendItem(BaseModel):
    label: str
    date: Date | None = None
    income: int
    expense: int
    balance: int