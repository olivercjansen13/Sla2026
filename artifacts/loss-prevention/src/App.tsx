import { useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import Audit from "@/pages/Audit";
import Results from "@/pages/Results";
import { QUESTIONS } from "@/lib/questions";
import {
  loadHistory,
  saveAudit,
  seedSampleData,
  getRating,
} from "@/lib/storage";
import type { AuditAnswer, AuditResult } from "@/lib/storage";

const queryClient = new QueryClient();

// Dark mode persisted preference
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("lp_dark_mode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("lp_dark_mode", String(dark));
  }, [dark]);

  return [dark, setDark] as const;
}

// Build initial answers array — one entry per question, all null
function buildEmptyAnswers(): AuditAnswer[] {
  return QUESTIONS.map((q) => ({ questionId: q.id, answer: null }));
}

type View = "dashboard" | "audit" | "results";

function App() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [view, setView] = useState<View>("dashboard");
  const [history, setHistory] = useState<AuditResult[]>(() => {
    seedSampleData();
    return loadHistory();
  });

  // Audit state
  const [leaderName, setLeaderName] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [answers, setAnswers] = useState<AuditAnswer[]>(buildEmptyAnswers);
  const [comments, setComments] = useState("");
  const [currentResult, setCurrentResult] = useState<AuditResult | null>(null);

  const auditInProgress = answers.some((a) => a.answer !== null);

  const handleAnswerChange = useCallback((id: string, answer: "yes" | "no") => {
    setAnswers((prev) =>
      prev.map((a) => (a.questionId === id ? { ...a, answer } : a))
    );
  }, []);

  const handleReset = useCallback(() => {
    if (answers.some((a) => a.answer !== null)) {
      if (!confirm("Clear all answers and start over?")) return;
    }
    setLeaderName("");
    setStoreLocation("");
    setAnswers(buildEmptyAnswers());
    setComments("");
    setView("audit");
  }, [answers]);

  const handleSubmit = useCallback(() => {
    // Compute weighted score
    let passed = 0;
    let total = 0;
    let passedCount = 0;
    let totalCount = 0;

    QUESTIONS.forEach((q) => {
      const a = answers.find((x) => x.questionId === q.id);
      if (a?.answer) {
        total += q.weight;
        totalCount++;
        if (a.answer === "yes") {
          passed += q.weight;
          passedCount++;
        }
      }
    });

    const score = total === 0 ? 0 : Math.round((passed / total) * 100);
    const rating = getRating(score);

    const result: AuditResult = {
      id: `audit_${Date.now()}`,
      leaderName,
      storeLocation,
      completedAt: new Date().toISOString(),
      answers: [...answers],
      comments,
      score,
      passed,
      total,
      passedCount,
      totalCount,
      rating,
    };

    saveAudit(result);
    setCurrentResult(result);
    setHistory(loadHistory());
    setView("results");

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [answers, leaderName, storeLocation, comments]);

  const handleNewAudit = useCallback(() => {
    setLeaderName("");
    setStoreLocation("");
    setAnswers(buildEmptyAnswers());
    setComments("");
    setCurrentResult(null);
    setView("audit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNavigate = useCallback(
    (target: "dashboard" | "audit") => {
      if (target === "audit") {
        // If results are showing, start fresh
        if (view === "results") {
          handleNewAudit();
          return;
        }
      }
      setView(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [view, handleNewAudit]
  );

  const handleDeleteAudit = useCallback(() => {
    setHistory(loadHistory());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Header
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          view={view}
          onNavigate={handleNavigate}
          auditInProgress={auditInProgress && view !== "results"}
        />

        <main className="mx-auto max-w-3xl px-4 py-5">
          {view === "dashboard" && (
            <Dashboard
              history={history}
              onStartAudit={() => {
                handleNewAudit();
                setView("audit");
              }}
              onDeleteAudit={handleDeleteAudit}
            />
          )}

          {view === "audit" && (
            <Audit
              leaderName={leaderName}
              storeLocation={storeLocation}
              answers={answers}
              comments={comments}
              onLeaderChange={setLeaderName}
              onLocationChange={setStoreLocation}
              onAnswerChange={handleAnswerChange}
              onCommentsChange={setComments}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
          )}

          {view === "results" && currentResult && (
            <Results
              result={currentResult}
              onNewAudit={handleNewAudit}
              onDashboard={() => {
                setView("dashboard");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
