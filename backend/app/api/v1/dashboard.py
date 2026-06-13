from typing import Literal

from fastapi import APIRouter, Depends, Query
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.dashboard import AssetTrendItem, CategorySummary, MonthlySummary
from app.services.auth_service import get_current_user_by_token
from app.services.dashboard_service import (
    get_asset_trend,
    get_user_category_expense_summary,
    get_user_monthly_summary,
)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    return get_current_user_by_token(db=db, token=token)


@router.get("/summary", response_model=MonthlySummary)
def get_monthly_summary_api(
    year: int = Query(...),
    month: int = Query(..., ge=1, le=12),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_monthly_summary(
        db=db,
        user_id=current_user.id,
        year=year,
        month=month,
    )


@router.get("/category-summary", response_model=list[CategorySummary])
def get_category_summary_api(
    year: int = Query(...),
    month: int = Query(..., ge=1, le=12),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_category_expense_summary(
        db=db,
        user_id=current_user.id,
        year=year,
        month=month,
    )


@router.get("/asset-trend", response_model=list[AssetTrendItem])
def get_asset_trend_api(
    year: int = Query(...),
    month: int = Query(..., ge=1, le=12),
    period: Literal["daily", "weekly"] = Query("daily"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_asset_trend(
        db=db,
        user_id=current_user.id,
        year=year,
        month=month,
        period=period,
    )
    