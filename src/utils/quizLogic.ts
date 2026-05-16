import type { CivicsQuestion } from '../data/civics2025';
import { shuffle } from './shuffle';

export const PASS_CORRECT = 12;
export const FAIL_INCORRECT = 9;
export const MAX_QUESTIONS = 20;

export type QuizStatus = 'in_progress' | 'passed' | 'failed';

type QuizCounts = {
  correct: number;
  incorrect: number;
  asked: number;
};

export function pickQuizQuestions(
  pool: readonly CivicsQuestion[],
  count: number = MAX_QUESTIONS,
): CivicsQuestion[] {
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

export function evaluateQuiz({ correct, incorrect, asked }: QuizCounts): QuizStatus {
  if (correct >= PASS_CORRECT) return 'passed';
  if (incorrect >= FAIL_INCORRECT) return 'failed';
  if (asked >= MAX_QUESTIONS) {
    return correct >= PASS_CORRECT ? 'passed' : 'failed';
  }
  return 'in_progress';
}
