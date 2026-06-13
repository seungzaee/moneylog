import type { CategorySummary } from "../../types/dashboard";

interface CategoryExpenseSummaryProps {
  selectedYear: number;
  selectedMonth: number;
  categorySummary: CategorySummary[];
}

function CategoryExpenseSummary({
  selectedYear,
  selectedMonth,
  categorySummary,
}: CategoryExpenseSummaryProps) {
  const totalExpense = categorySummary.reduce(
    (sum, item) => sum + item.total_amount,
    0,
  );

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()}원`;
  };

  return (
    <section className="app-card mt-8 p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Spending Mix
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            카테고리별 지출
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {selectedYear}년 {selectedMonth}월 지출이 어떤 카테고리에
            집중되었는지 확인하세요.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-500">
          {categorySummary.length} categories
        </span>
      </div>

      {categorySummary.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 text-sm font-semibold text-slate-400">
          아직 카테고리별 지출 데이터가 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {categorySummary.map((item) => {
            const percentage =
              totalExpense === 0
                ? 0
                : Math.round((item.total_amount / totalExpense) * 100);

            return (
              <div
                key={item.category_id}
                className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-black text-slate-950">
                      {item.category_name}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      전체 지출의 {percentage}%
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-lg font-black text-red-500">
                    {formatCurrency(item.total_amount)}
                  </p>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-950 transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CategoryExpenseSummary;
