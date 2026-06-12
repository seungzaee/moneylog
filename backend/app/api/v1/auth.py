from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse
from app.services.auth_service import login, signup

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


@router.post("/login", response_model=Token)
def login_api(
    user_login: UserLogin,
    db: Session = Depends(get_db),
):
    return login(db=db, user_login=user_login)