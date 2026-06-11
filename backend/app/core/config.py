from pydantic import BaseModel


class Settings(BaseModel):
    PROJECT_NAME: str = "MoneyLog"
    API_V1_PREFIX: str = "/api/v1"


settings = Settings()