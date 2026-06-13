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
    <section className="app-card p-6">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
          Category
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          카테고리 관리
        </h2>
        <p className="mt-2 text-sm font-medium text-slate-500">
          수입과 지출 카테고리를 구분해서 관리하세요.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => handleChangeTab("expense")}
          className={`rounded-xl px-4 py-3 text-sm font-black transition ${
            selectedCategoryType === "expense"
              ? "bg-slate-950 text-white shadow"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          지출 {expenseCount}
        </button>

        <button
          type="button"
          onClick={() => handleChangeTab("income")}
          className={`rounded-xl px-4 py-3 text-sm font-black transition ${
            selectedCategoryType === "income"
              ? "bg-slate-950 text-white shadow"
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
          className="app-input min-w-0 flex-1"
          placeholder={
            selectedCategoryType === "expense"
              ? "예: 식비, 교통비, 쇼핑"
              : "예: 월급, 용돈, 부수입"
          }
        />

        <button
          type="submit"
          disabled={isCategorySubmitting}
          className="app-button-primary"
        >
          Add
        </button>
      </form>

      <div className="mt-6">
        {filteredCategories.length === 0 ? (
          <p className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm font-semibold text-slate-400">
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
                  className={`rounded-full border px-5 py-2.5 text-sm font-black transition ${
                    isSelected
                      ? "border-slate-950 bg-slate-950 text-white shadow"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 hover:shadow"
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
        <div className="mt-6 rounded-[1.75rem] border border-slate-200/70 bg-slate-50/80 p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Selected
              </p>
              <p className="mt-2 text-xl font-black tracking-tight text-slate-950">
                {selectedCategory.name}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {selectedCategory.type === "expense" ? "지출" : "수입"} ·{" "}
                {selectedCategory.created_at.slice(0, 10)}
              </p>
            </div>

            {editingCategoryId !== selectedCategory.id && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleStartEdit(selectedCategory)}
                  className="app-button-secondary px-4 py-2"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedCategory.id)}
                  disabled={isCategorySubmitting}
                  className="app-button-danger px-4 py-2"
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
                className="app-input min-w-0 flex-1"
              />

              <button
                type="button"
                onClick={() => onUpdateCategory(selectedCategory)}
                disabled={isCategorySubmitting}
                className="app-button-primary"
              >
                Save
              </button>

              <button
                type="button"
                onClick={onCancelEditCategory}
                className="app-button-secondary"
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
