import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExperts } from '../hooks/useExperts';
import { useDebounce } from '../hooks/useDebounce';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Pagination from '../components/ui/Pagination';
import { ratingLabel } from '../utils/format';
import { StarIcon } from '../components/ui/StarIcon';

const CATEGORIES = ['All', 'ML', 'System Design', 'Frontend', 'Backend', 'DevOps'];

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
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] tracking-tight">
          Find an Expert
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)] text-base">
          Book a one-on-one session with professionals in tech.
        </p>
      </div>

      <div className="mb-6">
        <input
          type="search"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Search by name or expertise…"
          className="w-full sm:w-80 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => {
          const active = (cat === 'All' && !category) || cat === category;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                ${
                  active
                    ? 'bg-[var(--color-text-primary)] text-white'
                    : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]'
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <ErrorMessage
          message={error?.message ?? 'Failed to load experts.'}
          onRetry={refetch}
        />
      )}

      {data && (
        <>
          {data.experts.length === 0 ? (
            <p className="text-center text-[var(--color-text-secondary)] py-24">
              No experts found.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.experts.map((expert) => (
                <Link
                  key={expert._id}
                  to={`/experts/${expert._id}`}
                  className="group block bg-white rounded-2xl border border-[var(--color-border)] p-5 hover:border-[var(--color-text-primary)]/20 hover:shadow-sm transition"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-bg)] flex items-center justify-center mb-4 overflow-hidden">
                    {expert.avatar ? (
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-[var(--color-text-secondary)]">
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
              ))}
            </div>
          )}

          {data.pages > 1 && (
            <div className="mt-10">
              <Pagination
                page={data.page}
                pages={data.pages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
