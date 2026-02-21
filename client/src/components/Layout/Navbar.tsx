import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';

const navLinks = [
  { to: '/', label: 'Experts', end: true },
  { to: '/my-bookings', label: 'My Bookings', end: false },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
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
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/[0.04]'
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
        </div>
      </nav>
    </header>
  );
};

export default Navbar;


