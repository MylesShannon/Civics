import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, AlertTriangle, Clock, Trash2, ClipboardCheck } from 'lucide-react';
import {
  clearQuizHistory,
  getMissed,
  getQuizHistory,
  type QuizHistoryEntry,
} from '../utils/storage';
import { btnPrimary, btnGhostDanger } from '../utils/styles';

function formatDuration(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

type Summary = {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  bestCorrect: number;
  avgCorrect: number;
  totalCorrect: number;
  totalAsked: number;
  accuracy: number;
  avgDurationSeconds: number;
};

function summarize(history: QuizHistoryEntry[]): Summary {
  const total = history.length;
  const passed = history.filter((h) => h.status === 'passed').length;
  const totalCorrect = history.reduce((s, h) => s + h.correct, 0);
  const totalAsked = history.reduce((s, h) => s + h.asked, 0);
  const totalDuration = history.reduce((s, h) => s + h.durationSeconds, 0);
  return {
    total,
    passed,
    failed: total - passed,
    passRate: total === 0 ? 0 : (passed / total) * 100,
    bestCorrect: history.reduce((max, h) => Math.max(max, h.correct), 0),
    avgCorrect: total === 0 ? 0 : totalCorrect / total,
    totalCorrect,
    totalAsked,
    accuracy: totalAsked === 0 ? 0 : (totalCorrect / totalAsked) * 100,
    avgDurationSeconds: total === 0 ? 0 : Math.round(totalDuration / total),
  };
}

export function Stats() {
  const [history, setHistory] = useState<QuizHistoryEntry[]>(() => getQuizHistory());
  const missedCount = getMissed().length;

  const onClear = () => {
    if (!window.confirm('Clear your quiz history? This cannot be undone.')) return;
    clearQuizHistory();
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="m-0 mb-1 text-navy dark:text-ink text-[1.6rem] tracking-tight font-bold">
            Your Stats
          </h1>
          <p className="m-0 text-ink-muted text-[0.95rem]">
            Track your progress across practice quizzes.
          </p>
        </div>
        <div className="bg-surface border border-line rounded-2xl p-8 px-5 flex flex-col items-center gap-2.5 shadow-sm text-ink-muted text-center">
          <BarChart3 size={32} aria-hidden="true" />
          <h2 className="mt-1 m-0 text-navy dark:text-ink text-xl font-bold">No stats yet</h2>
          <p>Take a practice quiz to start building your history.</p>
          <Link to="/quiz" className={`${btnPrimary} mt-2`}>
            <ClipboardCheck size={18} aria-hidden="true" />
            Take a Practice Quiz
          </Link>
        </div>
      </div>
    );
  }

  const s = summarize(history);
  const recent = history.slice(0, 10);

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="m-0 mb-1 text-navy dark:text-ink text-[1.6rem] tracking-tight font-bold">
            Your Stats
          </h1>
          <p className="m-0 text-ink-muted text-[0.95rem]">
            Based on your last {s.total} practice quiz{s.total === 1 ? '' : 'zes'}.
          </p>
        </div>
        <button type="button" className={btnGhostDanger} onClick={onClear}>
          <Trash2 size={16} aria-hidden="true" />
          Clear history
        </button>
      </div>

      <dl className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2.5 m-0">
        <Kpi label="Quizzes taken" value={String(s.total)} />
        <Kpi label="Pass rate" value={`${Math.round(s.passRate)}%`} />
        <Kpi label="Best score" value={`${s.bestCorrect} correct`} />
        <Kpi label="Avg correct" value={s.avgCorrect.toFixed(1)} />
        <Kpi label="Accuracy" value={`${Math.round(s.accuracy)}%`} />
        <Kpi label="Avg time" value={formatDuration(s.avgDurationSeconds)} />
      </dl>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Tally
          label="Passed"
          value={s.passed}
          icon={<Trophy size={18} aria-hidden="true" />}
          tone="pass"
        />
        <Tally
          label="Did not pass"
          value={s.failed}
          icon={<AlertTriangle size={18} aria-hidden="true" />}
          tone="fail"
        />
      </div>

      {missedCount > 0 ? (
        <div className="flex items-center justify-between gap-3 flex-wrap bg-surface border border-line rounded-xl p-4 shadow-sm">
          <div>
            <p className="m-0 text-ink font-semibold">
              {missedCount} question{missedCount === 1 ? '' : 's'} marked to review
            </p>
            <p className="m-0 text-ink-muted text-sm">
              From all your past quiz attempts. Re-study to clear them out.
            </p>
          </div>
          <Link to="/missed" className={btnPrimary}>
            Study Missed Questions
          </Link>
        </div>
      ) : null}

      <section aria-labelledby="recent-heading" className="flex flex-col gap-2">
        <h2
          id="recent-heading"
          className="m-0 text-navy dark:text-ink text-[1.05rem] font-bold"
        >
          Recent attempts
        </h2>
        <ol className="m-0 p-0 list-none flex flex-col gap-1.5">
          {recent.map((h, idx) => {
            const passed = h.status === 'passed';
            return (
              <li
                key={`${h.date}-${idx}`}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5 bg-surface border border-line rounded-lg shadow-sm"
              >
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    passed ? 'bg-pass-bg text-pass-text' : 'bg-fail-bg text-fail-text'
                  }`}
                >
                  {passed ? (
                    <Trophy size={12} aria-hidden="true" />
                  ) : (
                    <AlertTriangle size={12} aria-hidden="true" />
                  )}
                  {passed ? 'Passed' : 'Failed'}
                </span>
                <span className="text-ink font-semibold tabular-nums">
                  {h.correct}/{h.asked} correct
                  <span className="ml-2 text-ink-muted font-normal">
                    ({h.incorrect} wrong)
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-ink-muted text-sm tabular-nums">
                  <Clock size={14} aria-hidden="true" />
                  {formatDuration(h.durationSeconds)}
                  <span className="ml-2 hidden sm:inline">{formatDate(h.date)}</span>
                </span>
              </li>
            );
          })}
        </ol>
        {history.length > recent.length ? (
          <p className="m-0 text-center text-ink-muted text-sm">
            Showing 10 of {history.length} attempts. Older attempts beyond 50 are not retained.
          </p>
        ) : null}
      </section>
    </motion.div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-3 text-center shadow-sm">
      <dt className="text-xs text-ink-muted uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-navy dark:text-ink tabular-nums">{value}</dd>
    </div>
  );
}

function Tally({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'pass' | 'fail';
}) {
  const tint = tone === 'pass' ? 'bg-pass-bg text-pass-text' : 'bg-fail-bg text-fail-text';
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl ${tint}`}>
      {icon}
      <div>
        <p className="m-0 text-2xl font-bold tabular-nums">{value}</p>
        <p className="m-0 text-sm">{label}</p>
      </div>
    </div>
  );
}
