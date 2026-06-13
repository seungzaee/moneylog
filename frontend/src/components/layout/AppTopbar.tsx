type ThemeMode = "light" | "dark";

interface AppTopbarProps {
  theme: ThemeMode;
  remainingTimeText: string;
  isSessionExpiringSoon: boolean;
  isExtendingSession: boolean;
  onToggleTheme: () => void;
  onExtendSession: () => void;
  onLogout: () => void;
}

function AppTopbar({
  theme,
  remainingTimeText,
  isSessionExpiringSoon,
  isExtendingSession,
  onToggleTheme,
  onExtendSession,
  onLogout,
}: AppTopbarProps) {
  return (
    <header className="app-topbar">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
            Personal Finance
          </p>
          <h1 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
            MoneyLog
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`hidden rounded-full px-4 py-2 text-sm font-black sm:block ${
              isSessionExpiringSoon
                ? "bg-red-50 text-red-600 ring-1 ring-red-100 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20"
                : "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10"
            }`}
          >
            Session {remainingTimeText}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          <button
            type="button"
            onClick={onExtendSession}
            disabled={isExtendingSession}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow disabled:translate-y-0 disabled:cursor-not-allowed disabled:text-slate-400 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
          >
            {isExtendingSession ? "Extending..." : "Extend"}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppTopbar;
