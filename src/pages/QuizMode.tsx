import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { civics2025 } from '../data/civics2025';
import type { CivicsQuestion } from '../data/civics2025';
import { QuizQuestion } from '../components/QuizQuestion';
import { ProgressBar } from '../components/ProgressBar';
import { Timer } from '../components/Timer';
import { ResultScreen } from '../components/ResultScreen';
import { evaluateQuiz, pickQuizQuestions, MAX_QUESTIONS } from '../utils/quizLogic';
import {
  addMissed,
  addQuizHistoryEntry,
  setLastSession,
  setMissed,
  getMissed,
} from '../utils/storage';

export function QuizMode() {
  const [questions, setQuestions] = useState<CivicsQuestion[]>(() => pickQuizQuestions(civics2025));
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [missedQs, setMissedQs] = useState<CivicsQuestion[]>([]);
  const [seconds, setSeconds] = useState(0);

  const status = useMemo(
    () => evaluateQuiz({ correct, incorrect, asked: index }),
    [correct, incorrect, index],
  );
  const isFinished = status !== 'in_progress';

  const recordedRef = useRef(false);

  useEffect(() => {
    setLastSession({ mode: 'quiz', at: new Date().toISOString() });
  }, []);

  useEffect(() => {
    if (!isFinished || recordedRef.current) return;
    recordedRef.current = true;

    const existingMissed = new Set(getMissed());
    missedQs.forEach((q) => existingMissed.add(q.id));
    setMissed(Array.from(existingMissed));

    addQuizHistoryEntry({
      date: new Date().toISOString(),
      status: status === 'passed' ? 'passed' : 'failed',
      correct,
      incorrect,
      asked: index,
      durationSeconds: seconds,
    });
  }, [isFinished, status, missedQs, correct, incorrect, index, seconds]);

  const handleGrade = (isCorrect: boolean) => {
    const current = questions[index];
    if (!current) return;
    if (isCorrect) {
      setCorrect((c) => c + 1);
    } else {
      setIncorrect((c) => c + 1);
      setMissedQs((prev) => (prev.some((q) => q.id === current.id) ? prev : [...prev, current]));
      addMissed(current.id);
    }
    setIndex((i) => i + 1);
  };

  const handleRetry = () => {
    recordedRef.current = false;
    setQuestions(pickQuizQuestions(civics2025));
    setIndex(0);
    setCorrect(0);
    setIncorrect(0);
    setMissedQs([]);
    setSeconds(0);
  };

  const currentQuestion = questions[index];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="m-0 mb-1 text-navy dark:text-ink text-[1.6rem] tracking-tight font-bold">
            Practice Quiz
          </h1>
          <p className="m-0 text-ink-muted text-[0.95rem]">
            Up to {MAX_QUESTIONS} questions. The quiz ends as soon as you can pass or fail.
          </p>
        </div>
        <Timer running={!isFinished} onTick={setSeconds} />
      </div>

      <ProgressBar correct={correct} incorrect={incorrect} />

      <AnimatePresence mode="wait">
        {isFinished ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ResultScreen
              status={status}
              correct={correct}
              incorrect={incorrect}
              asked={index}
              durationSeconds={seconds}
              missed={missedQs}
              onRetry={handleRetry}
            />
          </motion.div>
        ) : currentQuestion ? (
          <QuizQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={index + 1}
            totalQuestions={MAX_QUESTIONS}
            onGrade={handleGrade}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
