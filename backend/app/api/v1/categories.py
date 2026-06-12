from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryResponse
from app.services.auth_service import get_current_user_by_token
from app.services.category_service import create_user_category, get_user_categories

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