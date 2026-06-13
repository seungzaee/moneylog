import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Transaction } from "../../types/transaction";

interface AssetTrendChartProps {
  transactions: Transaction[];
  selectedYear: number;
  selectedMonth: number;
}

interface TrendData {
  date: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
}

function AssetTrendChart({
  transactions,
  selectedYear,
  selectedMonth,
}: AssetTrendChartProps) {
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()}원`;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const createMonthlyTrendData = (): TrendData[] => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const dailyMap: Record<string, TrendData> = {};

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${selectedYear}-${String(selectedMonth).padStart(
        2,
        "0",
      )}-${String(day).padStart(2, "0")}`;

      dailyMap[date] = {
        date,
        label: `${day}일`,
        income: 0,
        expense: 0,
        balance: 0,
      };
    }

    transactions.forEach((transaction) => {
      const date = transaction.transaction_date;

      if (!dailyMap[date]) {
        return;
      }

      if (transaction.type === "income") {
        dailyMap[date].income += transaction.amount;
      } else {
        dailyMap[date].expense += transaction.amount;
      }
    });

    let runningBalance = 0;

    return Object.values(dailyMap).map((dayData) => {
      runningBalance += dayData.income - dayData.expense;

      return {
        ...dayData,
        balance: runningBalance,
      };
    });
  };

  const trendData = createMonthlyTrendData();
  const hasTransaction = transactions.length > 0;

  return (
    <section className="app-card mt-8 p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Asset Flow
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            자산 흐름
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            선택한 월의 수입과 지출을 기준으로 누적 잔액 변화를 보여줍니다.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-500">
          {selectedYear}.{String(selectedMonth).padStart(2, "0")}
        </span>
      </div>

      {!hasTransaction ? (
        <div className="flex h-72 items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 text-sm font-semibold text-slate-400">
          아직 그래프로 표시할 거래내역이 없습니다.
        </div>
      ) : (
        <div className="h-80 rounded-[1.5rem] bg-white/60 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{
                top: 10,
                right: 24,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 12,
                  fill: "#64748b",
                }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(value) => `${Number(value).toLocaleString()}`}
                tick={{
                  fontSize: 12,
                  fill: "#64748b",
                }}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
                formatter={(value, name) => {
                  const labelMap: Record<string, string> = {
                    balance: "누적 잔액",
                    income: "수입",
                    expense: "지출",
                  };

                  return [
                    formatCurrency(Number(value)),
                    labelMap[String(name)] ?? String(name),
                  ];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="balance"
                stroke="#2563eb"
                strokeWidth={4}
                dot={false}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default AssetTrendChart;
