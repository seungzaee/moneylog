import { apiRequest } from "./client";
import type { Category } from "../types/category";

export function getCategories(token: string) {
  return apiRequest<Category[]>("/categories", {
    token,
  });
}
