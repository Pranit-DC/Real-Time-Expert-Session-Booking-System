import { motion } from 'motion/react';

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

const btnBase =
  'px-4 py-1.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-secondary)] disabled:opacity-35 disabled:cursor-not-allowed';

const Pagination = ({ page, pages, onPageChange }: PaginationProps) => {
  if (pages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-4 mt-10" aria-label="Pagination">
      <motion.button
        className={btnBase}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        whileTap={page === 1 ? undefined : { opacity: 0.6 }}
      >
        ‹ Prev
      </motion.button>
      <span className="text-sm text-[var(--color-text-secondary)] min-w-[60px] text-center">
        {page} / {pages}
      </span>
      <motion.button
        className={btnBase}
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        aria-label="Next page"
        whileTap={page === pages ? undefined : { opacity: 0.6 }}
      >
        Next ›
      </motion.button>
    </nav>
  );
};

export default Pagination;
