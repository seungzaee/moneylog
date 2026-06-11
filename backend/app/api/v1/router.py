from fastapi import APIRouter

from app.core.database import check_database_connection

api_router = APIRouter()


@api_router.get("/health")
def health_check():
    return {"status": "ok"}


@api_router.get("/db-check")
def db_check():
    result = check_database_connection()

    if result == 1:
        return {"database": "connected"}

    return {"database": "disconnected"}