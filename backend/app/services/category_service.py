from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.user import User
from app.repositories.category_repository import (
    create_category,
    delete_category,
    get_categories_by_user_id,
    get_category_by_id_and_user_id,
    get_category_by_name_and_user_id,
    update_category,
)
from app.schemas.category import CategoryCreate, CategoryUpdate


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


def update_user_category(
    db: Session,
    current_user: User,
    category_id: UUID,
    category_update: CategoryUpdate,
) -> Category:
    category = get_category_by_id_and_user_id(
        db=db,
        category_id=category_id,
        user_id=current_user.id,
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    existing_category = get_category_by_name_and_user_id(
        db=db,
        user_id=current_user.id,
        name=category_update.name,
    )

    if existing_category and existing_category.id != category.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists",
        )

    return update_category(
        db=db,
        category=category,
        name=category_update.name,
    )


def delete_user_category(
    db: Session,
    current_user: User,
    category_id: UUID,
) -> None:
    category = get_category_by_id_and_user_id(
        db=db,
        category_id=category_id,
        user_id=current_user.id,
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    delete_category(
        db=db,
        category=category,
    )