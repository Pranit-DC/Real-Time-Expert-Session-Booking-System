import { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCreateBooking } from '../hooks/useBookings';
import { formatDate } from '../utils/format';

const NOTES_MAX = 300;

interface BookingLocationState {
  date: string;
  timeSlot: string;
  expertName: string;
}

export default function BookingPage() {
  const { id: expertId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as BookingLocationState | null;

  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [fieldErrors, setFieldErrors] = useState<Partial<typeof form>>({});

  const { mutate, isPending, error } = useCreateBooking();

  if (!state?.date || !state?.timeSlot) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-secondary)] flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-secondary)]"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </div>
          <p className="text-[var(--color-text-primary)] font-medium mb-1">No session selected</p>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6">
            Please choose a time slot from the expert's profile.
          </p>
          <Link
            to={expertId ? `/experts/${expertId}` : '/'}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:opacity-75 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Go back
          </Link>
        </motion.div>
      </div>
    );
  }

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'A valid email is required.';
    if (!form.phone.trim() || !/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
      errs.phone = 'A valid phone number is required.';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    mutate(
      { expertId: expertId!, ...form, date: state.date, timeSlot: state.timeSlot },
      { onSuccess: () => navigate('/my-bookings', { state: { email: form.email } }) }
    );
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mb-8 text-sm text-[var(--color-text-secondary)] flex items-center gap-1.5 flex-wrap"
      >
        <Link to="/" className="hover:text-[var(--color-text-primary)] transition-colors">Experts</Link>
        <span className="text-[var(--color-border)]">/</span>
        <Link to={`/experts/${expertId}`} className="hover:text-[var(--color-text-primary)] transition-colors">{state.expertName}</Link>
        <span className="text-[var(--color-border)]">/</span>
        <span className="text-[var(--color-text-primary)]">Book Session</span>
      </motion.nav>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight mb-6"
      >
        Book a Session
      </motion.h1>

      {/* Session summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.07, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-[var(--color-accent)]/[0.06] border border-[var(--color-accent)]/20 rounded-2xl px-5 py-4 mb-8"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent)]"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{state.expertName}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              {formatDate(state.date)} · {state.timeSlot}
            </p>
          </div>
        </div>
      </motion.div>

      {/* API error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-6"
          >
            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
              {error.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        <Field label="Full Name" error={fieldErrors.name}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            maxLength={80}
            autoComplete="name"
            className={inputCls(Boolean(fieldErrors.name))}
          />
        </Field>

        <Field label="Email Address" error={fieldErrors.email}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            maxLength={100}
            autoComplete="email"
            className={inputCls(Boolean(fieldErrors.email))}
          />
        </Field>

        <Field label="Phone Number" hint="Include country code, e.g. +91 98765 43210" error={fieldErrors.phone}>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            maxLength={20}
            autoComplete="tel"
            className={inputCls(Boolean(fieldErrors.phone))}
          />
        </Field>

        <Field
          label="Notes"
          hint={`${form.notes.length} / ${NOTES_MAX}`}
          hintAlign="right"
          optional
        >
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Topics you'd like to cover, questions, or context for the session…"
            rows={3}
            maxLength={NOTES_MAX}
            className={inputCls(false) + ' resize-none'}
          />
        </Field>

        <motion.button
          type="submit"
          disabled={isPending}
          whileTap={isPending ? undefined : { opacity: 0.8, scale: 0.995 }}
          className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-white text-sm font-semibold tracking-wide hover:opacity-90 disabled:opacity-50 transition-opacity mt-2"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Booking…
            </span>
          ) : 'Confirm Booking'}
        </motion.button>

        <p className="text-xs text-center text-[var(--color-text-tertiary)] pt-1">
          Your information is only used for this booking and is never shared.
        </p>
      </motion.form>
    </div>
  );
}

function Field({
  label,
  hint,
  hintAlign = 'left',
  error,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  hintAlign?: 'left' | 'right';
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-[var(--color-text-primary)]">
          {label}
          {optional && <span className="ml-1 text-[var(--color-text-tertiary)] font-normal">optional</span>}
        </label>
        {hint && hintAlign === 'right' && (
          <span className="text-xs text-[var(--color-text-tertiary)]">{hint}</span>
        )}
      </div>
      {children}
      {hint && hintAlign === 'left' && !error && (
        <p className="mt-1.5 text-xs text-[var(--color-text-tertiary)]">{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-[var(--color-error)] overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    'w-full px-4 py-2.5 rounded-xl border text-sm text-[var(--color-text-primary)] bg-[var(--color-surface)]',
    'placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-shadow',
    hasError ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]',
  ].join(' ');
}
