import { useEffect, useState } from "react";

import { getCategorySummary, getMonthlySummary } from "../api/dashboard";
import type { CategorySummary, MonthlySummary } from "../types/dashboard";

interface DashboardPageProps {
  onLogout: () => void;
}

function DashboardPage({ onLogout }: DashboardPageProps) {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const year = 2026;
  const month = 6;

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}원`;
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    onLogout();
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setErrorMessage("Login is required.");
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const [summaryData, categorySummaryData] = await Promise.all([
          getMonthlySummary(token, year, month),
          getCategorySummary(token, year, month),
        ]);

        setSummary(summaryData);
        setCategorySummary(categorySummaryData);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Failed to load dashboard data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">MoneyLog</h1>
            <p className="mt-1 text-sm text-slate-500">
              {year}년 {month}월 소비 요약
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Logout
          </button>
        </header>

        {isLoading && (
          <div className="rounded-xl bg-white p-6 text-slate-500 shadow">
            Loading dashboard...
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {summary && (
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
        )}

        <section className="mt-8 rounded-2xl bg-white p-6 shadow">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              카테고리별 지출
            </h2>
            <span className="text-sm text-slate-400">
              {year}.{String(month).padStart(2, "0")}
            </span>
          </div>

          {categorySummary.length === 0 ? (
            <p className="text-sm text-slate-500">
              아직 지출 데이터가 없습니다.
            </p>
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
      </div>
    </main>
  );
}

export default DashboardPage;
