# MoneyLog Wireframe

## Pages

MoneyLog MVP에서 필요한 화면 목록

---

## 1. Signup Page

회원가입 화면

### Route

/signup

### Fields

- email
- password
- password confirm

### Actions

- 회원가입 버튼 클릭 시 회원가입 API 요청
- 회원가입 성공 시 로그인 페이지로 이동

---

## 2. Login Page

로그인 화면

### Route

/login

### Fields

- email
- password

### Actions

- 로그인 버튼 클릭 시 로그인 API 요청
- 로그인 성공 시 대시보드 페이지로 이동

---

## 3. Dashboard Page

대시보드 화면

### Route

/dashboard

### Display

- 이번 달 총수입
- 이번 달 총지출
- 이번 달 잔액
- 카테고리별 지출 요약

### Actions

- 거래내역 페이지로 이동
- 거래 등록 페이지로 이동

---

## 4. Transactions Page

거래내역 목록 화면

### Route

/transactions

### Display

- 거래 날짜
- 수입/지출 타입
- 카테고리
- 금액
- 메모

### Actions

- 거래 등록 페이지로 이동
- 거래 수정
- 거래 삭제

---

## 5. Transaction Form Page

거래 등록 / 수정 화면

### Route

/transactions/new

/transactions/:id/edit

### Fields

- type
- category
- amount
- memo
- transaction_date

### Actions

- 저장 버튼 클릭 시 거래 등록 또는 수정 API 요청
- 저장 성공 시 거래내역 목록 페이지로 이동

---

## 6. Categories Page

카테고리 관리 화면

### Route

/categories

### Display

- 카테고리 목록

### Actions

- 카테고리 생성
- 카테고리 이름 수정
- 카테고리 삭제
