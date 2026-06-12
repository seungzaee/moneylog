from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class TransactionCreate(BaseModel):
    type: str
    category_id: UUID
    amount: int
    memo: str | None = None
    transaction_date: date


class TransactionUpdate(BaseModel):
    type: str
    category_id: UUID
    amount: int
    memo: str | None = None
    transaction_date: date


class TransactionCategoryResponse(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True


class TransactionResponse(BaseModel):
    id: UUID
    type: str
    amount: int
    memo: str | None
    transaction_date: date
    category: TransactionCategoryResponse
    created_at: datetime

    class Config:
        from_attributes = True