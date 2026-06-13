import { apiRequest } from "./client";
import type { LoginResponse } from "../types/auth";

export function refreshToken(token: string) {
  return apiRequest<LoginResponse>("/auth/refresh", {
    method: "POST",
    token,
  });
}
