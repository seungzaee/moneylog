from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import signup

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/signup", response_model=UserResponse)
def signup_api(
    user_create: UserCreate,
    db: Session = Depends(get_db),
):
    return signup(db=db, user_create=user_create)