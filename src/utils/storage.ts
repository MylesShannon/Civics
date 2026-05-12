const KEYS = {
  missed: 'civics:missed',
  reviewAgain: 'civics:reviewAgain',
  lastSession: 'civics:lastSession',
  quizHistory: 'civics:quizHistory',
  theme: 'civics:theme',
} as const;

export type ThemePreference = 'light' | 'dark';

export type QuizHistoryEntry = {
  date: string;
  status: 'passed' | 'failed';
  correct: number;
  incorrect: number;
  asked: number;
  durationSeconds: number;
};

type LastSession = {
  mode: 'study' | 'quiz' | 'missed';
  at: string;
};

function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    const test = '__civics_test__';
    window.localStorage.setItem(test, '1');
    window.localStorage.removeItem(test);
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJSON<T>(key: string, fallback: T): T {
  const storage = safeStorage();
  if (!storage) return fallback;
  const raw = storage.getItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / serialization errors
  }
}

function readIdSet(key: string): number[] {
  const arr = readJSON<unknown>(key, []);
  if (!Array.isArray(arr)) return [];
  const ids = arr.filter((x): x is number => typeof x === 'number' && Number.isInteger(x));
  return Array.from(new Set(ids));
}

export function getMissed(): number[] {
  return readIdSet(KEYS.missed);
}

export function setMissed(ids: number[]): void {
  writeJSON(KEYS.missed, Array.from(new Set(ids)));
}

export function addMissed(id: number): void {
  const set = new Set(getMissed());
  set.add(id);
  setMissed(Array.from(set));
}

export function clearMissed(): void {
  writeJSON(KEYS.missed, []);
}

function getReviewAgain(): number[] {
  return readIdSet(KEYS.reviewAgain);
}

export function addReviewAgain(id: number): void {
  const set = new Set(getReviewAgain());
  set.add(id);
  writeJSON(KEYS.reviewAgain, Array.from(set));
}

export function setLastSession(session: LastSession): void {
  writeJSON(KEYS.lastSession, session);
}

export function getQuizHistory(): QuizHistoryEntry[] {
  const arr = readJSON<unknown>(KEYS.quizHistory, []);
  return Array.isArray(arr) ? (arr as QuizHistoryEntry[]) : [];
}

export function addQuizHistoryEntry(entry: QuizHistoryEntry): void {
  const history = getQuizHistory();
  history.unshift(entry);
  writeJSON(KEYS.quizHistory, history.slice(0, 50));
}

export function clearQuizHistory(): void {
  writeJSON(KEYS.quizHistory, []);
}

export function setThemePreference(theme: ThemePreference): void {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.setItem(KEYS.theme, theme);
  } catch {
    // ignore quota errors
  }
}
