import type { FormEvent } from "react";

import type { Category } from "../../types/category";
import type { Transaction } from "../../types/transaction";

interface TransactionEditModalProps {
  editingTransaction: Transaction | null;
  categories: Category[];
  editType: "income" | "expense";
  editCategoryId: string;
  editAmount: string;
  editMemo: string;
  editTransactionDate: string;
  isSubmitting: boolean;
  onChangeEditType: (value: "income" | "expense") => void;
  onChangeEditCategoryId: (value: string) => void;
  onChangeEditAmount: (value: string) => void;
  onChangeEditMemo: (value: string) => void;
  onChangeEditTransactionDate: (value: string) => void;
  onClose: () => void;
  onUpdateTransaction: (event: FormEvent<HTMLFormElement>) => void;
}

function TransactionEditModal({
  editingTransaction,
  categories,
  editType,
  editCategoryId,
  editAmount,
  editMemo,
  editTransactionDate,
  isSubmitting,
  onChangeEditType,
  onChangeEditCategoryId,
  onChangeEditAmount,
  onChangeEditMemo,
  onChangeEditTransactionDate,
  onClose,
  onUpdateTransaction,
}: TransactionEditModalProps) {
  if (!editingTransaction) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">거래내역 수정</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <form onSubmit={onUpdateTransaction} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Type
            </label>
            <select
              value={editType}
              onChange={(event) =>
                onChangeEditType(event.target.value as "income" | "expense")
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
              value={editCategoryId}
              onChange={(event) => onChangeEditCategoryId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Amount
            </label>
            <input
              type="number"
              value={editAmount}
              onChange={(event) => onChangeEditAmount(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Memo
            </label>
            <input
              type="text"
              value={editMemo}
              onChange={(event) => onChangeEditMemo(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date
            </label>
            <input
              type="date"
              value={editTransactionDate}
              onChange={(event) =>
                onChangeEditTransactionDate(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:bg-slate-400"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionEditModal;
