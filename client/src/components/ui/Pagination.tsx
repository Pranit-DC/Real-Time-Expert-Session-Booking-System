interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

const btnBase =
  'px-4 py-1.5 text-sm border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] cursor-pointer transition-colors hover:bg-[var(--color-bg)] disabled:opacity-35 disabled:cursor-not-allowed';

const Pagination = ({ page, pages, onPageChange }: PaginationProps) => {
  if (pages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-4 mt-10" aria-label="Pagination">
      <button
        className={btnBase}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        ‹ Prev
      </button>
      <span className="text-sm text-[var(--color-text-secondary)] min-w-[60px] text-center">
        {page} / {pages}
      </span>
      <button
        className={btnBase}
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        aria-label="Next page"
      >
        Next ›
      </button>
    </nav>
  );
};

export default Pagination;
