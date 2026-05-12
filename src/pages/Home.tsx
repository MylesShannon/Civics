import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardCheck, Repeat, FileText } from 'lucide-react';
import { civics2025 } from '../data/civics2025';
import { currentCivicsAnswers } from '../data/currentCivicsAnswers';
import { getMissed } from '../utils/storage';
import { PASS_CORRECT, MAX_QUESTIONS, FAIL_INCORRECT } from '../utils/quizLogic';
import { btnPrimary, btnSecondary } from '../utils/styles';

const btnLg = 'px-[22px] py-[14px] text-[1.05rem] rounded-[14px]';

export function Home() {
  const missedCount = getMissed().length;

  return (
    <div className="flex flex-col gap-7">
      <motion.section
        className="border border-line rounded-2xl p-8 px-6 text-center shadow-md bg-gradient-to-b from-surface to-page"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="m-0 mb-2 text-navy dark:text-ink tracking-tight font-bold text-[clamp(1.6rem,2vw+1rem,2.25rem)]">
          USCIS 2025 Civics Trainer
        </h1>
        <p className="m-0 mb-6 text-ink-muted text-[1.05rem]">
          Practice the official USCIS civics interview questions.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/study" className={`${btnPrimary} ${btnLg}`}>
            <BookOpen size={20} aria-hidden="true" />
            Study Flashcards
          </Link>
          <Link to="/quiz" className={`${btnPrimary} ${btnLg}`}>
            <ClipboardCheck size={20} aria-hidden="true" />
            Practice Quiz
          </Link>
          <Link to="/missed" className={`${btnSecondary} ${btnLg}`}>
            <Repeat size={20} aria-hidden="true" />
            Study Missed Questions
            {missedCount > 0 ? (
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-2 ml-1.5 rounded-full bg-gold text-navy text-xs font-bold">
                {missedCount}
              </span>
            ) : null}
          </Link>
        </div>
      </motion.section>

      <section
        className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3"
        aria-label="About this trainer"
      >
        <InfoCard title="How the real test works">
          The USCIS officer asks up to {MAX_QUESTIONS} of the {civics2025.length} civics questions.
          You must answer at least {PASS_CORRECT} correctly to pass. The test ends as soon as you
          either reach {PASS_CORRECT} correct or {FAIL_INCORRECT} incorrect answers.
        </InfoCard>
        <InfoCard title="Self-grading quiz">
          The actual test is oral, not multiple choice. In Quiz mode, answer aloud, reveal the
          accepted answers, and grade yourself honestly.
        </InfoCard>
        <InfoCard title="Current answers">
          Some questions (President, your governor, etc.) change over time or depend on your
          address. This app is configured for{' '}
          <strong>
            {currentCivicsAnswers.jurisdiction.city}, {currentCivicsAnswers.jurisdiction.state}
          </strong>
          , verified {currentCivicsAnswers.lastVerified}.
        </InfoCard>
      </section>

      <footer className="flex flex-col items-center gap-2 text-center text-[0.85rem] text-ink-muted border-t border-line pt-4">
        <p className="m-0">
          This app is for study purposes only and is not affiliated with USCIS.
        </p>
        <a
          href="/2025-Civics-Test-128-Questions-and-Answers.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-navy dark:text-ink hover:text-red dark:hover:text-fail-text font-semibold no-underline hover:underline"
        >
          <FileText size={14} aria-hidden="true" />
          View the official USCIS 2025 civics test PDF
        </a>
      </footer>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-4.5 shadow-sm">
      <h2 className="m-0 mb-2 text-navy dark:text-ink text-[1.05rem]">{title}</h2>
      <p className="m-0 text-ink-muted text-[0.95rem]">{children}</p>
    </div>
  );
}
