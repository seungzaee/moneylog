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
    <section className="app-card p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            History
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            거래내역
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            선택한 월의 거래내역 {transactions.length}건
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-500">
          {transactions.length} items
        </span>
      </div>

      {transactions.length === 0 ? (
        <p className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm font-semibold text-slate-400">
          아직 거래내역이 없습니다.
        </p>
      ) : (
        <div className="max-h-[560px] space-y-6 overflow-y-auto pr-2">
          {sortedDates.map((date) => (
            <div key={date}>
              <div className="sticky top-0 z-10 mb-3 bg-white/90 py-1 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  {date}
                </p>
              </div>

              <div className="space-y-3">
                {groupedTransactions[date].map((transaction) => (
                  <div
                    key={transaction.id}
                    className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              transaction.type === "income"
                                ? "bg-indigo-50 text-indigo-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "수입" : "지출"}
                          </span>

                          <p className="truncate text-base font-black text-slate-950">
                            {transaction.memo || "No memo"}
                          </p>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-slate-500">
                          {transaction.category.name}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`whitespace-nowrap text-lg font-black ${
                            transaction.type === "income"
                              ? "text-indigo-500"
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
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteTransaction(transaction.id)}
                            disabled={isSubmitting}
                            className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:bg-slate-100 disabled:text-slate-400"
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
    </section>
  );
}

export default TransactionList;
