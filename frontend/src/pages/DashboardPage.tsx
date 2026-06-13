/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { refreshToken } from "../api/auth";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/categories";
import {
  getAssetTrend,
  getCategorySummary,
  getMonthlySummary,
} from "../api/dashboard";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../api/transactions";
import AssetTrendChart from "../components/dashboard/AssetTrendChart";
import CategoryExpenseSummary from "../components/dashboard/CategoryExpenseSummary";
import CategoryManager from "../components/dashboard/CategoryManager";
import SummaryCards from "../components/dashboard/SummaryCards";
import TransactionEditModal from "../components/dashboard/TransactionEditModal";
import TransactionForm from "../components/dashboard/TransactionForm";
import TransactionList from "../components/dashboard/TransactionList";
import AppSidebar from "../components/layout/AppSidebar";
import AppTopbar from "../components/layout/AppTopbar";
import type { Category, CategoryType } from "../types/category";
import type {
  AssetTrendItem,
  AssetTrendPeriod,
  CategorySummary,
  MonthlySummary,
} from "../types/dashboard";
import type { Transaction } from "../types/transaction";
import { formatRemainingTime, getTokenRemainingSeconds } from "../utils/auth";

interface DashboardPageProps {
  onLogout: () => void;
}

type DashboardView = "overview" | "transactions" | "categories";
type ThemeMode = "light" | "dark";

const getTodayDateInput = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const getCurrentMonth = () => {
  return new Date().getMonth() + 1;
};

