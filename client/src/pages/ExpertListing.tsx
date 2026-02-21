import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useExperts } from '../hooks/useExperts';
import { useDebounce } from '../hooks/useDebounce';
import Skeleton from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';
import Pagination from '../components/ui/Pagination';
import { ratingLabel } from '../utils/format';
import { StarIcon } from '../components/ui/StarIcon';

const CATEGORIES = ['All', 'ML', 'System Design', 'Frontend', 'Backend', 'DevOps'];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ExpertListing() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 400);

  const { data, isLoading, isError, error, refetch } = useExperts({
    page,
    category: category || undefined,
    search: search || undefined,
  });

  const handleCategoryChange = (cat: string) => {
    setCategory(cat === 'All' ? '' : cat);
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-10"
      >
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] tracking-tight">
          Find an Expert
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)] text-base">
          Book a one-on-one session with professionals in tech.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.06, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-6"
      >
        <input
          type="search"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Search by name or expertise…"
          className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-shadow"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex gap-2 flex-wrap mb-8"
      >
        {CATEGORIES.map((cat) => {
          const active = (cat === 'All' && !category) || cat === category;
          return (
            <motion.button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              whileTap={{ opacity: 0.6 }}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active
                  ? 'text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 bg-[var(--color-text-primary)] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 space-y-3">
                <Skeleton className="w-11 h-11 rounded-full" />
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <div className="flex justify-between pt-1">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {isError && (
          <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ErrorMessage message={error?.message ?? 'Failed to load experts.'} onRetry={refetch} />
          </motion.div>
        )}

        {data && Array.isArray(data.experts) && (
          <motion.div key={`${page}-${category}-${search}`}>
            {data.experts.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[var(--color-text-secondary)] py-24"
              >
                No experts found.
              </motion.p>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {data.experts.map((expert) => (
                  <motion.div key={expert._id} variants={cardVariant}>
                    <Link
                      to={`/experts/${expert._id}`}
                      className="group block bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 hover:border-[var(--color-border)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-shadow duration-300"
                    >
                      <div className="w-11 h-11 rounded-full bg-[var(--color-bg)] flex items-center justify-center mb-4 overflow-hidden ring-1 ring-black/5">
                        {expert.avatar ? (
                          <img
                            src={expert.avatar}
                            alt={expert.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-base font-semibold text-[var(--color-text-secondary)]">
                            {expert.name[0]}
                          </span>
                        )}
                      </div>

                      <p className="font-semibold text-[var(--color-text-primary)] text-sm leading-snug">
                        {expert.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 mb-3">
                        {expert.category}
                      </p>

                      <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-4 leading-relaxed">
                        {expert.bio}
                      </p>

                      <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                        <span className="flex items-center gap-1 text-amber-500 font-medium">
                          <StarIcon size={12} />
                          {ratingLabel(expert.rating)}
                        </span>
                        <span>{expert.experience} yr{expert.experience !== 1 ? 's' : ''}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {data.pages > 1 && (
              <div className="mt-10">
                <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

