import { motion } from 'framer-motion';
import { PASS_CORRECT, FAIL_INCORRECT } from '../utils/quizLogic';

type Props = {
  correct: number;
  incorrect: number;
};

export function ProgressBar({ correct, incorrect }: Props) {
  const correctPct = Math.min(100, (correct / PASS_CORRECT) * 100);
  const incorrectPct = Math.min(100, (incorrect / FAIL_INCORRECT) * 100);

  return (
    <div
      className="flex flex-col gap-2.5"
      role="group"
      aria-label="Quiz progress toward pass and fail thresholds"
    >
      <Row
        label="Correct"
        count={correct}
        total={PASS_CORRECT}
        percent={correctPct}
        fillClass="bg-gradient-to-r from-success to-[#2dab66]"
        ariaLabel={`Correct ${correct} of ${PASS_CORRECT} needed to pass`}
      />
      <Row
        label="Incorrect"
        count={incorrect}
        total={FAIL_INCORRECT}
        percent={incorrectPct}
        fillClass="bg-gradient-to-r from-red to-[#d33b66]"
        ariaLabel={`Incorrect ${incorrect} of ${FAIL_INCORRECT} that would fail`}
      />
    </div>
  );
}

type RowProps = {
  label: string;
  count: number;
  total: number;
  percent: number;
  fillClass: string;
  ariaLabel: string;
};

function Row({ label, count, total, percent, fillClass, ariaLabel }: RowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex justify-between items-center text-sm text-ink-muted"
        aria-label={ariaLabel}
      >
        <span>{label}</span>
        <span className="font-bold text-ink tabular-nums">
          {count} / {total}
        </span>
      </div>
      <div
        className="h-2.5 bg-surface border border-line rounded-full overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className={`h-full rounded-full ${fillClass}`}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
