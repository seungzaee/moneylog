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
import { getCategorySummary, getMonthlySummary } from "../api/dashboard";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../api/transactions";
import CategoryExpenseSummary from "../components/dashboard/CategoryExpenseSummary";
import CategoryManager from "../components/dashboard/CategoryManager";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummaryCards from "../components/dashboard/SummaryCards";
import TransactionEditModal from "../components/dashboard/TransactionEditModal";
import TransactionForm from "../components/dashboard/TransactionForm";
import TransactionList from "../components/dashboard/TransactionList";
import type { Category, CategoryType } from "../types/category";
import type { CategorySummary, MonthlySummary } from "../types/dashboard";
import type { Transaction } from "../types/transaction";
import { formatRemainingTime, getTokenRemainingSeconds } from "../utils/auth";

interface DashboardPageProps {
  onLogout: () => void;
}

function DashboardPage({ onLogout }: DashboardPageProps) {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(6);

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
  const [transactionDate, setTransactionDate] = useState("2026-06-12");

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editType, setEditType] = useState<"income" | "expense">("expense");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [editTransactionDate, setEditTransactionDate] = useState("2026-06-12");

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
      const [summaryData, categorySummaryData, categoryData, transactionData] =
        await Promise.all([
          getMonthlySummary(token, selectedYear, selectedMonth),
          getCategorySummary(token, selectedYear, selectedMonth),
          getCategories(token),
          getTransactions(token, selectedYear, selectedMonth),
        ]);

      setSummary(summaryData);
      setCategorySummary(categorySummaryData);
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
  }, [selectedYear, selectedMonth]);

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
    setEditTransactionDate("2026-06-12");
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
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          remainingTimeText={formatRemainingTime(remainingSeconds)}
          isSessionExpiringSoon={remainingSeconds <= 300}
          isExtendingSession={isExtendingSession}
          onChangeYear={setSelectedYear}
          onChangeMonth={setSelectedMonth}
          onExtendSession={handleExtendSession}
          onLogout={handleLogout}
        />

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

        <SummaryCards summary={summary} />

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

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
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

        <CategoryExpenseSummary
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          categorySummary={categorySummary}
        />
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
