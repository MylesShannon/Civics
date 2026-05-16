import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { CivicsQuestion } from '../data/civics2025';
import { getDynamicAnswer } from '../data/currentCivicsAnswers';
import { QuestionBadge } from './QuestionBadge';
import { ScrollFade } from './ScrollFade';

type Props = {
  question: CivicsQuestion;
  flipped: boolean;
  onFlip: () => void;
};

const cardSurface =
  'absolute inset-0 p-6 flex flex-col gap-3.5 rounded-2xl bg-surface overflow-hidden';

export function Flashcard({ question, flipped, onFlip }: Props) {
  const reduceMotion = useReducedMotion();
  const [internalFlipped, setInternalFlipped] = useState(flipped);

  useEffect(() => {
    setInternalFlipped(flipped);
  }, [flipped, question.id]);

  const onFlipRef = useRef(onFlip);
  useEffect(() => {
    onFlipRef.current = onFlip;
  }, [onFlip]);

  const handleActivate = () => {
    setInternalFlipped((v) => !v);
    onFlip();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleActivate();
    }
  };

  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if (e.key !== ' ' && e.code !== 'Space') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (target?.isContentEditable) return;
      e.preventDefault();
      setInternalFlipped((v) => !v);
      onFlipRef.current();
    }
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const dynamicAnswers =
    question.isDynamic && question.dynamicKey ? getDynamicAnswer(question.dynamicKey) : null;

  if (reduceMotion) {
    return (
      <div className="w-full">
        <div
          role="button"
          tabIndex={0}
          aria-pressed={internalFlipped}
          aria-label={internalFlipped ? 'Show question' : 'Show answer'}
          onClick={handleActivate}
          onKeyDown={handleKey}
          className="relative w-full min-h-[320px] max-h-[70vh] bg-surface border border-line rounded-2xl shadow-lg cursor-pointer flex overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {internalFlipped ? (
              <motion.div
                key="back"
                className="relative inset-auto w-full p-6 flex flex-col gap-3.5 rounded-2xl bg-surface overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <FlashcardBackContent question={question} dynamicAnswers={dynamicAnswers} />
              </motion.div>
            ) : (
              <motion.div
                key="front"
                className="relative inset-auto w-full p-6 flex flex-col gap-3.5 rounded-2xl bg-surface overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <FlashcardFrontContent question={question} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full perspective-[1400px]">
      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={internalFlipped}
        aria-label={internalFlipped ? 'Show question' : 'Show answer'}
        onClick={handleActivate}
        onKeyDown={handleKey}
        animate={{ rotateY: internalFlipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full min-h-[320px] max-h-[70vh] bg-surface border border-line rounded-2xl shadow-lg cursor-pointer transform-3d"
      >
        <div className={`${cardSurface} backface-hidden`}>
          <FlashcardFrontContent question={question} />
        </div>
        <div className={`${cardSurface} backface-hidden rotate-y-180`}>
          <FlashcardBackContent question={question} dynamicAnswers={dynamicAnswers} />
        </div>
      </motion.div>
    </div>
  );
}

function FlashcardFrontContent({ question }: { question: CivicsQuestion }) {
  return (
    <>
      <CardMeta left={`Question ${question.id}`} category={question.category} />
      <p className="mt-1 font-semibold leading-snug text-navy dark:text-ink text-[clamp(1.15rem,1.5vw+0.6rem,1.45rem)]">
        {question.question}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {question.is6520Question ? <QuestionBadge kind="6520" /> : null}
        {question.isDynamic ? <QuestionBadge kind="current" /> : null}
        {question.id === 29 ? <QuestionBadge kind="address" /> : null}
      </div>
      <p className="mt-auto mb-0 text-sm text-ink-muted">
        Tap card or press Space to reveal answer.
      </p>
    </>
  );
}

function FlashcardBackContent({
  question,
  dynamicAnswers,
}: {
  question: CivicsQuestion;
  dynamicAnswers: string[] | null;
}) {
  return (
    <>
      <CardMeta
        left={`Answer${question.answers.length > 1 ? 's' : ''}`}
        category={question.category}
      />
      <ScrollFade className="h-full overflow-y-auto -mr-3 pr-3">
        {dynamicAnswers && dynamicAnswers.length > 0 ? (
            <>
              <ul className="mt-1 pl-5 flex flex-col gap-1.5 text-base text-ink list-disc">
                {dynamicAnswers.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p className="mt-3 px-3 py-2.5 border-l-[3px] border-line bg-surface-hover text-[0.85rem] text-ink-muted">
                <strong>Official PDF answer: </strong>
                {question.answers[0]}
              </p>
            </>
          ) : (
            <ul className="mt-1 pl-5 flex flex-col gap-1.5 text-base text-ink list-disc">
              {question.answers.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
          {question.note ? (
            <p className="mt-2 text-[0.85rem] text-ink-muted italic">Note: {question.note}</p>
          ) : null}
      </ScrollFade>
      <div className="flex flex-wrap gap-1.5">
        {question.isDynamic ? <QuestionBadge kind="current" /> : null}
        {question.id === 29 ? <QuestionBadge kind="address" /> : null}
      </div>
    </>
  );
}

function CardMeta({ left, category }: { left: string; category: string }) {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-navy text-white text-xs font-bold tracking-wide">
        {left}
      </span>
      <span className="text-xs text-ink-muted text-right">{category}</span>
    </div>
  );
}
