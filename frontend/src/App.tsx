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
      <DashboardPage
        onLogout={() => {
          setIsLoggedIn(false);
          setPage("login");
        }}
      />
    );
  }

  if (page === "signup") {
    return (
      <SignupPage
        onSignupSuccess={() => setPage("login")}
        onGoToLogin={() => setPage("login")}
      />
    );
  }

  return (
    <LoginPage
      onLoginSuccess={() => {
        setIsLoggedIn(true);
        setPage("dashboard");
      }}
      onGoToSignup={() => setPage("signup")}
    />
  );
}

export default App;
