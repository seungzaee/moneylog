import type { MonthlySummary } from "../../types/dashboard";

interface SummaryCardsProps {
  summary: MonthlySummary | null;
}

function SummaryCards({ summary }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()}원`;
  };

  const cards = [
    {
      title: "총수입",
      value: summary ? formatCurrency(summary.total_income) : "-",
      caption: "이번 달 들어온 금액",
      tone: "text-indigo-500",
      badge: "IN",
    },
    {
      title: "총지출",
      value: summary ? formatCurrency(summary.total_expense) : "-",
      caption: "이번 달 사용한 금액",
      tone: "text-red-500",
      badge: "OUT",
    },
    {
      title: "잔액",
      value: summary ? formatCurrency(summary.balance) : "-",
      caption: "수입에서 지출을 뺀 금액",
      tone: "text-slate-950",
      badge: "NET",
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.title} className="app-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                {card.title}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                {card.caption}
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
              {card.badge}
            </span>
          </div>

          <p className={`text-3xl font-black tracking-tight ${card.tone}`}>
            {card.value}
          </p>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;
