import type { Transaction } from "../../types/transaction";

interface TransactionListProps {
  transactions: Transaction[];
  isSubmitting: boolean;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

function TransactionList({
  transactions,
  isSubmitting,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionListProps) {
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()}원`;
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-slate-900">거래내역</h2>

      {transactions.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">아직 거래내역이 없습니다.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {transaction.memo || "No memo"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {transaction.category.name} · {transaction.transaction_date}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <p
                  className={`font-bold ${
                    transaction.type === "income"
                      ? "text-blue-600"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEditTransaction(transaction)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    disabled={isSubmitting}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionList;
