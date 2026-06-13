import { useState } from "react";
import type { FormEvent } from "react";

import type { Category, CategoryType } from "../../types/category";

interface CategoryManagerProps {
  categories: Category[];
  selectedCategoryType: CategoryType;
  newCategoryName: string;
  editingCategoryId: string | null;
  editingCategoryName: string;
  isCategorySubmitting: boolean;
  onChangeSelectedCategoryType: (value: CategoryType) => void;
  onChangeNewCategoryName: (value: string) => void;
  onChangeEditingCategoryName: (value: string) => void;
  onCreateCategory: (event: FormEvent<HTMLFormElement>) => void;
  onStartEditCategory: (category: Category) => void;
  onCancelEditCategory: () => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

function CategoryManager({
  categories,
  selectedCategoryType,
  newCategoryName,
  editingCategoryId,
  editingCategoryName,
  isCategorySubmitting,
  onChangeSelectedCategoryType,
  onChangeNewCategoryName,
  onChangeEditingCategoryName,
  onCreateCategory,
  onStartEditCategory,
  onCancelEditCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const filteredCategories = categories.filter(
    (category) => category.type === selectedCategoryType,
  );

  const selectedCategory =
    filteredCategories.find((category) => category.id === selectedCategoryId) ??
    null;

  const expenseCount = categories.filter(
    (category) => category.type === "expense",
  ).length;

  const incomeCount = categories.filter(
    (category) => category.type === "income",
  ).length;

  const handleChangeTab = (categoryType: CategoryType) => {
    onChangeSelectedCategoryType(categoryType);
    setSelectedCategoryId(null);
    onCancelEditCategory();
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategoryId(category.id);
    onCancelEditCategory();
  };

  const handleStartEdit = (category: Category) => {
    setSelectedCategoryId(category.id);
    onStartEditCategory(category);
  };

  const handleDelete = (categoryId: string) => {
    onDeleteCategory(categoryId);

    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    }
  };

  return (
    <section className="mt-8 rounded-2xl bg-white p-6 shadow">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">카테고리 관리</h2>
        <p className="mt-1 text-sm text-slate-500">
          수입과 지출 카테고리를 구분해서 관리하세요.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => handleChangeTab("expense")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            selectedCategoryType === "expense"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          지출 {expenseCount}
        </button>

        <button
          type="button"
          onClick={() => handleChangeTab("income")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            selectedCategoryType === "income"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          수입 {incomeCount}
        </button>
      </div>

      <form onSubmit={onCreateCategory} className="flex gap-3">
        <input
          type="text"
          value={newCategoryName}
          onChange={(event) => onChangeNewCategoryName(event.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder={
            selectedCategoryType === "expense"
              ? "예: 식비, 교통비, 쇼핑"
              : "예: 월급, 용돈, 부수입"
          }
        />

        <button
          type="submit"
          disabled={isCategorySubmitting}
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Add
        </button>
      </form>

      <div className="mt-5">
        {filteredCategories.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
            {selectedCategoryType === "expense"
              ? "아직 지출 카테고리가 없습니다."
              : "아직 수입 카테고리가 없습니다."}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filteredCategories.map((category) => {
              const isSelected = selectedCategoryId === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedCategory && (
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                선택된 카테고리
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {selectedCategory.name}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {selectedCategory.type === "expense" ? "지출" : "수입"} ·{" "}
                {selectedCategory.created_at.slice(0, 10)}
              </p>
            </div>

            {editingCategoryId !== selectedCategory.id && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleStartEdit(selectedCategory)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedCategory.id)}
                  disabled={isCategorySubmitting}
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {editingCategoryId === selectedCategory.id && (
            <div className="flex gap-2">
              <input
                type="text"
                value={editingCategoryName}
                onChange={(event) =>
                  onChangeEditingCategoryName(event.target.value)
                }
                className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />

              <button
                type="button"
                onClick={() => onUpdateCategory(selectedCategory)}
                disabled={isCategorySubmitting}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:bg-slate-400"
              >
                Save
              </button>

              <button
                type="button"
                onClick={onCancelEditCategory}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default CategoryManager;
