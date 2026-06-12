from fastapi import APIRouter

from app.api.v1 import auth, categories, dashboard, transactions
from app.core.database import check_database_connection

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(categories.router)
api_router.include_router(transactions.router)
api_router.include_router(dashboard.router)


@api_router.get("/health")
def health_check():
    return {"status": "ok"}


@api_router.get("/db-check")
def db_check():
    result = check_database_connection()

    if result == 1:
        return {"database": "connected"}

    return {"database": "disconnected"}