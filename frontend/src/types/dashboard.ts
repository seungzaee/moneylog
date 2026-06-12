export interface MonthlySummary {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface CategorySummary {
  category_id: string;
  category_name: string;
  total_amount: number;
}
