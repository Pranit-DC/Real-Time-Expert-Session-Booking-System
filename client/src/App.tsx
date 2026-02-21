import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Layout/Navbar';
import ClickSpark from './components/ui/ClickSpark';
import ExpertListing from './pages/ExpertListing';
import ExpertDetail from './pages/ExpertDetail';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const } },
};

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <ClickSpark
      sparkColor="#1d1d1f"
      sparkSize={8}
      sparkRadius={18}
      sparkCount={8}
      duration={380}
      easing="ease-out"
      extraScale={1.1}
    >
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Navbar />
        <main className="pt-[72px]">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageShell><ExpertListing /></PageShell>} />
              <Route path="/experts/:id" element={<PageShell><ExpertDetail /></PageShell>} />
              <Route path="/experts/:id/book" element={<PageShell><BookingPage /></PageShell>} />
              <Route path="/my-bookings" element={<PageShell><MyBookings /></PageShell>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </ClickSpark>
  );
}

