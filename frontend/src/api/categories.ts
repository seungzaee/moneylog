import { apiRequest } from "./client";
import type { Category, CategoryType } from "../types/category";

export function getCategories(token: string) {
  return apiRequest<Category[]>("/categories", {
    token,
  });
}

export function createCategory(
  token: string,
  name: string,
  type: CategoryType,
) {
  return apiRequest<Category>("/categories", {
    method: "POST",
    token,
    body: {
      name,
      type,
    },
  });
}

export function updateCategory(
  token: string,
  categoryId: string,
  name: string,
  type: CategoryType,
) {
  return apiRequest<Category>(`/categories/${categoryId}`, {
    method: "PATCH",
    token,
    body: {
      name,
      type,
    },
  });
}

export function deleteCategory(token: string, categoryId: string) {
  return apiRequest<void>(`/categories/${categoryId}`, {
    method: "DELETE",
    token,
  });
}
