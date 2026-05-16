import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, Check, X } from 'lucide-react';
import type { CivicsQuestion } from '../data/civics2025';
import { getDynamicAnswer } from '../data/currentCivicsAnswers';
import { QuestionBadge } from './QuestionBadge';
import { ScrollFade } from './ScrollFade';
import { btnPrimary, btnCorrect, btnIncorrect } from '../utils/styles';

type Props = {
  question: CivicsQuestion;
  questionNumber: number;
  totalQuestions: number;
  onGrade: (correct: boolean) => void;
};

export function QuizQuestion({ question, questionNumber, totalQuestions, onGrade }: Props) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
  }, [question.id]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        onGrade(true);
      } else if (revealed && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        onGrade(false);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [revealed, onGrade]);

  const dynamicAnswers =
    question.isDynamic && question.dynamicKey ? getDynamicAnswer(question.dynamicKey) : null;

  const fadeProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25 },
      };

  return (
    <motion.div
      className="bg-surface border border-line rounded-2xl shadow-md p-6 flex flex-col gap-3.5"
      {...fadeProps}
    >
      <div className="flex justify-between items-center flex-wrap gap-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-navy text-white text-xs font-bold">
          Question {questionNumber} of up to {totalQuestions}
        </span>
        <span className="text-xs text-ink-muted text-right">{question.category}</span>
      </div>

      <h2 className="m-0 font-semibold leading-snug text-navy dark:text-ink text-[clamp(1.15rem,1.5vw+0.6rem,1.5rem)]">
        {question.question}
      </h2>

      <div className="flex flex-wrap gap-1.5">
        {question.is6520Question ? <QuestionBadge kind="6520" /> : null}
        {question.isDynamic ? <QuestionBadge kind="current" /> : null}
        {question.id === 29 ? <QuestionBadge kind="address" /> : null}
      </div>

      {!revealed ? (
        <>
          <p className="m-0 text-ink-muted text-[0.95rem]">
            Answer aloud or in your head. The real USCIS test is oral, so practice speaking.
          </p>
          <button type="button" className={`${btnPrimary} w-full`} onClick={() => setRevealed(true)}>
            <Eye size={18} aria-hidden="true" />
            Show Answer
          </button>
          <p className="m-0 text-center text-xs text-ink-muted" aria-hidden="true">
            Shortcut: Space
          </p>
        </>
      ) : (
        <>
          <ScrollFade
            wrapperClassName="relative bg-page rounded-xl border border-line"
            className="max-h-[50vh] overflow-y-auto p-4"
            fadeClassName="from-page rounded-b-xl"
          >
            <h3 className="m-0 mb-2 text-navy dark:text-ink text-[0.95rem] uppercase tracking-wider">
              Accepted answers
            </h3>
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

          <p className="mt-1 mb-0 font-semibold text-center">Did you answer correctly?</p>
          <div className="flex gap-2.5">
            <button
              type="button"
              className={`${btnCorrect} flex-1`}
              onClick={() => onGrade(true)}
              autoFocus
            >
              <Check size={18} aria-hidden="true" />
              Correct
            </button>
            <button
              type="button"
              className={`${btnIncorrect} flex-1`}
              onClick={() => onGrade(false)}
            >
              <X size={18} aria-hidden="true" />
              Incorrect
            </button>
          </div>
          <p className="m-0 text-center text-xs text-ink-muted" aria-hidden="true">
            Shortcuts: C = correct, X = incorrect
          </p>
        </>
      )}
    </motion.div>
  );
}
