interface DashboardPageProps {
  onLogout: () => void;
}

function DashboardPage({ onLogout }: DashboardPageProps) {
  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    onLogout();
  };

  return (
    <main>
      <h1>MoneyLog Dashboard</h1>
      <p>Welcome to your personal finance tracker.</p>

      <p>
        Token status: <strong>{token ? "Logged in" : "Not logged in"}</strong>
      </p>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}

export default DashboardPage;
