# USCIS 2025 Civics Trainer

A front-end-only React app for studying the official **USCIS 2025 civics test** (the 128-question version). It includes a flashcard study mode, a self-graded practice quiz that follows the real USCIS pass/fail rules, and a review mode for questions you've missed.

There is no backend, no authentication, no database, and no analytics. Everything runs in the browser, and your progress is stored only in `localStorage` on your device.

## Project overview

- **Source of truth:** the official USCIS PDF, included locally at [`public/2025-Civics-Test-128-Questions-and-Answers.pdf`](public/2025-Civics-Test-128-Questions-and-Answers.pdf) and served as a static asset at `/2025-Civics-Test-128-Questions-and-Answers.pdf`. The Home page footer links to it, and all 128 questions and their accepted answers are transcribed verbatim into [`src/data/civics2025.ts`](src/data/civics2025.ts).
- **Modes:**
  - **Flashcard Study** — random questions with a flip animation; mark cards as known or save for review.
  - **Practice Quiz** — up to 20 randomly chosen questions, oral-style self-grading, ends as soon as you can pass or fail.
  - **Missed Questions** — re-study the questions you graded incorrect, persisted across sessions.
  - **Stats** — KPIs (pass rate, accuracy, best score, average time) plus your last 10 quiz attempts, all from `localStorage`.
- **Current officeholder data** is kept separately in [`src/data/currentCivicsAnswers.ts`](src/data/currentCivicsAnswers.ts) and can be re-verified without touching the question bank.

## Setup

