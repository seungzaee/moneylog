import { apiRequest } from "./client";
import type {
  AssetTrendItem,
  AssetTrendPeriod,
  CategorySummary,
  MonthlySummary,
} from "../types/dashboard";

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

export function getAssetTrend(
  token: string,
  year: number,
  month: number,
  period: AssetTrendPeriod,
) {
  return apiRequest<AssetTrendItem[]>(
    `/dashboard/asset-trend?year=${year}&month=${month}&period=${period}`,
    {
      token,
    },
  );
}
