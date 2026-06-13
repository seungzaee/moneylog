import type { FormEvent } from "react";

import type { Category } from "../../types/category";

interface TransactionFormProps {
  categories: Category[];
  type: "income" | "expense";
  categoryId: string;
  amount: string;
  memo: string;
  transactionDate: string;
  isSubmitting: boolean;
  onChangeType: (value: "income" | "expense") => void;
  onChangeCategoryId: (value: string) => void;
  onChangeAmount: (value: string) => void;
  onChangeMemo: (value: string) => void;
  onChangeTransactionDate: (value: string) => void;
  onCreateTransaction: (event: FormEvent<HTMLFormElement>) => void;
}

function TransactionForm({
  categories,
  type,
  categoryId,
  amount,
  memo,
  transactionDate,
  isSubmitting,
  onChangeType,
  onChangeCategoryId,
  onChangeAmount,
  onChangeMemo,
  onChangeTransactionDate,
  onCreateTransaction,
}: TransactionFormProps) {
  const filteredCategories = categories.filter(
    (category) => category.type === type,
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-slate-900">거래내역 등록</h2>

      <form onSubmit={onCreateTransaction} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Type
          </label>
          <select
            value={type}
            onChange={(event) =>
              onChangeType(event.target.value as "income" | "expense")
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(event) => onChangeCategoryId(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            {filteredCategories.length === 0 ? (
              <option value="">No {type} categories</option>
            ) : (
              filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(event) => onChangeAmount(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            placeholder="12000"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Memo
          </label>
          <input
            type="text"
            value={memo}
            onChange={(event) => onChangeMemo(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            placeholder="Lunch"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            type="date"
            value={transactionDate}
            onChange={(event) => onChangeTransactionDate(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || filteredCategories.length === 0}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Saving..." : "Add transaction"}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
