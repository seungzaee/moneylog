import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

interface AiAssistantPanelProps {
  selectedYear: number;
  selectedMonth: number;
}

interface AiMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const suggestionQuestions = [
  "소비 요약",
  "많이 쓴 카테고리",
  "절약 포인트",
  "자산 흐름",
];

function AiAssistantPanel({
  selectedYear,
  selectedMonth,
}: AiAssistantPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "안녕하세요. MoneyLog AI Assistant입니다. 소비 요약, 카테고리 분석, 절약 포인트를 도와드릴게요.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isOpen]);

  const createTemporaryAnswer = (question: string) => {
    if (question.includes("소비") || question.includes("요약")) {
      return `${selectedYear}년 ${selectedMonth}월 소비 요약을 분석할 준비가 되어 있어요. 다음 단계에서 실제 AI API를 연결하면 현재 대시보드 데이터를 기반으로 자세히 답변할 수 있습니다.`;
    }

    if (question.includes("카테고리")) {
      return "카테고리별 지출 데이터를 분석해서 가장 많이 사용한 항목을 알려드릴 수 있어요. 아직은 UI 단계라 임시 응답을 보여주고 있습니다.";
    }

    if (question.includes("절약")) {
      return "절약 포인트는 반복적으로 많이 쓰는 카테고리와 최근 지출 패턴을 기준으로 제안할 수 있어요. 다음 단계에서 실제 데이터를 연결해볼게요.";
    }

    if (question.includes("자산")) {
      return "누적 자산 흐름 그래프를 기반으로 시작 잔액, 현재 잔액, 변화폭을 설명할 수 있어요. 지금은 프론트 UI 테스트용 응답입니다.";
    }

    return "좋은 질문이에요. 다음 단계에서 OpenAI API를 연결하면 현재 MoneyLog 데이터를 기반으로 더 자연스럽게 답변할 수 있습니다.";
  };

  const addMessage = (question: string) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return;
    }

    setMessages((prev) => {
      const nextUserMessageId = prev.length + 1;
      const nextAssistantMessageId = prev.length + 2;

      const userMessage: AiMessage = {
        id: nextUserMessageId,
        role: "user",
        content: trimmedQuestion,
      };

      const assistantMessage: AiMessage = {
        id: nextAssistantMessageId,
        role: "assistant",
        content: createTemporaryAnswer(trimmedQuestion),
      };

      return [...prev, userMessage, assistantMessage];
    });

    setInputMessage("");
    setIsSuggestionsOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addMessage(inputMessage);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-2xl shadow-slate-500/40 ring-1 ring-white/20 transition hover:-translate-y-1 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:shadow-black/40 dark:hover:bg-slate-100"
      >
        AI
      </button>

      {isOpen && (
        <section className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[390px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-500/25 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/50">
          <div className="border-b border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
                  AI
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    MoneyLog AI
                  </p>

                  <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950 dark:text-white">
                    AI Assistant
                  </h2>

                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {selectedYear}년 {selectedMonth}월 데이터를 기준으로
                    답변해요.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500 transition hover:bg-slate-200 hover:text-slate-950 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-2 dark:border-white/10 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setIsSuggestionsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white dark:hover:bg-white/10"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                    Suggested Questions
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                    빠른 질문을 선택해보세요
                  </p>
                </div>

                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-black transition ${
                    isSuggestionsOpen
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "bg-white text-slate-500 shadow-sm dark:bg-white/10 dark:text-slate-300"
                  }`}
                >
                  {isSuggestionsOpen ? "−" : "+"}
                </span>
              </button>

              {isSuggestionsOpen && (
                <div className="mt-2 flex flex-wrap gap-1.5 px-1 pb-1">
                  {suggestionQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => addMessage(question)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-black text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-950 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-950"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/80 p-4 dark:bg-slate-950/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-[10px] font-black text-white dark:bg-white dark:text-slate-950">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm font-semibold leading-6 shadow-sm ${
                    message.role === "user"
                      ? "rounded-br-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "rounded-bl-lg border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-slate-400 focus-within:bg-white dark:border-white/10 dark:bg-white/5 dark:focus-within:border-white/20">
              <input
                type="text"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                placeholder="질문을 입력하세요"
              />

              <button
                type="submit"
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:bg-slate-400 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}

export default AiAssistantPanel;
