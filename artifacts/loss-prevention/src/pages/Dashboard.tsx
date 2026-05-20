import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  ClipboardCheck,
  Award,
  Trash2,
  ChevronRight,
  BarChart2,
  Play,
  Shield,
} from "lucide-react";
import { computeStats, deleteAudit } from "../lib/storage";
import type { AuditResult } from "../lib/storage";

interface DashboardProps {
  history: AuditResult[];
  onStartAudit: () => void;
  onDeleteAudit: (id: string) => void;
}

const RATING_META = {
  green: { label: "GREEN", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500", bar: "#22c55e" },
  amber: { label: "AMBER", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500", bar: "#f59e0b" },
  red:   { label: "RED",   color: "text-red-600 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-900/30",     border: "border-red-200 dark:border-red-800",     dot: "bg-red-500",   bar: "#ef4444" },
};

function RatingBadge({ rating }: { rating: "green" | "amber" | "red" }) {
  const meta = RATING_META[rating];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.bg} ${meta.border} ${meta.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

// Custom dot for the trend chart — colour by rating
function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  const meta = RATING_META[payload.rating as "green" | "amber" | "red"];
  return <circle cx={cx} cy={cy} r={5} fill={meta.bar} stroke="white" strokeWidth={2} />;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const meta = RATING_META[d.rating as "green" | "amber" | "red"];
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-card-foreground">{d.date}</p>
      <p className={`font-bold ${meta.color}`}>{d.score}% — {meta.label}</p>
    </div>
  );
}

export default function Dashboard({ history, onStartAudit, onDeleteAudit }: DashboardProps) {
  const stats = useMemo(() => computeStats(history), [history]);

  const handleDelete = (id: string) => {
    if (confirm("Delete this audit record? This cannot be undone.")) {
      deleteAudit(id);
      onDeleteAudit(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero CTA */}
      <div className="rounded-2xl bg-gradient-to-br from-sidebar to-sidebar-accent border border-sidebar-border p-6 shadow-md text-sidebar-foreground">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Loss Prevention Behaviour Check</h1>
            <p className="mt-1 text-sm text-sidebar-foreground/70">
              Retail compliance audit for store leaders
            </p>
          </div>
          <Shield className="shrink-0 mt-0.5 text-sidebar-primary" size={32} />
        </div>
        <button
          onClick={onStartAudit}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sidebar-primary py-3.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Play size={16} fill="white" />
          Start New Audit
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<ClipboardCheck size={18} />} label="Total Audits" value={stats.total} />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Avg Score"
          value={stats.total > 0 ? `${stats.averageScore}%` : "—"}
          valueColor={
            stats.total === 0 ? "" :
            stats.averageScore >= 80 ? "text-emerald-600 dark:text-emerald-400" :
            stats.averageScore >= 70 ? "text-amber-600 dark:text-amber-400" :
            "text-red-600 dark:text-red-400"
          }
        />
        <StatCard icon={<Award size={18} />} label="Green Results" value={stats.greenCount} valueColor="text-emerald-600 dark:text-emerald-400" />
        <StatCard
          icon={<BarChart2 size={18} />}
          label="Last Score"
          value={stats.lastAudit ? `${stats.lastAudit.score}%` : "—"}
          valueColor={
            !stats.lastAudit ? "" :
            stats.lastAudit.rating === "green" ? "text-emerald-600 dark:text-emerald-400" :
            stats.lastAudit.rating === "amber" ? "text-amber-600 dark:text-amber-400" :
            "text-red-600 dark:text-red-400"
          }
        />
      </div>

      {/* Distribution bar */}
      {stats.total > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Result Distribution</h3>
          <div className="flex h-3 overflow-hidden rounded-full">
            {stats.greenPct > 0 && (
              <div className="bg-emerald-500 transition-all" style={{ width: `${stats.greenPct}%` }} />
            )}
            {stats.amberPct > 0 && (
              <div className="bg-amber-500 transition-all" style={{ width: `${stats.amberPct}%` }} />
            )}
            {stats.redPct > 0 && (
              <div className="bg-red-500 transition-all" style={{ width: `${stats.redPct}%` }} />
            )}
          </div>
          <div className="mt-2.5 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />{stats.greenPct}% Green</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />{stats.amberPct}% Amber</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />{stats.redPct}% Red</span>
          </div>
        </div>
      )}

      {/* Trend chart */}
      {stats.trendData.length >= 2 && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Score Trend (last {stats.trendData.length} audits)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stats.trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Green 80%", position: "right", fontSize: 10, fill: "#22c55e" }} />
              <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Amber 70%", position: "right", fontSize: 10, fill: "#f59e0b" }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={<CustomDot />}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent audits */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-card-foreground">Recent Audits</h3>
          {history.length > 0 && (
            <span className="text-xs text-muted-foreground">{history.length} total</span>
          )}
        </div>

        {history.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <ClipboardCheck size={32} className="mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">No audits completed yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Start your first audit above</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {history.slice(0, 8).map((audit) => (
              <li key={audit.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-card-foreground truncate">{audit.leaderName || "Unknown"}</span>
                    <RatingBadge rating={audit.rating} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span>{audit.storeLocation || "No location"}</span>
                    <span>·</span>
                    <span>{new Date(audit.completedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-lg font-bold ${RATING_META[audit.rating].color}`}>{audit.score}%</p>
                  <p className="text-xs text-muted-foreground">{audit.passedCount}/{audit.totalCount}</p>
                </div>
                <button
                  onClick={() => handleDelete(audit.id)}
                  className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label="Delete audit"
                >
                  <Trash2 size={14} />
                </button>
                <ChevronRight size={14} className="text-muted-foreground/30 shrink-0" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  valueColor = "text-card-foreground",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  valueColor?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
      <div className="text-muted-foreground mb-1.5">{icon}</div>
      <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
