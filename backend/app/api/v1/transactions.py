from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.services.auth_service import get_current_user_by_token
from app.services.transaction_service import (
    create_user_transaction,
    get_user_transactions,
)

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
)


@router.post("", response_model=TransactionResponse)
def create_transaction_api(
    transaction_create: TransactionCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    return create_user_transaction(
        db=db,
        current_user=current_user,
        transaction_create=transaction_create,
    )


@router.get("", response_model=list[TransactionResponse])
def get_transactions_api(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    return get_user_transactions(
        db=db,
        current_user=current_user,
    )