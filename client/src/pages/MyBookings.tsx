import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useBookingsByEmail } from '../hooks/useBookings';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/format';
import type { Booking } from '../types';

export default function MyBookings() {
  const location = useLocation();
  const prefilled = (location.state as { email?: string } | null)?.email ?? '';
  const [emailInput, setEmailInput] = useState(prefilled);
  const [submittedEmail, setSubmittedEmail] = useState(prefilled);

  const { data: bookings, isLoading, isError, error } = useBookingsByEmail(submittedEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedEmail(emailInput.trim());
  };

  const expertName = (booking: Booking): string => {
    if (typeof booking.expertId === 'string') return 'Expert';
    return booking.expertId.name;
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight mb-2">
        My Bookings
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">
        Enter the email address you used when booking a session.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
        <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="you@example.com"
          required
          className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[var(--color-text-primary)] text-white text-sm font-medium hover:opacity-80 transition"
        >
          Look up
        </button>
      </form>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="md" />
        </div>
      )}

      {isError && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
          {error?.message ?? 'Failed to load bookings.'}
        </div>
      )}

      {bookings && (
        <>
          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[var(--color-text-secondary)] text-sm mb-4">
                No bookings found for this email.
              </p>
              <Link to="/" className="text-[var(--color-accent)] text-sm hover:underline">
                Browse experts
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {bookings.map((booking) => (
                <li
                  key={booking._id}
                  className="bg-white border border-[var(--color-border)] rounded-2xl px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {expertName(booking)}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        {formatDate(booking.date)} · {booking.timeSlot}
                      </p>
                      {booking.notes && (
                        <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                          {booking.notes}
                        </p>
                      )}
                    </div>
                    <Badge status={booking.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
