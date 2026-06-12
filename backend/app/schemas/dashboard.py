from uuid import UUID

from pydantic import BaseModel


class MonthlySummaryResponse(BaseModel):
    total_income: int
    total_expense: int
    balance: int


class CategorySummaryResponse(BaseModel):
    category_id: UUID
    category_name: str
    total_amount: int