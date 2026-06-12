/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { getCategories } from "../api/categories";
import { getCategorySummary, getMonthlySummary } from "../api/dashboard";
import { createTransaction, getTransactions } from "../api/transactions";
import type { Category } from "../types/category";
import type { CategorySummary, MonthlySummary } from "../types/dashboard";
import type { Transaction } from "../types/transaction";

interface DashboardPageProps {
  onLogout: () => void;
}

function DashboardPage({ onLogout }: DashboardPageProps) {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [transactionDate, setTransactionDate] = useState("2026-06-12");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const year = 2026;
  const month = 6;

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()}원`;
  };

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    onLogout();
  };

  const fetchDashboardData = async () => {
    const token = getToken();

    if (!token) {
      setErrorMessage("Login is required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const [summaryData, categorySummaryData, categoryData, transactionData] =
        await Promise.all([
          getMonthlySummary(token, year, month),
          getCategorySummary(token, year, month),
          getCategories(token),
          getTransactions(token),
        ]);

      setSummary(summaryData);
      setCategorySummary(categorySummaryData);
      setCategories(categoryData);
      setTransactions(transactionData);

      if (!categoryId && categoryData.length > 0) {
        setCategoryId(categoryData[0].id);
      }
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

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      setErrorMessage("Login is required.");
      return;
    }

    if (!categoryId) {
      setErrorMessage("Please select a category.");
      return;
    }

    const parsedAmount = Number(amount);

    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Amount must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createTransaction(token, {
        type,
        category_id: categoryId,
        amount: parsedAmount,
        memo: memo.trim() ? memo : null,
        transaction_date: transactionDate,
      });

      setAmount("");
      setMemo("");
      setType("expense");

      await fetchDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to create transaction");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
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
          <div className="mb-6 rounded-xl bg-white p-6 text-slate-500 shadow">
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

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-slate-900">거래내역 등록</h2>

            <form onSubmit={handleCreateTransaction} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value as "income" | "expense")
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  {categories.length === 0 ? (
                    <option value="">No categories</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="12000"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Memo
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(event) => setMemo(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="Lunch"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(event) => setTransactionDate(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || categories.length === 0}
                className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Saving..." : "Add transaction"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-slate-900">거래내역</h2>

            {transactions.length === 0 ? (
              <p className="mt-5 text-sm text-slate-500">
                아직 거래내역이 없습니다.
              </p>
            ) : (
              <div className="mt-5 space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {transaction.memo || "No memo"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {transaction.category.name} ·{" "}
                        {transaction.transaction_date}
                      </p>
                    </div>

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
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

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
