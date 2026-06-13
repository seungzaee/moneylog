import { apiRequest } from "./client";
import type {
  Transaction,
  TransactionCreateRequest,
} from "../types/transaction";

export function getTransactions(token: string, year?: number, month?: number) {
  const query = year && month ? `?year=${year}&month=${month}` : "";

  return apiRequest<Transaction[]>(`/transactions${query}`, {
    token,
  });
}

export function createTransaction(
  token: string,
  body: TransactionCreateRequest,
) {
  return apiRequest<Transaction>("/transactions", {
    method: "POST",
    token,
    body,
  });
}

export function updateTransaction(
  token: string,
  transactionId: string,
  body: TransactionCreateRequest,
) {
  return apiRequest<Transaction>(`/transactions/${transactionId}`, {
    method: "PATCH",
    token,
    body,
  });
}

export function deleteTransaction(token: string, transactionId: string) {
  return apiRequest<void>(`/transactions/${transactionId}`, {
    method: "DELETE",
    token,
  });
}
