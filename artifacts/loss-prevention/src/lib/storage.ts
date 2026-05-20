// ============================================================
// LOCAL STORAGE UTILITIES
// All audit history is persisted to the browser's localStorage
// ============================================================

import type { Category } from "./questions";

export interface AuditAnswer {
  questionId: string;
  answer: "yes" | "no" | null;
}

export interface AuditResult {
  id: string;
  leaderName: string;
  storeLocation: string;
  completedAt: string; // ISO string
  answers: AuditAnswer[];
  comments: string;
  score: number;       // percentage 0-100
  passed: number;      // number of weighted passes
  total: number;       // total weighted points possible
  passedCount: number; // raw question count
  totalCount: number;  // total questions answered
  rating: "green" | "amber" | "red";
}

const STORAGE_KEY = "lp_audit_history";

/** Load all past audits from localStorage */
export function loadHistory(): AuditResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AuditResult[];
  } catch {
    return [];
  }
}

/** Save a new audit result, keeping the 100 most recent */
export function saveAudit(result: AuditResult): void {
  const history = loadHistory();
  const updated = [result, ...history].slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/** Delete a single audit by ID */
export function deleteAudit(id: string): void {
  const history = loadHistory();
  const updated = history.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/** Clear all audit history */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Compute a rating from a percentage score */
export function getRating(score: number): "green" | "amber" | "red" {
  if (score >= 80) return "green";
  if (score >= 70) return "amber";
  return "red";
}

/** Compute dashboard summary stats from history */
export interface DashboardStats {
  total: number;
  averageScore: number;
  lastAudit: AuditResult | null;
  greenCount: number;
  amberCount: number;
  redCount: number;
  greenPct: number;
  amberPct: number;
  redPct: number;
  categoryAverages: Record<Category, number>;
  trendData: { date: string; score: number; rating: string }[];
}

export function computeStats(history: AuditResult[]): DashboardStats {
  const total = history.length;
  const averageScore =
    total === 0 ? 0 : Math.round(history.reduce((s, a) => s + a.score, 0) / total);

  const greenCount = history.filter((a) => a.rating === "green").length;
  const amberCount = history.filter((a) => a.rating === "amber").length;
  const redCount   = history.filter((a) => a.rating === "red").length;

  const greenPct = total === 0 ? 0 : Math.round((greenCount / total) * 100);
  const amberPct = total === 0 ? 0 : Math.round((amberCount / total) * 100);
  const redPct   = total === 0 ? 0 : Math.round((redCount   / total) * 100);

  // Trend data: last 10 audits, oldest first for the chart
  const trendData = [...history]
    .slice(0, 10)
    .reverse()
    .map((a) => ({
      date: new Date(a.completedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      score: a.score,
      rating: a.rating,
    }));

  // Placeholder category averages (not yet broken down per-audit)
  const categoryAverages = {} as Record<Category, number>;

  return {
    total,
    averageScore,
    lastAudit: history[0] ?? null,
    greenCount,
    amberCount,
    redCount,
    greenPct,
    amberPct,
    redPct,
    categoryAverages,
    trendData,
  };
}

/** Seed some sample historical data if the store is empty */
export function seedSampleData(): void {
  if (loadHistory().length > 0) return;

  const samples: AuditResult[] = [
    {
      id: "sample_1",
      leaderName: "Sarah Mitchell",
      storeLocation: "Manchester Central",
      completedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      answers: [],
      comments: "Overall good compliance. EAS pedestals need re-testing.",
      score: 85,
      passed: 34,
      total: 40,
      passedCount: 20,
      totalCount: 23,
      rating: "green",
    },
    {
      id: "sample_2",
      leaderName: "James Thornton",
      storeLocation: "Manchester Central",
      completedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      answers: [],
      comments: "Refund procedures not being followed consistently at service desk.",
      score: 72,
      passed: 29,
      total: 40,
      passedCount: 16,
      totalCount: 22,
      rating: "amber",
    },
    {
      id: "sample_3",
      leaderName: "Sarah Mitchell",
      storeLocation: "Manchester Central",
      completedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
      answers: [],
      comments: "Fire exit alarm not tested within 7 days. Immediate action taken.",
      score: 62,
      passed: 25,
      total: 40,
      passedCount: 14,
      totalCount: 23,
      rating: "red",
    },
    {
      id: "sample_4",
      leaderName: "Priya Sharma",
      storeLocation: "Manchester Central",
      completedAt: new Date(Date.now() - 28 * 86400000).toISOString(),
      answers: [],
      comments: "Strong audit across all categories. Team engagement was high.",
      score: 91,
      passed: 38,
      total: 40,
      passedCount: 22,
      totalCount: 23,
      rating: "green",
    },
    {
      id: "sample_5",
      leaderName: "James Thornton",
      storeLocation: "Manchester Central",
      completedAt: new Date(Date.now() - 35 * 86400000).toISOString(),
      answers: [],
      comments: "CCTV blind spot identified in aisle 7 — maintenance raised.",
      score: 78,
      passed: 31,
      total: 40,
      passedCount: 18,
      totalCount: 23,
      rating: "amber",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
}
