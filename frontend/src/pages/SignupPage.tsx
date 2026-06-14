import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { apiRequest } from "../api/client";
import type { SignupResponse } from "../types/auth";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onGoToLogin: () => void;
}

const signupCards = [
  {
    step: "01",
    title: "나만의 카테고리로 시작",
    description:
      "월급, 식비, 교통비처럼 자주 쓰는 항목을 수입과 지출로 나누어 관리할 수 있어요.",
  },
  {
    step: "02",
    title: "거래내역을 간단하게 기록",
    description:
      "금액, 날짜, 메모만 입력하면 매일의 수입과 지출이 대시보드에 자동 반영됩니다.",
  },
  {
    step: "03",
    title: "자산 흐름을 한눈에 확인",
    description:
      "월별 요약과 누적 자산 그래프로 나의 소비 흐름을 더 명확하게 파악하세요.",
  },
];

function SignupPage({ onSignupSuccess, onGoToLogin }: SignupPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % signupCards.length);
    }, 2800);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const activeCard = signupCards[activeCardIndex];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest<SignupResponse>("/auth/signup", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      setSuccessMessage("Signup successful. Please login.");

      setTimeout(() => {
        onSignupSuccess();
      }, 800);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Signup failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.65),_transparent_28rem),radial-gradient(circle_at_top_right,_rgba(199,210,254,0.65),_transparent_30rem),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_50%,_#f8fafc_100%)] px-4 py-10">
      <section className="grid min-h-[680px] w-full max-w-5xl overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/75 shadow-2xl shadow-slate-300/50 backdrop-blur-xl lg:grid-cols-[1fr_1.05fr]">
        <div className="hidden border-r border-indigo-100/70 bg-gradient-to-br from-sky-100/75 via-slate-50/95 to-indigo-100/80 p-10 lg:flex lg:flex-col">
          <div className="min-h-[150px]">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
              Join MoneyLog
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
              Start your
              <br />
              finance routine.
            </h1>

            <p className="mt-4 max-w-sm text-sm font-semibold leading-6 text-slate-600">
              새 계정을 만들고 수입, 지출, 카테고리, 누적 자산 흐름을 체계적으로
              관리해보세요.
            </p>
          </div>

          <div className="flex flex-1 items-center py-12">
            <div className="w-full rounded-[2rem] border border-white/90 bg-white/80 p-6 shadow-xl shadow-indigo-200/40 backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                  {activeCard.step}
                </span>

                <div className="flex gap-1.5">
                  {signupCards.map((card, index) => (
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
                    width: `${((activeCardIndex + 1) / signupCards.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/90 bg-white/70 p-5 shadow-lg shadow-indigo-200/30 backdrop-blur">
            <p className="text-sm font-black text-slate-950">
              Build better money habits.
            </p>

            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
              작은 기록부터 시작해 나만의 소비 기준을 만들어보세요.
            </p>
          </div>
        </div>

        <div className="bg-white/90 p-8 backdrop-blur sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
              Create account
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              회원가입
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              MoneyLog 계정을 만들고 나만의 가계부를 시작하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="signup-email" className="app-label">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                className="app-input w-full"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="app-label">
                Password
              </label>

              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  className="app-input w-full pr-20"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create your password"
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

            <div>
              <label htmlFor="signup-confirm-password" className="app-label">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="app-input w-full pr-20"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-black text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {successMessage && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/90 px-4 py-3 text-sm font-semibold text-emerald-700">
                {successMessage}
              </div>
            )}

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
              {isLoading ? "Signing up..." : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onGoToLogin}
              className="font-black text-slate-950 underline-offset-4 transition hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default SignupPage;
