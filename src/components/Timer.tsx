import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

type Props = {
  running: boolean;
  onTick?: (seconds: number) => void;
};

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function Timer({ running, onTick }: Props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        onTick?.(next);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, onTick]);

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface border border-line rounded-full font-semibold text-navy dark:text-ink shadow-sm tabular-nums"
      aria-live="off"
    >
      <Clock size={16} aria-hidden="true" />
      <span aria-label={`Elapsed time ${seconds} seconds`}>{formatSeconds(seconds)}</span>
    </div>
  );
}
