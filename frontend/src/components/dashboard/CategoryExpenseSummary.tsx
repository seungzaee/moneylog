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
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()}원`;
  };

  return (
    <section className="mt-8 rounded-2xl bg-white p-6 shadow">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">카테고리별 지출</h2>
        <span className="text-sm text-slate-400">
          {selectedYear}.{String(selectedMonth).padStart(2, "0")}
        </span>
      </div>

      {categorySummary.length === 0 ? (
        <p className="text-sm text-slate-500">아직 지출 데이터가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {categorySummary.map((category) => (
            <div
              key={category.category_id}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {category.category_name}
                </p>
                <p className="text-sm text-slate-500">Expense category</p>
              </div>

              <p className="font-bold text-red-500">
                {formatCurrency(category.total_amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoryExpenseSummary;
