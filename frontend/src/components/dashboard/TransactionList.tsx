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

  const groupedTransactions = transactions.reduce<
    Record<string, Transaction[]>
  >((groups, transaction) => {
    const date = transaction.transaction_date;

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(transaction);

    return groups;
  }, {});

  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">거래내역</h2>
          <p className="mt-1 text-sm text-slate-500">
            선택한 월의 거래내역 {transactions.length}건
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
          아직 거래내역이 없습니다.
        </p>
      ) : (
        <div className="max-h-[520px] space-y-5 overflow-y-auto pr-2">
          {sortedDates.map((date) => (
            <div key={date}>
              <div className="sticky top-0 z-10 mb-2 bg-white py-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {date}
                </p>
              </div>

              <div className="space-y-2">
                {groupedTransactions[date].map((transaction) => (
                  <div
                    key={transaction.id}
                    className="rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              transaction.type === "income"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "수입" : "지출"}
                          </span>

                          <p className="truncate font-semibold text-slate-900">
                            {transaction.memo || "No memo"}
                          </p>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          {transaction.category.name}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`whitespace-nowrap font-bold ${
                            transaction.type === "income"
                              ? "text-blue-600"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>

                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEditTransaction(transaction)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteTransaction(transaction.id)}
                            disabled={isSubmitting}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:bg-slate-100 disabled:text-slate-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionList;
