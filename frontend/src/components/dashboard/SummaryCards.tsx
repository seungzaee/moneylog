import type { MonthlySummary } from "../../types/dashboard";

interface SummaryCardsProps {
  summary: MonthlySummary | null;
}

function SummaryCards({ summary }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()}원`;
  };

  if (!summary) {
    return null;
  }

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-sm font-medium text-slate-500">총수입</p>
        <p className="mt-3 text-2xl font-bold text-blue-600">
          {formatCurrency(summary.total_income)}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-sm font-medium text-slate-500">총지출</p>
        <p className="mt-3 text-2xl font-bold text-red-500">
          {formatCurrency(summary.total_expense)}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-sm font-medium text-slate-500">잔액</p>
        <p className="mt-3 text-2xl font-bold text-slate-900">
          {formatCurrency(summary.balance)}
        </p>
      </div>
    </section>
  );
}

export default SummaryCards;
