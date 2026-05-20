import {
  CheckCircle2,
  XCircle,
  Printer,
  RotateCcw,
  LayoutDashboard,
  Calendar,
  MapPin,
  User,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { QUESTIONS, CATEGORIES, CATEGORY_ICONS } from "../lib/questions";
import type { AuditResult } from "../lib/storage";

interface ResultsProps {
  result: AuditResult;
  onNewAudit: () => void;
  onDashboard: () => void;
}

const RATING_CONFIG = {
  green: {
    label: "GREEN RESULT",
    emoji: "🟢",
    headline: "Excellent Compliance",
    description: "Outstanding result. The store is meeting or exceeding loss prevention standards.",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-emerald-400",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/30",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-200 dark:border-emerald-700",
    scoreText: "text-emerald-600 dark:text-emerald-400",
    ringColor: "ring-emerald-400/40",
  },
  amber: {
    label: "AMBER RESULT",
    emoji: "🟠",
    headline: "Improvement Required",
    description: "Some compliance gaps identified. Action plan recommended before next audit.",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-400",
    badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-200 dark:border-amber-700",
    scoreText: "text-amber-600 dark:text-amber-400",
    ringColor: "ring-amber-400/40",
  },
  red: {
    label: "RED RESULT",
    emoji: "🔴",
    headline: "Urgent Action Required",
    description: "Significant compliance failures identified. Immediate corrective action is required.",
    gradientFrom: "from-red-600",
    gradientTo: "to-red-400",
    badgeBg: "bg-red-100 dark:bg-red-900/30",
    badgeText: "text-red-700 dark:text-red-300",
    badgeBorder: "border-red-200 dark:border-red-700",
    scoreText: "text-red-600 dark:text-red-400",
    ringColor: "ring-red-400/40",
  },
};

export default function Results({ result, onNewAudit, onDashboard }: ResultsProps) {
  const cfg = RATING_CONFIG[result.rating];

  const failedQuestions = QUESTIONS.filter((q) => {
    const answer = result.answers.find((a) => a.questionId === q.id);
    return answer?.answer === "no";
  });

  const getCategoryScore = (cat: string) => {
    const qs = QUESTIONS.filter((q) => q.category === cat);
    let passed = 0;
    let total = 0;
    qs.forEach((q) => {
      const a = result.answers.find((x) => x.questionId === q.id);
      if (a?.answer) {
        total += q.weight;
        if (a.answer === "yes") passed += q.weight;
      }
    });
    const pct = total === 0 ? 100 : Math.round((passed / total) * 100);
    return { passed, total, pct };
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-5">
      {/* Score hero */}
      <div className={`rounded-2xl bg-gradient-to-br ${cfg.gradientFrom} ${cfg.gradientTo} p-1 shadow-lg`}>
        <div className="rounded-xl bg-card/95 dark:bg-card p-5 text-center">
          <div className={`inline-flex h-28 w-28 items-center justify-center rounded-full ring-4 ${cfg.ringColor} bg-gradient-to-br ${cfg.gradientFrom} ${cfg.gradientTo} mx-auto mb-4 shadow-xl`}>
            <span className={`text-4xl font-black text-white`}>{result.score}%</span>
          </div>

          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText} mb-2`}>
            <span>{cfg.emoji}</span>
            {cfg.label}
          </div>

          <h2 className="text-xl font-bold text-card-foreground mt-1">{cfg.headline}</h2>
          <p className="text-sm text-muted-foreground mt-1">{cfg.description}</p>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-sm">
            <span className="font-semibold text-card-foreground">
              {result.passedCount} of {result.totalCount} compliant
            </span>
            {result.passed !== result.passedCount && (
              <span className="text-muted-foreground">({result.passed}/{result.total} weighted pts)</span>
            )}
          </div>
        </div>
      </div>

      {/* Audit meta */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2.5">
        <h3 className="text-sm font-semibold text-card-foreground mb-1">Audit Details</h3>
        {[
          { icon: <User size={14} />, label: "Leader", value: result.leaderName },
          { icon: <MapPin size={14} />, label: "Location", value: result.storeLocation },
          {
            icon: <Calendar size={14} />,
            label: "Completed",
            value: new Date(result.completedAt).toLocaleString("en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-start gap-2.5 text-sm">
            <span className="shrink-0 mt-0.5 text-muted-foreground">{icon}</span>
            <span className="text-muted-foreground w-20 shrink-0">{label}</span>
            <span className="font-medium text-card-foreground">{value}</span>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Category Breakdown</h3>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const { passed, total, pct } = getCategoryScore(cat);
            const catRating = pct >= 80 ? "green" : pct >= 70 ? "amber" : "red";
            const barColor =
              catRating === "green" ? "bg-emerald-500" :
              catRating === "amber" ? "bg-amber-500" :
              "bg-red-500";
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-card-foreground">
                    {CATEGORY_ICONS[cat]} {cat}
                  </span>
                  <span className={`text-xs font-bold ${
                    catRating === "green" ? "text-emerald-600 dark:text-emerald-400" :
                    catRating === "amber" ? "text-amber-600 dark:text-amber-400" :
                    "text-red-600 dark:text-red-400"
                  }`}>
                    {pct}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Failed questions */}
      {failedQuestions.length > 0 && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">
              Failed Items — Action Required ({failedQuestions.length})
            </h3>
          </div>
          <ul className="divide-y divide-border">
            {failedQuestions.map((q) => (
              <li key={q.id} className="flex items-start gap-3 px-4 py-3">
                <XCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{CATEGORY_ICONS[q.category]} {q.category}{q.weight === 2 ? " · ⚡ Critical" : ""}</p>
                  <p className="text-sm text-card-foreground">{q.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Passed questions summary */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Compliant Items ({result.passedCount})
          </h3>
        </div>
        <ul className="divide-y divide-border">
          {QUESTIONS.filter((q) => {
            const a = result.answers.find((x) => x.questionId === q.id);
            return a?.answer === "yes";
          }).map((q) => (
            <li key={q.id} className="flex items-start gap-3 px-4 py-3">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-500" />
              <p className="text-sm text-card-foreground">{q.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Comments */}
      {result.comments && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={15} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-card-foreground">Comments</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.comments}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pb-6">
        <button
          onClick={handlePrint}
          className="no-print flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-colors active:scale-[0.97]"
        >
          <Printer size={15} />
          Print / PDF
        </button>
        <button
          onClick={onDashboard}
          className="no-print flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-colors active:scale-[0.97]"
        >
          <LayoutDashboard size={15} />
          Dashboard
        </button>
        <button
          onClick={onNewAudit}
          className="no-print flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-all active:scale-[0.98]"
        >
          <RotateCcw size={15} />
          New Audit
        </button>
      </div>
    </div>
  );
}
