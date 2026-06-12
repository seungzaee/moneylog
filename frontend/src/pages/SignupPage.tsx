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
    <main>
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="signup-email">Email</label>
          <br />
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="signup-password">Password</label>
          <br />
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Signup"}
        </button>
      </form>

      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}

      <button type="button" onClick={onGoToLogin}>
        Go to Login
      </button>
    </main>
  );
}

export default SignupPage;
