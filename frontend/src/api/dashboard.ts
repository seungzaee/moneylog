import { apiRequest } from "./client";
import type { CategorySummary, MonthlySummary } from "../types/dashboard";

export function getMonthlySummary(token: string, year: number, month: number) {
  return apiRequest<MonthlySummary>(
    `/dashboard/summary?year=${year}&month=${month}`,
    {
      token,
    },
  );
}

export function getCategorySummary(token: string, year: number, month: number) {
  return apiRequest<CategorySummary[]>(
    `/dashboard/category-summary?year=${year}&month=${month}`,
    {
      token,
    },
  );
}
