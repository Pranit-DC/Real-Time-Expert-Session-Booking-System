import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <nav className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-[15px] font-semibold text-[var(--color-text-primary)] tracking-tight no-underline"
        >
          ExpertBook
        </NavLink>

        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm no-underline transition-colors ${
                isActive
                  ? 'text-[var(--color-accent)] font-medium'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`
            }
          >
            Experts
          </NavLink>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `text-sm no-underline transition-colors ${
                isActive
                  ? 'text-[var(--color-accent)] font-medium'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`
            }
          >
            My Bookings
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

