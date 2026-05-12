import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, AlertTriangle, RotateCcw, BookOpen } from 'lucide-react';
import type { CivicsQuestion } from '../data/civics2025';
import type { QuizStatus } from '../utils/quizLogic';
import { PASS_CORRECT, MAX_QUESTIONS } from '../utils/quizLogic';
import { btnPrimary, btnSecondary } from '../utils/styles';

type Props = {
  status: QuizStatus;
  correct: number;
  incorrect: number;
  asked: number;
  durationSeconds: number;
  missed: CivicsQuestion[];
  onRetry: () => void;
};

function formatDuration(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function ResultScreen({
  status,
  correct,
  incorrect,
  asked,
  durationSeconds,
  missed,
  onRetry,
}: Props) {
  const passed = status === 'passed';
  const Icon = passed ? Trophy : AlertTriangle;
  const bannerClasses = passed
    ? 'bg-pass-bg text-pass-text'
    : 'bg-fail-bg text-fail-text';

  return (
    <motion.section
      className="bg-surface border border-line rounded-2xl shadow-md p-6 flex flex-col gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-live="polite"
    >
      <div className={`flex items-center gap-3.5 p-4 rounded-xl ${bannerClasses}`}>
        <Icon size={32} aria-hidden="true" />
        <div>
          <h2 className="m-0 text-2xl font-bold">{passed ? 'You passed!' : 'Did not pass'}</h2>
          <p className="mt-1 text-[0.95rem] text-ink-muted">
            {passed
              ? `You answered at least ${PASS_CORRECT} questions correctly.`
              : `On the real test you would not pass this attempt. Keep studying — the threshold is ${PASS_CORRECT} correct out of up to ${MAX_QUESTIONS}.`}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-2.5 m-0">
        <Stat label="Correct" value={String(correct)} />
        <Stat label="Incorrect" value={String(incorrect)} />
        <Stat label="Asked" value={String(asked)} />
        <Stat label="Time" value={formatDuration(durationSeconds)} />
      </dl>

      {missed.length > 0 ? (
        <div>
          <h3 className="m-0 mb-2 text-navy dark:text-ink text-base">Questions you missed</h3>
          <ol className="m-0 pl-0 list-none flex flex-col gap-1.5 max-h-[280px] overflow-y-auto">
            {missed.map((q) => (
              <li
                key={q.id}
                className="flex gap-2.5 px-3 py-2.5 bg-page border border-line rounded-lg text-[0.95rem]"
              >
                <span className="min-w-[36px] font-bold text-red dark:text-fail-text">Q{q.id}</span>
                <span>{q.question}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p className="m-0 text-ink-muted italic">Perfect — no missed questions on this attempt.</p>
      )}

      <div className="flex flex-wrap gap-2.5">
        <button type="button" className={`${btnPrimary} flex-1 min-w-[200px]`} onClick={onRetry}>
          <RotateCcw size={18} aria-hidden="true" />
          Try Again
        </button>
        {missed.length > 0 ? (
          <Link to="/missed" className={`${btnSecondary} flex-1 min-w-[200px]`}>
            <BookOpen size={18} aria-hidden="true" />
            Study Missed Questions
          </Link>
        ) : null}
      </div>
    </motion.section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-page border border-line rounded-xl p-3 text-center">
      <dt className="text-xs text-ink-muted uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-navy dark:text-ink tabular-nums">{value}</dd>
    </div>
  );
}
