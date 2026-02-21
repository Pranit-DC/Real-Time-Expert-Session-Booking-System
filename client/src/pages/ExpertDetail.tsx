import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useExpert } from '../hooks/useExpert';
import { useSocket } from '../hooks/useSocket';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatDate, ratingLabel } from '../utils/format';
import { StarIcon } from '../components/ui/StarIcon';

const slotContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};

const slotItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const } },
};

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
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mb-8 text-sm text-[var(--color-text-secondary)]"
      >
        <Link to="/" className="hover:text-[var(--color-text-primary)] transition-colors">
          Experts
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text-primary)]">{expert.name}</span>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-start gap-5 mb-10"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--color-bg)] flex items-center justify-center flex-shrink-0 overflow-hidden border border-[var(--color-border)] ring-1 ring-black/5">
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
              <StarIcon size={14} />
              {ratingLabel(expert.rating)}
            </span>
            <span className="text-[var(--color-text-secondary)]">
              {expert.experience} year{expert.experience !== 1 ? 's' : ''} experience
            </span>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-[var(--color-text-primary)] text-sm leading-relaxed mb-10"
      >
        {expert.bio}
      </motion.p>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
          Available Sessions
        </h2>

        {availability.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">No availability listed.</p>
        ) : (
          <>
            <div className="flex gap-2 flex-wrap mb-6">
              {availability.map((avail) => {
                const active = avail.date === activeDateStr;
                return (
                  <motion.button
                    key={avail._id}
                    onClick={() => setSelectedDate(avail.date)}
                    whileTap={{ opacity: 0.6 }}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'text-white'
                        : 'bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="date-pill"
                        className="absolute inset-0 bg-[var(--color-text-primary)] rounded-lg"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="relative z-10">{formatDate(avail.date)}</span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {activeAvail ? (
                <motion.div
                  key={activeDateStr ?? 'slots'}
                  variants={slotContainer}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                >
                  {activeAvail.slots.map((slot) => (
                    <motion.button
                      key={slot._id}
                      variants={slotItem}
                      disabled={slot.isBooked}
                      onClick={() => !slot.isBooked && handleBookSlot(slot.time)}
                      whileTap={slot.isBooked ? undefined : { opacity: 0.7 }}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                        slot.isBooked
                          ? 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)] cursor-not-allowed line-through'
                          : 'bg-white border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)]'
                      }`}
                    >
                      {slot.time}
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.p
                  key="no-slots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-[var(--color-text-secondary)]"
                >
                  Select a date to view slots.
                </motion.p>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.section>
    </div>
  );
}
