from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import create_user, get_user_by_email
from app.schemas.user import UserCreate, UserLogin


def signup(db: Session, user_create: UserCreate) -> User:
    existing_user = get_user_by_email(db, user_create.email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    password_hash = get_password_hash(user_create.password)

    user = create_user(
        db=db,
        email=user_create.email,
        password_hash=password_hash,
    )

    return user


def login(db: Session, user_login: UserLogin) -> dict:
    user = get_user_by_email(db, user_login.email)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(user_login.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(subject=str(user.id))

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }