from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.ai import AiChatRequest, AiChatResponse
from app.services.ai_service import create_ai_answer
from app.services.auth_service import get_current_user_by_token

router = APIRouter(prefix="/ai", tags=["ai"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    return get_current_user_by_token(db=db, token=token)


@router.post("/chat", response_model=AiChatResponse)
def chat_with_ai(
    request: AiChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    answer = create_ai_answer(
        db=db,
        user_id=current_user.id,
        message=request.message,
        year=request.year,
        month=request.month,
    )

    return AiChatResponse(answer=answer)