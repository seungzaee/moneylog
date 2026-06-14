import { apiRequest } from "./client";

interface AiChatRequest {
  message: string;
  year: number;
  month: number;
}

interface AiChatResponse {
  answer: string;
}

export function chatWithAi(token: string, body: AiChatRequest) {
  return apiRequest<AiChatResponse>("/ai/chat", {
    method: "POST",
    token,
    body,
  });
}
