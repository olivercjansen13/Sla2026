import { Shield, Moon, Sun, LayoutDashboard, ClipboardCheck } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
  view: "dashboard" | "audit" | "results";
  onNavigate: (view: "dashboard" | "audit") => void;
  auditInProgress: boolean;
}

export default function Header({
  darkMode,
  onToggleDark,
  view,
  onNavigate,
  auditInProgress,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-sidebar text-sidebar-foreground shadow-md no-print">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        {/* Logo & title */}
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2.5 focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-white shadow-sm">
            <Shield size={18} strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
              Retail
            </p>
            <p className="text-sm font-bold text-sidebar-foreground leading-none">
              Loss Prevention Check
            </p>
          </div>
        </button>

        {/* Navigation + dark mode */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate("dashboard")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "dashboard"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate("audit")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "audit" || view === "results"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <ClipboardCheck size={14} />
            <span className="hidden sm:inline">
              {auditInProgress ? "Continue Audit" : "New Audit"}
            </span>
            {auditInProgress && (
              <span className="ml-1 flex h-2 w-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            className="ml-1 rounded-lg p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
