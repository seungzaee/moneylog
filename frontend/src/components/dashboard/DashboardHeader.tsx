interface DashboardHeaderProps {
  selectedYear: number;
  selectedMonth: number;
  remainingTimeText: string;
  isSessionExpiringSoon: boolean;
  isExtendingSession: boolean;
  onChangeYear: (year: number) => void;
  onChangeMonth: (month: number) => void;
  onExtendSession: () => void;
  onLogout: () => void;
}

function DashboardHeader({
  selectedYear,
  selectedMonth,
  remainingTimeText,
  isSessionExpiringSoon,
  isExtendingSession,
  onChangeYear,
  onChangeMonth,
  onExtendSession,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">MoneyLog</h1>
        <p className="mt-1 text-sm text-slate-500">
          {selectedYear}년 {selectedMonth}월 소비 요약
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(event) => onChangeYear(Number(event.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            {[2024, 2025, 2026, 2027].map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}년
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(event) => onChangeMonth(Number(event.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            {Array.from({ length: 12 }, (_, index) => index + 1).map(
              (monthOption) => (
                <option key={monthOption} value={monthOption}>
                  {monthOption}월
                </option>
              ),
            )}
          </select>
        </div>

        <div
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            isSessionExpiringSoon
              ? "bg-red-50 text-red-600"
              : "bg-white text-slate-600"
          }`}
        >
          Session {remainingTimeText}
        </div>

        <button
          type="button"
          onClick={onExtendSession}
          disabled={isExtendingSession}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {isExtendingSession ? "Extending..." : "Extend"}
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
