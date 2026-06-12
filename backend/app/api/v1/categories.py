from uuid import UUID

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.services.auth_service import get_current_user_by_token
from app.services.category_service import (
    create_user_category,
    delete_user_category,
    get_user_categories,
    update_user_category,
)

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
)


@router.post("", response_model=CategoryResponse)
def create_category_api(
    category_create: CategoryCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    return create_user_category(
        db=db,
        current_user=current_user,
        category_create=category_create,
    )


@router.get("", response_model=list[CategoryResponse])
def get_categories_api(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    return get_user_categories(
        db=db,
        current_user=current_user,
    )


@router.patch("/{category_id}", response_model=CategoryResponse)
def update_category_api(
    category_id: UUID,
    category_update: CategoryUpdate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    return update_user_category(
        db=db,
        current_user=current_user,
        category_id=category_id,
        category_update=category_update,
    )


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category_api(
    category_id: UUID,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    delete_user_category(
        db=db,
        current_user=current_user,
        category_id=category_id,
    )

    return None