import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AssetTrendItem, AssetTrendPeriod } from "../../types/dashboard";

interface AssetTrendChartProps {
  assetTrend: AssetTrendItem[];
  selectedYear: number;
  selectedMonth: number;
  period: AssetTrendPeriod;
  onChangePeriod: (period: AssetTrendPeriod) => void;
}

function AssetTrendChart({
  assetTrend,
  selectedYear,
  selectedMonth,
  period,
  onChangePeriod,
}: AssetTrendChartProps) {
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()}원`;
  };

  const hasTrendData = assetTrend.length > 0;

  const firstBalance = hasTrendData ? assetTrend[0].balance : 0;
  const lastBalance = hasTrendData
    ? assetTrend[assetTrend.length - 1].balance
    : 0;
  const balanceChange = lastBalance - firstBalance;

  return (
    <section className="app-card mt-8 p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Asset Flow
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            누적 자산 흐름
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            선택한 월 이전의 잔액까지 반영한 누적 자산 변화를 보여줍니다.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-white/10">
            <button
              type="button"
              onClick={() => onChangePeriod("daily")}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                period === "daily"
                  ? "bg-slate-950 text-white shadow dark:bg-white dark:text-slate-950"
                  : "text-slate-500 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              Daily
            </button>

            <button
              type="button"
              onClick={() => onChangePeriod("weekly")}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                period === "weekly"
                  ? "bg-slate-950 text-white shadow dark:bg-white dark:text-slate-950"
                  : "text-slate-500 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              Weekly
            </button>
          </div>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-500 dark:bg-white/10 dark:text-slate-300">
            {selectedYear}.{String(selectedMonth).padStart(2, "0")}
          </span>
        </div>
      </div>

      {hasTrendData && (
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Start
            </p>
            <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">
              {formatCurrency(firstBalance)}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Current
            </p>
            <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">
              {formatCurrency(lastBalance)}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Change
            </p>
            <p
              className={`mt-2 text-lg font-black ${
                balanceChange >= 0
                  ? "text-indigo-500 dark:text-indigo-300"
                  : "text-red-500 dark:text-red-300"
              }`}
            >
              {balanceChange >= 0 ? "+" : ""}
              {formatCurrency(balanceChange)}
            </p>
          </div>
        </div>
      )}

      {!hasTrendData ? (
        <div className="flex h-72 items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 text-sm font-semibold text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500">
          아직 그래프로 표시할 자산 흐름 데이터가 없습니다.
        </div>
      ) : (
        <div className="h-80 rounded-[1.5rem] bg-white/60 p-4 dark:bg-slate-950/30">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={assetTrend}
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
                    balance: "누적 자산",
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
