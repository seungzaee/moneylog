from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    type: str


class CategoryUpdate(BaseModel):
    name: str
    type: str


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    type: str
    created_at: datetime

    class Config:
        from_attributes = True