function DashboardPage({ onLogout }: DashboardPageProps) {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [assetTrend, setAssetTrend] = useState<AssetTrendItem[]>([]);
  const [assetTrendPeriod, setAssetTrendPeriod] =
    useState<AssetTrendPeriod>("daily");

  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return "light";
  });

  const [selectedCategoryType, setSelectedCategoryType] =
    useState<CategoryType>("expense");

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [transactionDate, setTransactionDate] = useState(getTodayDateInput());

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editType, setEditType] = useState<"income" | "expense">("expense");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [editTransactionDate, setEditTransactionDate] =
    useState(getTodayDateInput());

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isExtendingSession, setIsExtendingSession] = useState(false);

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    onLogout();
  };

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "light" ? "dark" : "light";

      localStorage.setItem("theme", nextTheme);

      return nextTheme;
    });
  };

  const isAuthError = (error: Error) => {
    return (
      error.message === "Invalid authentication credentials" ||
      error.message === "Not authenticated"
    );
  };

  const fetchDashboardData = async () => {
    const token = getToken();

    if (!token) {
      setErrorMessage("Login is required.");
      handleLogout();
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const [
        summaryData,
        categorySummaryData,
        assetTrendData,
        categoryData,
        transactionData,
      ] = await Promise.all([
        getMonthlySummary(token, selectedYear, selectedMonth),
        getCategorySummary(token, selectedYear, selectedMonth),
        getAssetTrend(token, selectedYear, selectedMonth, assetTrendPeriod),
        getCategories(token),
        getTransactions(token, selectedYear, selectedMonth),
      ]);

      setSummary(summaryData);
      setCategorySummary(categorySummaryData);
      setAssetTrend(assetTrendData);
      setCategories(categoryData);
      setTransactions(transactionData);

      const currentTypeCategories = categoryData.filter(
        (category) => category.type === type,
      );

      if (!categoryId && currentTypeCategories.length > 0) {
        setCategoryId(currentTypeCategories[0].id);
      }

      if (
        categoryId &&
        !currentTypeCategories.some((category) => category.id === categoryId)
      ) {
        setCategoryId(currentTypeCategories[0]?.id ?? "");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (isAuthError(error)) {
          handleLogout();
          return;
        }

        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to load dashboard data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, assetTrendPeriod]);

  useEffect(() => {
    const updateRemainingTime = () => {
      const token = getToken();

      if (!token) {
        setRemainingSeconds(0);
        handleLogout();
        return;
      }

      const seconds = getTokenRemainingSeconds(token);

      setRemainingSeconds(seconds);

      if (seconds <= 0) {
        handleLogout();
      }
    };

    updateRemainingTime();

    const timerId = window.setInterval(updateRemainingTime, 1000);

    return () => {
      window.clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExtendSession = async () => {
    const token = getToken();

    if (!token) {
      handleLogout();
      return;
    }

    setIsExtendingSession(true);
    setErrorMessage("");

    try {
      const data = await refreshToken(token);

      localStorage.setItem("access_token", data.access_token);

      const seconds = getTokenRemainingSeconds(data.access_token);
      setRemainingSeconds(seconds);
    } catch {
      handleLogout();
    } finally {
      setIsExtendingSession(false);
    }
  };

  const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      setErrorMessage("Login is required.");
      handleLogout();
      return;
    }

    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setErrorMessage("Category name is required.");
      return;
    }

    setIsCategorySubmitting(true);
    setErrorMessage("");

    try {
      const createdCategory = await createCategory(
        token,
        trimmedName,
        selectedCategoryType,
      );

      setNewCategoryName("");

      if (type === createdCategory.type) {
        setCategoryId(createdCategory.id);
      }

      await fetchDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        if (isAuthError(error)) {
          handleLogout();
          return;
        }

        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to create category");
      }
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleUpdateCategory = async (category: Category) => {
    const token = getToken();

    if (!token) {
      setErrorMessage("Login is required.");
      handleLogout();
      return;
    }

    const trimmedName = editingCategoryName.trim();

    if (!trimmedName) {
      setErrorMessage("Category name is required.");
      return;
    }

    setIsCategorySubmitting(true);
    setErrorMessage("");

    try {
      await updateCategory(token, category.id, trimmedName, category.type);

      setEditingCategoryId(null);
      setEditingCategoryName("");

      await fetchDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        if (isAuthError(error)) {
          handleLogout();
          return;
        }

        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to update category");
      }
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (targetCategoryId: string) => {
    const token = getToken();

    if (!token) {
      setErrorMessage("Login is required.");
      handleLogout();
      return;
    }

    const shouldDelete = window.confirm("Delete this category?");

    if (!shouldDelete) {
      return;
    }

    setIsCategorySubmitting(true);
    setErrorMessage("");

    try {
      await deleteCategory(token, targetCategoryId);

      if (categoryId === targetCategoryId) {
        setCategoryId("");
      }

      await fetchDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        if (isAuthError(error)) {
          handleLogout();
          return;
        }

        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to delete category");
      }
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleChangeTransactionType = (newType: "income" | "expense") => {
    setType(newType);

    const firstCategory = categories.find(
      (category) => category.type === newType,
    );

    setCategoryId(firstCategory?.id ?? "");
  };

  const handleChangeEditTransactionType = (newType: "income" | "expense") => {
    setEditType(newType);

    const firstCategory = categories.find(
      (category) => category.type === newType,
    );

    setEditCategoryId(firstCategory?.id ?? "");
  };

  const openEditTransactionModal = (transaction: Transaction) => {
    const matchedCategory =
      categories.find((category) => category.id === transaction.category.id) ??
      null;

    const fallbackCategory = categories.find(
      (category) => category.type === transaction.type,
    );

    setEditingTransaction(transaction);
    setEditType(transaction.type);
    setEditCategoryId(matchedCategory?.id ?? fallbackCategory?.id ?? "");
    setEditAmount(String(transaction.amount));
    setEditMemo(transaction.memo ?? "");
    setEditTransactionDate(transaction.transaction_date);
  };

  const closeEditTransactionModal = () => {
    setEditingTransaction(null);
    setEditType("expense");
    setEditCategoryId("");
    setEditAmount("");
    setEditMemo("");
    setEditTransactionDate(getTodayDateInput());
  };

  const handleCreateTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      setErrorMessage("Login is required.");
      handleLogout();
      return;
    }

    if (!categoryId) {
      setErrorMessage("Please select a category.");
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.id === categoryId,
    );

    if (!selectedCategory || selectedCategory.type !== type) {
      setErrorMessage("Please select a valid category.");
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
      setTransactionDate(getTodayDateInput());

      const firstExpenseCategory = categories.find(
        (category) => category.type === "expense",
      );

      setCategoryId(firstExpenseCategory?.id ?? "");

      await fetchDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        if (isAuthError(error)) {
          handleLogout();
          return;
        }

        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to create transaction");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();

    if (!token || !editingTransaction) {
      setErrorMessage("Login is required.");
      handleLogout();
      return;
    }

    if (!editCategoryId) {
      setErrorMessage("Please select a category.");
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.id === editCategoryId,
    );

    if (!selectedCategory || selectedCategory.type !== editType) {
      setErrorMessage("Please select a valid category.");
      return;
    }

    const parsedAmount = Number(editAmount);

    if (!editAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Amount must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await updateTransaction(token, editingTransaction.id, {
        type: editType,
        category_id: editCategoryId,
        amount: parsedAmount,
        memo: editMemo.trim() ? editMemo : null,
        transaction_date: editTransactionDate,
      });

      closeEditTransactionModal();

      await fetchDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        if (isAuthError(error)) {
          handleLogout();
          return;
        }

        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to update transaction");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    const token = getToken();

    if (!token) {
      setErrorMessage("Login is required.");
      handleLogout();
      return;
    }

    const shouldDelete = window.confirm("Delete this transaction?");

    if (!shouldDelete) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await deleteTransaction(token, transactionId);

      if (editingTransaction?.id === transactionId) {
        closeEditTransactionModal();
      }

      await fetchDashboardData();
    } catch (error) {
      if (error instanceof Error) {
        if (isAuthError(error)) {
          handleLogout();
          return;
        }

        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to delete transaction");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`${theme === "dark" ? "dark " : ""}app-shell`}>
      <AppTopbar
        theme={theme}
        remainingTimeText={formatRemainingTime(remainingSeconds)}
        isSessionExpiringSoon={remainingSeconds <= 300}
        isExtendingSession={isExtendingSession}
        onToggleTheme={handleToggleTheme}
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
      />

      <div className="flex">
        <AppSidebar
          activeView={activeView}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          onChangeView={setActiveView}
        />

        <div className="min-w-0 flex-1 px-5 py-8">
          <div className="mx-auto max-w-6xl">
            {isLoading && (
              <div className="app-card mb-6 p-6 text-slate-500 dark:text-slate-400">
                Loading dashboard...
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50/90 p-4 text-sm font-semibold text-red-600 shadow-sm dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            <section className="app-card mb-6 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                  {activeView === "overview" && "Dashboard"}
                  {activeView === "transactions" && "Transactions"}
                  {activeView === "categories" && "Categories"}
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  {activeView === "overview" &&
                    `${selectedYear}년 ${selectedMonth}월 요약`}
                  {activeView === "transactions" &&
                    `${selectedYear}년 ${selectedMonth}월 거래내역`}
                  {activeView === "categories" && "카테고리 관리"}
                </h2>

                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {activeView === "overview" &&
                    "선택한 월의 수입, 지출, 누적 자산 흐름을 확인하세요."}
                  {activeView === "transactions" &&
                    "거래내역을 등록하고 수정하거나 삭제할 수 있습니다."}
                  {activeView === "categories" &&
                    "수입과 지출 카테고리를 구분해서 관리하세요."}
                </p>
              </div>

              {activeView !== "categories" && (
                <div className="flex gap-2">
                  <select
                    value={selectedYear}
                    onChange={(event) =>
                      setSelectedYear(Number(event.target.value))
                    }
                    className="app-input w-32 py-2"
                  >
                    {[2024, 2025, 2026, 2027].map((yearOption) => (
                      <option key={yearOption} value={yearOption}>
                        {yearOption}년
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedMonth}
                    onChange={(event) =>
                      setSelectedMonth(Number(event.target.value))
                    }
                    className="app-input w-28 py-2"
                  >
                    {Array.from({ length: 12 }, (_, index) => index + 1).map(
                      (monthOption) => (
                        <option key={monthOption} value={monthOption}>
                          {monthOption}월
                        </option>
                      ),
                    )}
                  </select>
                </div>
              )}
            </section>

            {activeView === "overview" && (
              <>
                <SummaryCards summary={summary} />

                <AssetTrendChart
                  assetTrend={assetTrend}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  period={assetTrendPeriod}
                  onChangePeriod={setAssetTrendPeriod}
                />

                <CategoryExpenseSummary
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  categorySummary={categorySummary}
                />
              </>
            )}

            {activeView === "transactions" && (
              <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                <TransactionForm
                  categories={categories}
                  type={type}
                  categoryId={categoryId}
                  amount={amount}
                  memo={memo}
                  transactionDate={transactionDate}
                  isSubmitting={isSubmitting}
                  onChangeType={handleChangeTransactionType}
                  onChangeCategoryId={setCategoryId}
                  onChangeAmount={setAmount}
                  onChangeMemo={setMemo}
                  onChangeTransactionDate={setTransactionDate}
                  onCreateTransaction={handleCreateTransaction}
                />

                <TransactionList
                  transactions={transactions}
                  isSubmitting={isSubmitting}
                  onEditTransaction={openEditTransactionModal}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              </section>
            )}

            {activeView === "categories" && (
              <CategoryManager
                categories={categories}
                selectedCategoryType={selectedCategoryType}
                newCategoryName={newCategoryName}
                editingCategoryId={editingCategoryId}
                editingCategoryName={editingCategoryName}
                isCategorySubmitting={isCategorySubmitting}
                onChangeSelectedCategoryType={setSelectedCategoryType}
                onChangeNewCategoryName={setNewCategoryName}
                onChangeEditingCategoryName={setEditingCategoryName}
                onCreateCategory={handleCreateCategory}
                onStartEditCategory={startEditCategory}
                onCancelEditCategory={cancelEditCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            )}
          </div>
        </div>
      </div>

      <TransactionEditModal
        editingTransaction={editingTransaction}
        categories={categories}
        editType={editType}
        editCategoryId={editCategoryId}
        editAmount={editAmount}
        editMemo={editMemo}
        editTransactionDate={editTransactionDate}
        isSubmitting={isSubmitting}
        onChangeEditType={handleChangeEditTransactionType}
        onChangeEditCategoryId={setEditCategoryId}
        onChangeEditAmount={setEditAmount}
        onChangeEditMemo={setEditMemo}
        onChangeEditTransactionDate={setEditTransactionDate}
        onClose={closeEditTransactionModal}
        onUpdateTransaction={handleUpdateTransaction}
      />
    </main>
  );
}

export default DashboardPage;
