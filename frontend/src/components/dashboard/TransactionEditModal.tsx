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

  const filteredCategories = categories.filter(
    (category) => category.type === editType,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-2xl shadow-slate-950/20">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
              Edit Record
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              거래내역 수정
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              거래 타입과 금액, 날짜를 수정할 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <form onSubmit={onUpdateTransaction} className="space-y-5">
          <div>
            <label className="app-label">Type</label>
            <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => onChangeEditType("expense")}
                className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                  editType === "expense"
                    ? "bg-slate-950 text-white shadow"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                지출
              </button>

              <button
                type="button"
                onClick={() => onChangeEditType("income")}
                className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                  editType === "income"
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
              value={editCategoryId}
              onChange={(event) => onChangeEditCategoryId(event.target.value)}
              className="app-input w-full"
            >
              {filteredCategories.length === 0 ? (
                <option value="">No {editType} categories</option>
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
              value={editAmount}
              onChange={(event) => onChangeEditAmount(event.target.value)}
              className="app-input w-full"
            />
          </div>

          <div>
            <label className="app-label">Memo</label>
            <input
              type="text"
              value={editMemo}
              onChange={(event) => onChangeEditMemo(event.target.value)}
              className="app-input w-full"
            />
          </div>

          <div>
            <label className="app-label">Date</label>
            <input
              type="date"
              value={editTransactionDate}
              onChange={(event) =>
                onChangeEditTransactionDate(event.target.value)
              }
              className="app-input w-full"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="app-button-secondary flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || filteredCategories.length === 0}
              className="app-button-primary flex-1"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionEditModal;