Requires Node.js 18+ (tested on Node 22) and Yarn 4 (pinned via `packageManager` in `package.json`). If you have [Corepack](https://nodejs.org/api/corepack.html) enabled, it will auto-install the right Yarn version on first use; otherwise install Yarn manually.

```bash
yarn install
yarn dev
```

Then open the URL printed by Vite (typically `http://localhost:5173`).

## Build

```bash
yarn build
yarn preview
```

`yarn build` runs the TypeScript project references (`tsc -b`) then a Vite production build into `dist/`. `yarn preview` serves the built output locally for verification.

## Tech stack

- **[Vite](https://vitejs.dev/)** — fast dev server and bundler.
- **React 18 + TypeScript** — modern functional components and hooks, strict TS.
- **[react-router-dom](https://reactrouter.com/)** — client-side routes for `/`, `/study`, `/quiz`, `/missed`, `/stats`.
- **[Tailwind CSS v4](https://tailwindcss.com/)** with a custom CSS-first theme defined in [`src/styles.css`](src/styles.css) via the `@theme` directive.
- **[framer-motion](https://www.framer.com/motion/)** — flashcard flip, page transitions, animated progress bar. Respects `prefers-reduced-motion`.
- **[lucide-react](https://lucide.dev/)** — icons.

No state library, no UI kit, no test framework. The app is intentionally small.

### Custom theme

The patriotic palette and dark-mode overrides live entirely in [`src/styles.css`](src/styles.css):

- The light theme is declared inside an `@theme { ... }` block, exposing each color as a Tailwind utility (e.g. `--color-navy` becomes `bg-navy`, `text-navy`, `border-navy`).
- Dark mode swaps the same CSS variables under a `[data-theme='dark']` selector, so every utility theme-switches automatically without a `dark:` variant.
- A `@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *))` line wires Tailwind's `dark:` modifier to the same selector for the few cases that need a different value rather than a different variable.

## Project structure

```
public/
  2025-Civics-Test-128-Questions-and-Answers.pdf   # USCIS source PDF, served at /...pdf
  favicon.svg
src/
  data/
    civics2025.ts             # 128 official questions transcribed from the PDF
    currentCivicsAnswers.ts   # Current officeholder data (NH / Manchester)
  components/
    Header.tsx
    Flashcard.tsx
    QuizQuestion.tsx
    ProgressBar.tsx
    ResultScreen.tsx
    Timer.tsx
    QuestionBadge.tsx
    ThemeToggle.tsx
  pages/
    Home.tsx
    StudyMode.tsx
    QuizMode.tsx
    MissedQuestionsMode.tsx
    Stats.tsx
  utils/
    shuffle.ts
    quizLogic.ts
    storage.ts
    styles.ts                 # Shared Tailwind class strings (button variants, cn helper)
  App.tsx
  main.tsx
  styles.css                  # Tailwind import + @theme palette + dark-mode overrides
```

## USCIS quiz rules

The real test is **oral**, not multiple choice. The USCIS officer asks you up to **20** of the **128** civics questions and you must answer each aloud. The full rules implemented here:

- **Maximum questions asked:** 20
- **Pass threshold:** 12 correct (the test ends immediately when you reach 12)
- **Fail threshold:** 9 incorrect (the test ends immediately when you reach 9)
- If you reach 20 questions without hitting either threshold, you pass if `correct >= 12`, otherwise you fail.

These constants live in [`src/utils/quizLogic.ts`](src/utils/quizLogic.ts):

```ts
export const PASS_CORRECT = 12;
export const FAIL_INCORRECT = 9;
export const MAX_QUESTIONS = 20;
```

### 65/20 special consideration

If you are 65 or older and have lived in the U.S. as a lawful permanent resident for at least 20 years, USCIS asks you only 10 questions out of a curated set of 20 (marked with an asterisk in the official PDF), and you need 6 correct to pass. Those questions are flagged in `civics2025.ts` with `is6520Question: true` and shown with a "65/20 question" badge in the UI. There are exactly 20 of them — verified against the PDF.

## Self-grading design

The real civics interview is oral. There are no multiple-choice options to grade against, and many answers have several accepted variants. The trainer mirrors that:

1. You read the question and answer it aloud (or in your head).
2. You press **Show Answer** to reveal every accepted answer from the official PDF.
3. You press **Correct** or **Incorrect** to grade yourself honestly.

This keeps the practice experience close to the real test and avoids fragile string matching against the many accepted variants in the official answer key.

Keyboard shortcuts in Quiz mode:

- `Space` — show the answer
- `C` — mark correct
- `X` — mark incorrect

## Dynamic / current-officeholder answers

Some questions in the official test have answers that **change over time** (e.g. President, Vice President, Speaker of the House, Chief Justice) or **depend on your address** (your governor, your state's senators, your U.S. representative, your state's capital).

These questions are marked in [`src/data/civics2025.ts`](src/data/civics2025.ts) with `isDynamic: true` and a `dynamicKey`. At render time, the app substitutes the current answer from [`src/data/currentCivicsAnswers.ts`](src/data/currentCivicsAnswers.ts) and shows a verification badge so you remember to re-check it. The official PDF text (which simply points to `uscis.gov/citizenship/testupdates`) is still shown as a fallback annotation.

## Local storage

The app persists the following keys to `localStorage`:

| Key                  | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| `civics:missed`      | IDs of questions you graded incorrect in the quiz       |
| `civics:reviewAgain` | IDs you saved from Study mode for later review          |
| `civics:lastSession` | Last mode visited and timestamp                         |
| `civics:quizHistory` | Last 50 quiz attempts (status, score, duration) — surfaced on the Stats page |
| `civics:theme`       | `"light"` or `"dark"` — your chosen theme               |

You can clear missed questions from the Missed Questions page, and clear quiz history from the Stats page.

## Dark mode

A theme toggle in the header switches between light and dark mode. On first visit the app follows your system's `prefers-color-scheme`, and any manual override is persisted to `localStorage`. An inline script in `index.html` applies the saved theme before React renders, so there is no flash of the wrong theme on load.

## Accessibility

- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<dl>`, etc.).
- Keyboard navigation for all interactive elements; flashcard flips on `Space` / `Enter`.
- Quiz keyboard shortcuts (`Space`, `C`, `X`).
- Visible focus rings on every interactive element.
- All icons have `aria-hidden`; buttons have descriptive labels.
- Tap targets are at least 44px.
- `@media (prefers-reduced-motion: reduce)` disables non-essential animation; the flashcard falls back to a cross-fade instead of a 3D flip.

## Current / Location-Specific Civics Answers

Some USCIS civics questions have answers that change over time or depend on the applicant's home address.

This project keeps those answers in:

`src/data/currentCivicsAnswers.ts`

Last verified: May 11, 2026

Configured for:
- State: New Hampshire
- City: Manchester

Important:
Re-check this file before using the app for real interview prep, especially after elections, appointments, resignations, or moving to a new address.

## Disclaimer

This app is for study purposes only and is not affiliated with USCIS. The official questions and accepted answers come from the USCIS PDF in [`public/`](public/), which is also linked from the Home page footer. For the most up-to-date information about the civics test, visit [uscis.gov/citizenship](https://www.uscis.gov/citizenship).

## License

[MIT](LICENSE) © 2026 Myles Shannon. The official USCIS questions, accepted answers, and the included PDF are works of the U.S. Federal Government and are not covered by this license — see the note at the end of [`LICENSE`](LICENSE).
