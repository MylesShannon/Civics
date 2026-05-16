import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { StudyMode } from './pages/StudyMode';
import { QuizMode } from './pages/QuizMode';
import { MissedQuestionsMode } from './pages/MissedQuestionsMode';
import { Stats } from './pages/Stats';
import { AllQuestions } from './pages/AllQuestions';

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export function App() {
  const location = useLocation();
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-[880px] mx-auto px-4 pt-5 pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/study" element={<StudyMode />} />
              <Route path="/quiz" element={<QuizMode />} />
              <Route path="/missed" element={<MissedQuestionsMode />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/all" element={<AllQuestions />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </>
  );
}
