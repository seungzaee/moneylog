from fastapi import FastAPI

app = FastAPI(
    title="MoneyLog API",
    description="Personal finance tracker API",
    version="0.1.0",
)


@app.get("/")
def read_root():
    return {"message": "MoneyLog API"}