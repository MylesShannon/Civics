import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, ThumbsUp, RefreshCw } from 'lucide-react';
import { civics2025, CATEGORIES } from '../data/civics2025';
import type { CivicsQuestion } from '../data/civics2025';
import { Flashcard } from '../components/Flashcard';
import { pickRandom } from '../utils/shuffle';
import { addReviewAgain, setLastSession } from '../utils/storage';
import { btnPrimary, btnCorrect, btnSecondary } from '../utils/styles';

export function StudyMode() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [current, setCurrent] = useState<CivicsQuestion | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [seenIds, setSeenIds] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const pool = useMemo(() => {
    if (categoryFilter === 'all') return civics2025;
    return civics2025.filter((q) => q.category === categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    setLastSession({ mode: 'study', at: new Date().toISOString() });
  }, []);

  useEffect(() => {
    setCurrent((prev) => {
      if (prev && pool.some((q) => q.id === prev.id)) return prev;
      return pickRandom(pool) ?? null;
    });
    setFlipped(false);
  }, [pool]);

  useEffect(() => {
    if (!feedback) return;
    const id = window.setTimeout(() => setFeedback(null), 1200);
    return () => window.clearTimeout(id);
  }, [feedback]);

  const next = () => {
    if (pool.length === 0) {
      setCurrent(null);
      return;
    }
    let candidate: CivicsQuestion | undefined;
    if (pool.length > 1 && current) {
      const others = pool.filter((q) => q.id !== current.id);
      candidate = pickRandom(others);
    } else {
      candidate = pickRandom(pool);
    }
    setCurrent(candidate ?? null);
    setFlipped(false);
    setSeenIds((prev) => (current && !prev.includes(current.id) ? [...prev, current.id] : prev));
  };

  const onKnewIt = () => {
    if (!current) return;
    setFeedback('Marked as known. Next!');
    next();
  };

  const onReviewAgain = () => {
    if (!current) return;
    addReviewAgain(current.id);
    setFeedback('Saved to review again.');
    next();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="m-0 mb-1 text-navy dark:text-ink text-[1.6rem] tracking-tight font-bold">
            Study Flashcards
          </h1>
          <p className="m-0 text-ink-muted text-[0.95rem]">
            Tap the card to flip. Mark cards you know or save them to review again.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label htmlFor="category-filter" className="text-sm text-ink-muted">
            Category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="font-sans px-3 py-2 border border-line rounded-[10px] bg-surface text-ink min-h-[44px]"
          >
            <option value="all">All categories ({civics2025.length})</option>
            {CATEGORIES.map((c) => {
              const count = civics2025.filter((q) => q.category === c).length;
              return (
                <option key={c} value={c}>
                  {c} ({count})
                </option>
              );
            })}
          </select>
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
            <button type="button" className={`${btnPrimary} flex-1 basis-[180px]`} onClick={next}>
              <Shuffle size={18} aria-hidden="true" />
              Next Random Question
            </button>
            <button type="button" className={`${btnCorrect} flex-1 basis-[180px]`} onClick={onKnewIt}>
              <ThumbsUp size={18} aria-hidden="true" />
              I Knew This
            </button>
            <button
              type="button"
              className={`${btnSecondary} flex-1 basis-[180px]`}
              onClick={onReviewAgain}
            >
              <RefreshCw size={18} aria-hidden="true" />
              Review Again
            </button>
          </div>

          <p
            className="m-0 text-center text-sm text-ink-muted min-h-[1.4em]"
            aria-live="polite"
          >
            {feedback ?? `Seen this session: ${seenIds.length}`}
          </p>
        </>
      ) : (
        <p className="text-center text-ink-muted p-6">No questions match the selected category.</p>
      )}
    </div>
  );
}
