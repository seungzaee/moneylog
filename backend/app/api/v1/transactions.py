from uuid import UUID

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionUpdate,
)
from app.services.auth_service import get_current_user_by_token
from app.services.transaction_service import (
    create_user_transaction,
    delete_user_transaction,
    get_user_transactions,
    update_user_transaction,
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
    year: int | None = None,
    month: int | None = None,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    return get_user_transactions(
        db=db,
        current_user=current_user,
        year=year,
        month=month,
    )

@router.patch("/{transaction_id}", response_model=TransactionResponse)
def update_transaction_api(
    transaction_id: UUID,
    transaction_update: TransactionUpdate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    return update_user_transaction(
        db=db,
        current_user=current_user,
        transaction_id=transaction_id,
        transaction_update=transaction_update,
    )


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction_api(
    transaction_id: UUID,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    current_user = get_current_user_by_token(db=db, token=token)

    delete_user_transaction(
        db=db,
        current_user=current_user,
        transaction_id=transaction_id,
    )

    return None