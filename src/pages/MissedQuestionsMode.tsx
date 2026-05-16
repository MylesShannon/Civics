import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Shuffle, BookOpen, Check } from 'lucide-react';
import { civics2025 } from '../data/civics2025';
import type { CivicsQuestion } from '../data/civics2025';
import { Flashcard } from '../components/Flashcard';
import { shuffle } from '../utils/shuffle';
import { clearMissed, getMissed, setMissed, setLastSession } from '../utils/storage';
import { btnPrimary, btnCorrect, btnGhost, btnGhostDanger } from '../utils/styles';

export function MissedQuestionsMode() {
  const [missedIds, setMissedIds] = useState<number[]>(() => getMissed());
  const [order, setOrder] = useState<CivicsQuestion[]>(() => {
    const initialIds = getMissed();
    const byId = new Map(civics2025.map((q) => [q.id, q]));
    return shuffle(initialIds.map((id) => byId.get(id)).filter((q): q is CivicsQuestion => Boolean(q)));
  });
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setLastSession({ mode: 'missed', at: new Date().toISOString() });
  }, []);

  const current = order[index] ?? null;

  const reshuffle = useMemo(
    () => () => {
      const ids = getMissed();
      setMissedIds(ids);
      const byId = new Map(civics2025.map((q) => [q.id, q]));
      const next = shuffle(ids.map((id) => byId.get(id)).filter((q): q is CivicsQuestion => Boolean(q)));
      setOrder(next);
      setIndex(0);
      setFlipped(false);
    },
    [],
  );

  const advance = () => {
    setIndex((i) => (order.length > 0 ? (i + 1) % order.length : 0));
    setFlipped(false);
  };

  const markLearned = () => {
    if (!current) return;
    const remaining = missedIds.filter((id) => id !== current.id);
    setMissed(remaining);
    setMissedIds(remaining);
    const newOrder = order.filter((q) => q.id !== current.id);
    setOrder(newOrder);
    setIndex((i) => (newOrder.length === 0 ? 0 : i % newOrder.length));
    setFlipped(false);
  };

  const onClearAll = () => {
    if (!window.confirm('Clear your missed-questions list?')) return;
    clearMissed();
    setMissedIds([]);
    setOrder([]);
    setIndex(0);
    setFlipped(false);
  };

  if (missedIds.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="m-0 mb-1 text-navy dark:text-ink text-[1.6rem] tracking-tight font-bold">
            Study Missed Questions
          </h1>
          <p className="m-0 text-ink-muted text-[0.95rem]">
            Re-study questions you missed in the quiz.
          </p>
        </div>
        <div className="bg-surface border border-line rounded-2xl p-8 px-5 flex flex-col items-center gap-2.5 shadow-sm text-ink-muted text-center">
          <BookOpen size={32} aria-hidden="true" />
          <h2 className="mt-1 m-0 text-navy dark:text-ink text-xl font-bold">
            No missed questions yet
          </h2>
          <p>Take a practice quiz first. Any questions you grade incorrect will show up here.</p>
          <Link to="/quiz" className={`${btnPrimary} mt-2`}>
            Take a Practice Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="m-0 mb-1 text-navy dark:text-ink text-[1.6rem] tracking-tight font-bold">
            Study Missed Questions
          </h1>
          <p className="m-0 text-ink-muted text-[0.95rem]">
            {missedIds.length} question{missedIds.length === 1 ? '' : 's'} to review.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" className={btnGhost} onClick={reshuffle}>
            <Shuffle size={16} aria-hidden="true" />
            Reshuffle
          </button>
          <button type="button" className={btnGhostDanger} onClick={onClearAll}>
            <Trash2 size={16} aria-hidden="true" />
            Clear all
          </button>
        </div>
      </div>

      {current ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Flashcard question={current} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap gap-2.5">
            <button type="button" className={`${btnPrimary} flex-1 basis-[180px]`} onClick={advance}>
              <Shuffle size={18} aria-hidden="true" />
              Next
            </button>
            <button
              type="button"
              className={`${btnCorrect} flex-1 basis-[180px]`}
              onClick={markLearned}
            >
              <Check size={18} aria-hidden="true" />
              I Know This Now
            </button>
          </div>

          <p
            className="m-0 text-center text-sm text-ink-muted min-h-[1.4em]"
            aria-live="polite"
          >
            Card {Math.min(index + 1, order.length)} of {order.length}
          </p>
        </>
      ) : (
        <p className="text-center text-ink-muted p-6">No card to display.</p>
      )}
    </div>
  );
}
