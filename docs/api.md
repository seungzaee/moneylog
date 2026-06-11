# MoneyLog API Specification

## 1. Overview

MoneyLog는 사용자가 수입과 지출을 기록하고, 월별 소비 현황을 확인할 수 있는 개인 가계부 웹 서비스이다.

이 문서는 프론트엔드와 백엔드가 주고받을 API 요청과 응답 형식을 정의한다.

---

## 2. Base URL

### Local Development

```http
http://localhost:8000/api/v1
```

---

## 3. Common Rules

### Authentication

로그인이 필요한 API는 요청 헤더에 JWT 토큰을 포함해야 한다.

```http
Authorization: Bearer jwt-token
```

---

### Date Format

날짜는 `YYYY-MM-DD` 형식을 사용한다.

```json
"transaction_date": "2026-06-11"
```

---

### Transaction Type

거래 타입은 아래 두 가지 값만 사용한다.

```text
income
expense
```

- `income`: 수입
- `expense`: 지출

---

### Error Response

에러 발생 시 기본 응답 형식은 다음과 같다.

```json
{
  "detail": "Error message"
}
```

---

# 4. Auth API

## 4.1 Signup

회원가입 API

```http
POST /auth/signup
```

### Description

사용자는 이메일과 비밀번호를 입력하여 회원가입할 수 있다.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "id": "uuid",
  "email": "user@example.com"
}
```

---

## 4.2 Login

로그인 API

```http
POST /auth/login
```

### Description

사용자는 이메일과 비밀번호로 로그인할 수 있다.
로그인에 성공하면 JWT access token을 응답으로 받는다.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

---

## 4.3 Get Current User

현재 로그인한 사용자 정보 조회 API

```http
GET /auth/me
```

### Description

현재 로그인한 사용자의 정보를 조회한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Response

```json
{
  "id": "uuid",
  "email": "user@example.com"
}
```

---

# 5. Category API

## 5.1 Get Categories

카테고리 목록 조회 API

```http
GET /categories
```

### Description

현재 로그인한 사용자의 카테고리 목록을 조회한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Response

```json
[
  {
    "id": "uuid",
    "name": "식비",
    "created_at": "2026-06-11T10:00:00",
    "updated_at": "2026-06-11T10:00:00"
  },
  {
    "id": "uuid",
    "name": "교통",
    "created_at": "2026-06-11T10:00:00",
    "updated_at": "2026-06-11T10:00:00"
  }
]
```

---

## 5.2 Create Category

카테고리 생성 API

```http
POST /categories
```

### Description

새로운 카테고리를 생성한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Request Body

```json
{
  "name": "식비"
}
```

### Response

```json
{
  "id": "uuid",
  "name": "식비",
  "created_at": "2026-06-11T10:00:00",
  "updated_at": "2026-06-11T10:00:00"
}
```

---

## 5.3 Update Category

카테고리 수정 API

```http
PATCH /categories/{category_id}
```

### Description

특정 카테고리의 이름을 수정한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Path Parameters

| Name        | Type | Description        |
| ----------- | ---- | ------------------ |
| category_id | UUID | 수정할 카테고리 ID |

### Request Body

```json
{
  "name": "외식"
}
```

### Response

```json
{
  "id": "uuid",
  "name": "외식",
  "created_at": "2026-06-11T10:00:00",
  "updated_at": "2026-06-11T11:00:00"
}
```

---

## 5.4 Delete Category

카테고리 삭제 API

```http
DELETE /categories/{category_id}
```

### Description

특정 카테고리를 삭제한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Path Parameters

| Name        | Type | Description        |
| ----------- | ---- | ------------------ |
| category_id | UUID | 삭제할 카테고리 ID |

### Response

```json
{
  "message": "Category deleted successfully"
}
```

---

# 6. Transaction API

## 6.1 Get Transactions

거래내역 목록 조회 API

```http
GET /transactions
```

### Description

현재 로그인한 사용자의 거래내역 목록을 조회한다.
연도, 월, 거래 타입, 카테고리 조건으로 필터링할 수 있다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Query Parameters

| Name        | Type    | Required | Description         |
| ----------- | ------- | -------- | ------------------- |
| year        | INTEGER | No       | 조회할 연도         |
| month       | INTEGER | No       | 조회할 월           |
| type        | STRING  | No       | income 또는 expense |
| category_id | UUID    | No       | 카테고리 ID         |

### Request Example

```http
GET /transactions?year=2026&month=6&type=expense
```

### Response

```json
[
  {
    "id": "uuid",
    "type": "expense",
    "amount": 12000,
    "memo": "점심",
    "transaction_date": "2026-06-11",
    "category": {
      "id": "uuid",
      "name": "식비"
    },
    "created_at": "2026-06-11T10:00:00",
    "updated_at": "2026-06-11T10:00:00"
  }
]
```

---

## 6.2 Get Transaction Detail

거래내역 상세 조회 API

```http
GET /transactions/{transaction_id}
```

### Description

특정 거래내역 하나를 조회한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Path Parameters

| Name           | Type | Description        |
| -------------- | ---- | ------------------ |
| transaction_id | UUID | 조회할 거래내역 ID |

### Response

```json
{
  "id": "uuid",
  "type": "expense",
  "amount": 12000,
  "memo": "점심",
  "transaction_date": "2026-06-11",
  "category": {
    "id": "uuid",
    "name": "식비"
  },
  "created_at": "2026-06-11T10:00:00",
  "updated_at": "2026-06-11T10:00:00"
}
```

---

## 6.3 Create Transaction

거래내역 생성 API

```http
POST /transactions
```

### Description

새로운 수입 또는 지출 내역을 생성한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Request Body

```json
{
  "type": "expense",
  "category_id": "uuid",
  "amount": 12000,
  "memo": "점심",
  "transaction_date": "2026-06-11"
}
```

### Response

```json
{
  "id": "uuid",
  "type": "expense",
  "amount": 12000,
  "memo": "점심",
  "transaction_date": "2026-06-11",
  "category": {
    "id": "uuid",
    "name": "식비"
  },
  "created_at": "2026-06-11T10:00:00",
  "updated_at": "2026-06-11T10:00:00"
}
```

---

## 6.4 Update Transaction

거래내역 수정 API

```http
PATCH /transactions/{transaction_id}
```

### Description

특정 거래내역을 수정한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Path Parameters

| Name           | Type | Description        |
| -------------- | ---- | ------------------ |
| transaction_id | UUID | 수정할 거래내역 ID |

### Request Body

```json
{
  "type": "expense",
  "category_id": "uuid",
  "amount": 15000,
  "memo": "저녁",
  "transaction_date": "2026-06-11"
}
```

### Response

```json
{
  "id": "uuid",
  "type": "expense",
  "amount": 15000,
  "memo": "저녁",
  "transaction_date": "2026-06-11",
  "category": {
    "id": "uuid",
    "name": "식비"
  },
  "created_at": "2026-06-11T10:00:00",
  "updated_at": "2026-06-11T11:00:00"
}
```

---

## 6.5 Delete Transaction

거래내역 삭제 API

```http
DELETE /transactions/{transaction_id}
```

### Description

특정 거래내역을 삭제한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Path Parameters

| Name           | Type | Description        |
| -------------- | ---- | ------------------ |
| transaction_id | UUID | 삭제할 거래내역 ID |

### Response

```json
{
  "message": "Transaction deleted successfully"
}
```

---

# 7. Dashboard API

## 7.1 Monthly Summary

월별 요약 조회 API

```http
GET /dashboard/summary
```

### Description

특정 연도와 월의 총수입, 총지출, 잔액을 조회한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Query Parameters

| Name  | Type    | Required | Description |
| ----- | ------- | -------- | ----------- |
| year  | INTEGER | Yes      | 조회할 연도 |
| month | INTEGER | Yes      | 조회할 월   |

### Request Example

```http
GET /dashboard/summary?year=2026&month=6
```

### Response

```json
{
  "total_income": 3000000,
  "total_expense": 1200000,
  "balance": 1800000
}
```

---

## 7.2 Category Expense Summary

카테고리별 지출 요약 API

```http
GET /dashboard/category-summary
```

### Description

특정 연도와 월의 카테고리별 지출 합계를 조회한다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Query Parameters

| Name  | Type    | Required | Description |
| ----- | ------- | -------- | ----------- |
| year  | INTEGER | Yes      | 조회할 연도 |
| month | INTEGER | Yes      | 조회할 월   |

### Request Example

```http
GET /dashboard/category-summary?year=2026&month=6
```

### Response

```json
[
  {
    "category_id": "uuid",
    "category_name": "식비",
    "total_amount": 300000
  },
  {
    "category_id": "uuid",
    "category_name": "교통",
    "total_amount": 80000
  }
]
```

---

## 7.3 Monthly Trend

월별 수입/지출 추이 API

```http
GET /dashboard/monthly-trend
```

### Description

특정 연도의 월별 수입과 지출 합계를 조회한다.
차트 기능을 만들 때 사용할 수 있다.

### Headers

```http
Authorization: Bearer jwt-token
```

### Query Parameters

| Name | Type    | Required | Description |
| ---- | ------- | -------- | ----------- |
| year | INTEGER | Yes      | 조회할 연도 |

### Request Example

```http
GET /dashboard/monthly-trend?year=2026
```

### Response

```json
[
  {
    "month": 1,
    "total_income": 2500000,
    "total_expense": 900000
  },
  {
    "month": 2,
    "total_income": 2600000,
    "total_expense": 1100000
  }
]
```

---

# 8. API List Summary

## Auth

| Method | Endpoint     | Description      | Auth Required |
| ------ | ------------ | ---------------- | ------------- |
| POST   | /auth/signup | 회원가입         | No            |
| POST   | /auth/login  | 로그인           | No            |
| GET    | /auth/me     | 현재 사용자 조회 | Yes           |

---

## Category

| Method | Endpoint                  | Description        | Auth Required |
| ------ | ------------------------- | ------------------ | ------------- |
| GET    | /categories               | 카테고리 목록 조회 | Yes           |
| POST   | /categories               | 카테고리 생성      | Yes           |
| PATCH  | /categories/{category_id} | 카테고리 수정      | Yes           |
| DELETE | /categories/{category_id} | 카테고리 삭제      | Yes           |

---

## Transaction

| Method | Endpoint                       | Description        | Auth Required |
| ------ | ------------------------------ | ------------------ | ------------- |
| GET    | /transactions                  | 거래내역 목록 조회 | Yes           |
| GET    | /transactions/{transaction_id} | 거래내역 상세 조회 | Yes           |
| POST   | /transactions                  | 거래내역 생성      | Yes           |
| PATCH  | /transactions/{transaction_id} | 거래내역 수정      | Yes           |
| DELETE | /transactions/{transaction_id} | 거래내역 삭제      | Yes           |

---

## Dashboard

| Method | Endpoint                    | Description          | Auth Required |
| ------ | --------------------------- | -------------------- | ------------- |
| GET    | /dashboard/summary          | 월별 요약 조회       | Yes           |
| GET    | /dashboard/category-summary | 카테고리별 지출 요약 | Yes           |
| GET    | /dashboard/monthly-trend    | 월별 수입/지출 추이  | Yes           |
