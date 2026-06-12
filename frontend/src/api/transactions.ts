import { apiRequest } from "./client";
import type {
  Transaction,
  TransactionCreateRequest,
} from "../types/transaction";

export function getTransactions(token: string) {
  return apiRequest<Transaction[]>("/transactions", {
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
