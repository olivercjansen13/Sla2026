import { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Send,
} from "lucide-react";
import { QUESTIONS, CATEGORIES, CATEGORY_ICONS } from "../lib/questions";
import type { AuditAnswer } from "../lib/storage";

interface AuditProps {
  leaderName: string;
  storeLocation: string;
  answers: AuditAnswer[];
  comments: string;
  onLeaderChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onAnswerChange: (id: string, answer: "yes" | "no") => void;
  onCommentsChange: (v: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export default function Audit({
  leaderName,
  storeLocation,
  answers,
  comments,
  onLeaderChange,
  onLocationChange,
  onAnswerChange,
  onCommentsChange,
  onSubmit,
  onReset,
}: AuditProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES)
  );
  const [showHint, setShowHint] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const answeredCount = answers.filter((a) => a.answer !== null).length;
  const totalQuestions = QUESTIONS.length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  const getAnswer = (id: string) =>
    answers.find((a) => a.questionId === id)?.answer ?? null;

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const getCategoryProgress = (cat: string) => {
    const qs = QUESTIONS.filter((q) => q.category === cat);
    const answered = qs.filter((q) => getAnswer(q.id) !== null).length;
    return { answered, total: qs.length };
  };

  const canSubmit = answeredCount === totalQuestions && leaderName.trim() && storeLocation.trim();

  return (
    <div className="space-y-4">
      {/* Leader info */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-card-foreground">Audit Details</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Leader Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={leaderName}
              onChange={(e) => onLeaderChange(e.target.value)}
              placeholder="e.g. Sarah Mitchell"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Store Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={storeLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="e.g. Manchester Central"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-card-foreground">Progress</span>
          <span className="text-sm font-bold text-primary">{answeredCount}/{totalQuestions} answered</span>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">{progressPct}% complete</p>
      </div>

      {/* Questions by category */}
      {CATEGORIES.map((category) => {
        const { answered, total } = getCategoryProgress(category);
        const isExpanded = expandedCategories.has(category);
        const catQuestions = QUESTIONS.filter((q) => q.category === category);
        const allAnswered = answered === total;

        return (
          <div key={category} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{CATEGORY_ICONS[category]}</span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-card-foreground">{category}</p>
                  <p className="text-xs text-muted-foreground">{answered}/{total} completed</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {allAnswered ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : answered > 0 ? (
                  <AlertCircle size={16} className="text-amber-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                )}
                {isExpanded ? (
                  <ChevronUp size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronDown size={16} className="text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Questions */}
            {isExpanded && (
              <div className="divide-y divide-border border-t border-border">
                {catQuestions.map((q, idx) => {
                  const answer = getAnswer(q.id);
                  return (
                    <div
                      key={q.id}
                      className={`p-4 transition-colors ${
                        answer === "yes"
                          ? "bg-emerald-50/50 dark:bg-emerald-900/10"
                          : answer === "no"
                          ? "bg-red-50/50 dark:bg-red-900/10"
                          : ""
                      }`}
                    >
                      {/* Question number + weight badge */}
                      <div className="flex items-start gap-3 mb-3">
                        <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            {q.weight === 2 && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 px-1.5 py-0.5 text-[10px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wide">
                                ⚡ Critical
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-card-foreground leading-relaxed">{q.text}</p>
                          {q.hint && (
                            <button
                              onClick={() =>
                                setShowHint(showHint === q.id ? null : q.id)
                              }
                              className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Info size={12} />
                              Guidance
                            </button>
                          )}
                          {showHint === q.id && q.hint && (
                            <div className="mt-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
                              {q.hint}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Yes / No buttons */}
                      <div className="flex gap-2.5 pl-9">
                        <button
                          onClick={() => onAnswerChange(q.id, "yes")}
                          className={`answer-yes flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                            answer === "yes"
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
                              : "border-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          }`}
                        >
                          <CheckCircle2 size={16} />
                          YES — Pass
                        </button>
                        <button
                          onClick={() => onAnswerChange(q.id, "no")}
                          className={`answer-no flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                            answer === "no"
                              ? "bg-red-500 text-white shadow-md shadow-red-200 dark:shadow-red-900/30"
                              : "border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          }`}
                        >
                          <XCircle size={16} />
                          NO — Fail
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Comments */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <label className="block text-sm font-semibold text-card-foreground mb-2">
          Additional Comments <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          rows={4}
          placeholder="Note any actions, observations or follow-ups..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pb-6" ref={bottomRef}>
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-colors active:scale-[0.97]"
        >
          <RotateCcw size={15} />
          Reset
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all active:scale-[0.98] ${
            canSubmit
              ? "bg-primary text-primary-foreground shadow-md hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
        >
          <Send size={15} />
          {canSubmit
            ? "Submit Audit"
            : answeredCount < totalQuestions
            ? `${totalQuestions - answeredCount} questions remaining`
            : "Enter leader name & location"}
        </button>
      </div>
    </div>
  );
}
