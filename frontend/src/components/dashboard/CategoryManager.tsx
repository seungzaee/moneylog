import type { FormEvent } from "react";

import type { Category } from "../../types/category";

interface CategoryManagerProps {
  categories: Category[];
  newCategoryName: string;
  editingCategoryId: string | null;
  editingCategoryName: string;
  isCategorySubmitting: boolean;
  onChangeNewCategoryName: (value: string) => void;
  onChangeEditingCategoryName: (value: string) => void;
  onCreateCategory: (event: FormEvent<HTMLFormElement>) => void;
  onStartEditCategory: (category: Category) => void;
  onCancelEditCategory: () => void;
  onUpdateCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
}

function CategoryManager({
  categories,
  newCategoryName,
  editingCategoryId,
  editingCategoryName,
  isCategorySubmitting,
  onChangeNewCategoryName,
  onChangeEditingCategoryName,
  onCreateCategory,
  onStartEditCategory,
  onCancelEditCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  return (
    <section className="mt-8 rounded-2xl bg-white p-6 shadow">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">카테고리 관리</h2>
        <p className="mt-1 text-sm text-slate-500">
          수입과 지출을 분류할 카테고리를 관리하세요.
        </p>
      </div>

      <form onSubmit={onCreateCategory} className="flex gap-3">
        <input
          type="text"
          value={newCategoryName}
          onChange={(event) => onChangeNewCategoryName(event.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="예: Food, Transport, Shopping"
        />

        <button
          type="submit"
          disabled={isCategorySubmitting}
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Add
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">아직 카테고리가 없습니다.</p>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-slate-100 p-4"
            >
              {editingCategoryId === category.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCategoryName}
                    onChange={(event) =>
                      onChangeEditingCategoryName(event.target.value)
                    }
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />

                  <button
                    type="button"
                    onClick={() => onUpdateCategory(category.id)}
                    disabled={isCategorySubmitting}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:bg-slate-400"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={onCancelEditCategory}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {category.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {category.created_at.slice(0, 10)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onStartEditCategory(category)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteCategory(category.id)}
                      disabled={isCategorySubmitting}
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoryManager;
