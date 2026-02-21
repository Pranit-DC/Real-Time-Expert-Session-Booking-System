import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useExpert } from '../hooks/useExpert';
import { useSocket } from '../hooks/useSocket';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatDate, ratingLabel } from '../utils/format';

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function ExpertDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: expert, isLoading, isError, error, refetch, markSlotBooked } = useExpert(id!);

  useSocket({
    expertId: id!,
    onSlotBooked: ({ date, timeSlot }) => {
      markSlotBooked(date, timeSlot);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !expert) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <ErrorMessage message={error?.message ?? 'Expert not found.'} onRetry={refetch} />
      </div>
    );
  }

  const availability = expert.availability ?? [];
  const activeDateStr = selectedDate ?? availability[0]?.date ?? null;
  const activeAvail = availability.find((a) => a.date === activeDateStr);

  const handleBookSlot = (timeSlot: string) => {
    navigate(`/experts/${expert._id}/book`, {
      state: { date: activeDateStr, timeSlot, expertName: expert.name },
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* breadcrumb */}
      <nav className="mb-8 text-sm text-[var(--color-text-secondary)]">
        <Link to="/" className="hover:text-[var(--color-text-primary)] transition">
          Experts
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text-primary)]">{expert.name}</span>
      </nav>

      {/* expert header */}
      <div className="flex items-start gap-5 mb-10">
        <div className="w-16 h-16 rounded-full bg-[var(--color-bg)] flex items-center justify-center flex-shrink-0 overflow-hidden border border-[var(--color-border)]">
          {expert.avatar ? (
            <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-semibold text-[var(--color-text-secondary)]">
              {expert.name[0]}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight">
            {expert.name}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{expert.category}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <StarIcon />
              {ratingLabel(expert.rating)}
            </span>
            <span className="text-[var(--color-text-secondary)]">
              {expert.experience} year{expert.experience !== 1 ? 's' : ''} experience
            </span>
          </div>
        </div>
      </div>

      {/* bio */}
      <p className="text-[var(--color-text-primary)] text-sm leading-relaxed mb-10">{expert.bio}</p>

      {/* availability */}
      <section>
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
          Available Sessions
        </h2>

        {availability.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">No availability listed.</p>
        ) : (
          <>
            {/* date tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {availability.map((avail) => {
                const active = avail.date === activeDateStr;
                return (
                  <button
                    key={avail._id}
                    onClick={() => setSelectedDate(avail.date)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                      ${
                        active
                          ? 'bg-[var(--color-text-primary)] text-white'
                          : 'bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]'
                      }`}
                  >
                    {formatDate(avail.date)}
                  </button>
                );
              })}
            </div>

            {/* slot grid */}
            {activeAvail ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {activeAvail.slots.map((slot) => (
                  <button
                    key={slot._id}
                    disabled={slot.isBooked}
                    onClick={() => handleBookSlot(slot.time)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition
                      ${
                        slot.isBooked
                          ? 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)] cursor-not-allowed line-through'
                          : 'bg-white border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)]'
                      }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">Select a date to view slots.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
