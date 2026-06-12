from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.repositories.user_repository import create_user, get_user_by_email
from app.schemas.user import UserCreate
from app.models.user import User


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