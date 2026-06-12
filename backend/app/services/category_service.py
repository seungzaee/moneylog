from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.user import User
from app.repositories.category_repository import (
    create_category,
    get_categories_by_user_id,
    get_category_by_name_and_user_id,
)
from app.schemas.category import CategoryCreate


def create_user_category(
    db: Session,
    current_user: User,
    category_create: CategoryCreate,
) -> Category:
    existing_category = get_category_by_name_and_user_id(
        db=db,
        user_id=current_user.id,
        name=category_create.name,
    )

    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists",
        )

    return create_category(
        db=db,
        user_id=current_user.id,
        name=category_create.name,
    )


def get_user_categories(
    db: Session,
    current_user: User,
) -> list[Category]:
    return get_categories_by_user_id(
        db=db,
        user_id=current_user.id,
    )