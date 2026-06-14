import os
from calendar import monthrange
from datetime import date
from uuid import UUID

from dotenv import load_dotenv
from fastapi import HTTPException, status
from google import genai
from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import (
    get_balance_before_date,
    get_category_expense_summary,
    get_monthly_summary,
    get_transactions_between_dates,
)

load_dotenv()


def get_month_date_range(year: int, month: int) -> tuple[date, date]:
    last_day = monthrange(year, month)[1]

    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)

    return start_date, end_date


def format_currency(value: int) -> str:
    return f"{value:,}원"


def build_moneylog_context(
    db: Session,
    user_id: UUID,
    year: int,
    month: int,
) -> str:
    start_date, end_date = get_month_date_range(year, month)

    summary = get_monthly_summary(
        db=db,
        user_id=user_id,
        year=year,
        month=month,
    )

    category_summary = get_category_expense_summary(
        db=db,
        user_id=user_id,
        year=year,
        month=month,
    )

    recent_transactions = get_transactions_between_dates(
        db=db,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date,
    )[-10:]

    starting_balance = get_balance_before_date(
        db=db,
        user_id=user_id,
        start_date=start_date,
    )

    current_balance = starting_balance + summary["balance"]

    category_lines = []

    for item in category_summary[:8]:
        category_lines.append(
            f"- {item['category_name']}: {format_currency(item['total_amount'])}"
        )

    if not category_lines:
        category_lines.append("- 카테고리별 지출 데이터 없음")

    transaction_lines = []

    for transaction in recent_transactions:
        sign = "+" if transaction.type == "income" else "-"
        memo = transaction.memo or "메모 없음"

        category_name = (
            transaction.category.name
            if transaction.category
            else "카테고리 없음"
        )

        transaction_lines.append(
            f"- {transaction.transaction_date} / {transaction.type} / "
            f"{category_name} / {sign}{format_currency(transaction.amount)} / {memo}"
        )

    if not transaction_lines:
        transaction_lines.append("- 최근 거래내역 없음")

    context = f"""
[분석 대상]
- 기간: {year}년 {month}월

[월간 요약]
- 총수입: {format_currency(summary["total_income"])}
- 총지출: {format_currency(summary["total_expense"])}
- 월간 잔액: {format_currency(summary["balance"])}
- 월 시작 전 누적 잔액: {format_currency(starting_balance)}
- 현재 누적 잔액: {format_currency(current_balance)}

[카테고리별 지출]
{chr(10).join(category_lines)}

[최근 거래내역 최대 10개]
{chr(10).join(transaction_lines)}
""".strip()

    return context


def get_gemini_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GEMINI_API_KEY is not set",
        )

    return genai.Client(api_key=api_key)


def create_ai_answer(
    db: Session,
    user_id: UUID,
    message: str,
    year: int,
    month: int,
) -> str:
    context = build_moneylog_context(
        db=db,
        user_id=user_id,
        year=year,
        month=month,
    )

    client = get_gemini_client()

    prompt = f"""
너는 MoneyLog 앱의 개인 가계부 AI 도우미야.

역할:
- 사용자의 수입, 지출, 카테고리, 누적 자산 데이터를 바탕으로 소비를 분석한다.
- 간결하고 실용적인 한국어 답변을 제공한다.
- 제공된 데이터에 없는 사실은 추측하지 않는다.
- 투자, 법률, 의료 같은 고위험 조언은 하지 않는다.
- 답변은 3~6문장 정도로 자연스럽게 작성한다.
- 숫자는 가능하면 원 단위로 보기 좋게 설명한다.

아래는 사용자의 MoneyLog 데이터야.

{context}

사용자 질문:
{message}
""".strip()

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        if not response.text:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Gemini returned an empty response",
            )

        return response.text

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create AI response: {str(error)}",
        ) from error