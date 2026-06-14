from pydantic import BaseModel


class AiChatRequest(BaseModel):
    message: str
    year: int
    month: int


class AiChatResponse(BaseModel):
    answer: str