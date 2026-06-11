# MoneyLog ERD

## User

사용자 정보

| Column        | Type      | Description       |
| ------------- | --------- | ----------------- |
| id            | UUID      | 사용자 고유 ID    |
| email         | VARCHAR   | 이메일            |
| password_hash | VARCHAR   | 암호화된 비밀번호 |
| created_at    | TIMESTAMP | 생성일            |
| updated_at    | TIMESTAMP | 수정일            |

---

## Category

카테고리 정보

| Column     | Type      | Description   |
| ---------- | --------- | ------------- |
| id         | UUID      | 카테고리 ID   |
| user_id    | UUID      | 사용자 ID     |
| name       | VARCHAR   | 카테고리 이름 |
| created_at | TIMESTAMP | 생성일        |
| updated_at | TIMESTAMP | 수정일        |

---

## Transaction

거래 내역

| Column           | Type      | Description      |
| ---------------- | --------- | ---------------- |
| id               | UUID      | 거래 ID          |
| user_id          | UUID      | 사용자 ID        |
| category_id      | UUID      | 카테고리 ID      |
| type             | VARCHAR   | income / expense |
| amount           | INTEGER   | 금액             |
| memo             | TEXT      | 메모             |
| transaction_date | DATE      | 거래 날짜        |
| created_at       | TIMESTAMP | 생성일           |
| updated_at       | TIMESTAMP | 수정일           |

---

## Relationships

User 1:N Category

User 1:N Transaction

Category 1:N Transaction

## Keys

### Primary Keys

- User.id
- Category.id
- Transaction.id

### Foreign Keys

- Category.user_id -> User.id
- Transaction.user_id -> User.id
- Transaction.category_id -> Category.id
