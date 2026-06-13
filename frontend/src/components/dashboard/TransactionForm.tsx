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
    <section className="app-card p-6">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
          New Record
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          거래내역 등록
        </h2>
        <p className="mt-2 text-sm font-medium text-slate-500">
          수입과 지출을 선택하고 거래내역을 추가하세요.
        </p>
      </div>

      <form onSubmit={onCreateTransaction} className="space-y-5">
        <div>
          <label className="app-label">Type</label>
          <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => onChangeType("expense")}
              className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                type === "expense"
                  ? "bg-slate-950 text-white shadow"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              지출
            </button>

            <button
              type="button"
              onClick={() => onChangeType("income")}
              className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                type === "income"
                  ? "bg-slate-950 text-white shadow"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              수입
            </button>
          </div>
        </div>

        <div>
          <label className="app-label">Category</label>
          <select
            value={categoryId}
            onChange={(event) => onChangeCategoryId(event.target.value)}
            className="app-input w-full"
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
          <label className="app-label">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(event) => onChangeAmount(event.target.value)}
            className="app-input w-full"
            placeholder="12000"
          />
        </div>

        <div>
          <label className="app-label">Memo</label>
          <input
            type="text"
            value={memo}
            onChange={(event) => onChangeMemo(event.target.value)}
            className="app-input w-full"
            placeholder="Lunch"
          />
        </div>

        <div>
          <label className="app-label">Date</label>
          <input
            type="date"
            value={transactionDate}
            onChange={(event) => onChangeTransactionDate(event.target.value)}
            className="app-input w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || filteredCategories.length === 0}
          className="app-button-primary w-full"
        >
          {isSubmitting ? "Saving..." : "Add transaction"}
        </button>
      </form>
    </section>
  );
}

export default TransactionForm;
