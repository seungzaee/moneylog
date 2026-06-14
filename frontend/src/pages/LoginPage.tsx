import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { apiRequest } from "../api/client";
import type { LoginResponse } from "../types/auth";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onGoToSignup: () => void;
}

const introCards = [
  {
    step: "01",
    title: "수입과 지출을 빠르게 기록",
    description:
      "날짜, 금액, 카테고리만 입력하면 매일의 거래내역을 간단하게 정리할 수 있어요.",
  },
  {
    step: "02",
    title: "카테고리별 소비 흐름 확인",
    description:
      "식비, 교통비, 쇼핑처럼 자주 쓰는 항목을 나누어 소비 패턴을 한눈에 확인하세요.",
  },
  {
    step: "03",
    title: "누적 자산 변화를 그래프로",
    description:
      "이전 달 잔액까지 반영한 누적 자산 흐름을 Daily / Weekly 기준으로 확인할 수 있어요.",
  },
];

function LoginPage({ onLoginSuccess, onGoToSignup }: LoginPageProps) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % introCards.length);
    }, 2800);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const activeCard = introCards[activeCardIndex];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const data = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      localStorage.setItem("access_token", data.access_token);

      onLoginSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.65),_transparent_28rem),radial-gradient(circle_at_top_right,_rgba(199,210,254,0.65),_transparent_30rem),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_50%,_#f8fafc_100%)] px-4 py-10">
      <section className="grid min-h-[680px] w-full max-w-5xl overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/75 shadow-2xl shadow-slate-300/50 backdrop-blur-xl lg:grid-cols-[1fr_1.05fr]">
        <div className="hidden border-r border-indigo-100/70 bg-gradient-to-br from-indigo-100/80 via-slate-50/95 to-sky-100/70 p-10 lg:flex lg:flex-col">
          <div className="min-h-[150px]">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
              Personal Finance
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
              MoneyLog
            </h1>

            <p className="mt-4 max-w-sm text-sm font-semibold leading-6 text-slate-600">
              수입과 지출, 카테고리, 누적 자산 흐름을 한눈에 관리하는 개인
              가계부 대시보드입니다.
            </p>
          </div>

          <div className="flex flex-1 items-center py-12">
            <div className="w-full rounded-[2rem] border border-white/90 bg-white/80 p-6 shadow-xl shadow-indigo-200/40 backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                  {activeCard.step}
                </span>

                <div className="flex gap-1.5">
                  {introCards.map((card, index) => (
                    <button
                      key={card.step}
                      type="button"
                      onClick={() => setActiveCardIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        activeCardIndex === index
                          ? "w-6 bg-slate-950"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`${index + 1}번째 소개 보기`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xl font-black tracking-tight text-slate-950">
                {activeCard.title}
              </p>

              <p className="mt-3 min-h-[48px] text-sm font-semibold leading-6 text-slate-600">
                {activeCard.description}
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-slate-950 transition-all duration-500"
                  style={{
                    width: `${((activeCardIndex + 1) / introCards.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/90 bg-white/70 p-5 shadow-lg shadow-indigo-200/30 backdrop-blur">
            <p className="text-sm font-black text-slate-950">
              Clear finance, calm decisions.
            </p>

            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
              매일의 기록이 모여 더 명확한 소비 습관을 만듭니다.
            </p>
          </div>
        </div>

        <div className="bg-white/90 p-8 backdrop-blur sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
              Welcome back
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              로그인
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              MoneyLog에 로그인하고 나의 자산 흐름을 확인하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="app-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="app-input w-full"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="app-label">
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="app-input w-full pr-20"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-black text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm font-semibold text-red-600">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="app-button-primary w-full"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onGoToSignup}
              className="font-black text-slate-950 underline-offset-4 transition hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
