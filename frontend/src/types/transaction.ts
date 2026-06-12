export interface TransactionCategory {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  memo: string | null;
  transaction_date: string;
  category: TransactionCategory;
  created_at: string;
}

export interface TransactionCreateRequest {
  type: "income" | "expense";
  category_id: string;
  amount: number;
  memo: string | null;
  transaction_date: string;
}
