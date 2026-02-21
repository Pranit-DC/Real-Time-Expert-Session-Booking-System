import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { ThemeToggle } from '../ui/ThemeToggle';

const navLinks = [
  { to: '/', label: 'Experts', end: true },
  { to: '/my-bookings', label: 'My Bookings', end: false },
];

const Navbar = () => {
  return (
    <header className="fixed top-3 left-4 right-4 z-50 pointer-events-none">
      <nav className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between bg-white/75 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl border border-[var(--color-border)] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)] transition-colors pointer-events-auto">
        <NavLink
          to="/"
          className="text-[15px] font-semibold text-[var(--color-text-primary)] tracking-tight"
        >
          ExpertBook
        </NavLink>

        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'text-[var(--color-accent)] font-medium'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.07]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-[var(--color-accent)]/8 rounded-lg"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <div className="w-px h-4 bg-[var(--color-border)] mx-1" />

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

