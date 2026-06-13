type DashboardView = "overview" | "transactions" | "categories";

interface AppSidebarProps {
  activeView: DashboardView;
  isOpen: boolean;
  onToggle: () => void;
  onChangeView: (view: DashboardView) => void;
}

const menuItems: {
  label: string;
  shortLabel: string;
  description: string;
  value: DashboardView;
}[] = [
  {
    label: "대시보드",
    shortLabel: "D",
    description: "요약과 자산 흐름",
    value: "overview",
  },
  {
    label: "거래내역",
    shortLabel: "T",
    description: "수입과 지출 기록",
    value: "transactions",
  },
  {
    label: "카테고리",
    shortLabel: "C",
    description: "분류 관리",
    value: "categories",
  },
];

function AppSidebar({
  activeView,
  isOpen,
  onToggle,
  onChangeView,
}: AppSidebarProps) {
  return (
    <aside className={`app-sidebar ${isOpen ? "w-72" : "w-24"}`}>
      <div className="flex h-full flex-col p-4">
        <button
          type="button"
          onClick={onToggle}
          className="app-sidebar-control"
        >
          {isOpen ? "← 메뉴 접기" : "→"}
        </button>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeView === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onChangeView(item.value)}
                className={`app-sidebar-item ${
                  isActive ? "app-sidebar-item-active" : "app-sidebar-item-idle"
                } ${isOpen ? "justify-start" : "justify-center"}`}
              >
                <span
                  className={`app-sidebar-icon ${
                    isActive
                      ? "app-sidebar-icon-active"
                      : "app-sidebar-icon-idle"
                  }`}
                >
                  {item.shortLabel}
                </span>

                {isOpen && (
                  <span>
                    <span className="block text-sm font-black">
                      {item.label}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs font-semibold ${
                        isActive
                          ? "text-slate-300 dark:text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      {item.description}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="app-sidebar-note">
          {isOpen ? (
            <>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                MoneyLog
              </p>
              <p className="mt-2 text-lg font-black leading-tight text-slate-950 dark:text-white">
                Clear finance,
                <br />
                calm decisions.
              </p>
              <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                수입과 지출 흐름을 차분하게 관리하세요.
              </p>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-slate-950 dark:bg-indigo-400" />
              </div>
            </>
          ) : (
            <p className="text-center text-lg font-black text-slate-950 dark:text-white">
              M
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;
