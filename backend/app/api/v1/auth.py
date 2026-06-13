from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse
from app.services.auth_service import (
    get_current_user_by_token,
    login,
    refresh_access_token,
    signup,
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
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


@router.get("/me", response_model=UserResponse)
def get_me_api(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    return get_current_user_by_token(db=db, token=token)

@router.post("/refresh", response_model=Token)
def refresh_token_api(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    return refresh_access_token(db=db, token=token)