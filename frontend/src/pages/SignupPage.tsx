import { useState } from "react";
import type { FormEvent } from "react";

import { apiRequest } from "../api/client";
import type { SignupResponse } from "../types/auth";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onGoToLogin: () => void;
}

function SignupPage({ onSignupSuccess, onGoToLogin }: SignupPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
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
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Start tracking your income and expenses
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="signup-email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {successMessage && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onGoToLogin}
            className="font-semibold text-slate-900 underline-offset-4 hover:underline"
          >
            Login
          </button>
        </p>
      </section>
    </main>
  );
}

export default SignupPage;
