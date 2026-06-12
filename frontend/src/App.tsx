import { useState } from "react";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

type Page = "login" | "signup" | "dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("access_token")),
  );

  const [page, setPage] = useState<Page>(
    localStorage.getItem("access_token") ? "dashboard" : "login",
  );

  if (isLoggedIn && page === "dashboard") {
    return (
      <div className="min-h-screen bg-slate-100">
        <DashboardPage
          onLogout={() => {
            localStorage.removeItem("access_token");
            setIsLoggedIn(false);
            setPage("login");
          }}
        />
      </div>
    );
  }

  if (page === "signup") {
    return (
      <div className="min-h-screen bg-slate-100">
        <SignupPage
          onSignupSuccess={() => setPage("login")}
          onGoToLogin={() => setPage("login")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <LoginPage
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setPage("dashboard");
        }}
        onGoToSignup={() => setPage("signup")}
      />
    </div>
  );
}

export default App;
