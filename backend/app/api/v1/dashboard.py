from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.dashboard import CategorySummaryResponse, MonthlySummaryResponse
from app.services.auth_service import get_current_user_by_token
from app.services.dashboard_service import (
    get_monthly_summary,
    get_user_category_expense_summary,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
)


@router.get("/summary", response_model=MonthlySummaryResponse)
def get_summary_api(
    year: int,
    month: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    return get_monthly_summary(
        db=db,
        current_user=current_user,
        year=year,
        month=month,
    )


@router.get("/category-summary", response_model=list[CategorySummaryResponse])
def get_category_summary_api(
    year: int,
    month: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    return get_user_category_expense_summary(
        db=db,
        current_user=current_user,
        year=year,
        month=month,
    )