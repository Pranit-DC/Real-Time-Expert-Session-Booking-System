import { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCreateBooking } from '../hooks/useBookings';
import { formatDate } from '../utils/format';

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
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <p className="text-[var(--color-text-secondary)] text-sm mb-4">
          No session selected. Please choose a time slot from the expert's profile.
        </p>
        <Link
          to={expertId ? `/experts/${expertId}` : '/'}
          className="text-[var(--color-accent)] text-sm hover:underline"
        >
          Go back
        </Link>
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
      {
        expertId: expertId!,
        ...form,
        date: state.date,
        timeSlot: state.timeSlot,
      },
      {
        onSuccess: () => {
          navigate('/my-bookings', { state: { email: form.email } });
        },
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
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
        <Link
          to={`/experts/${expertId}`}
          className="hover:text-[var(--color-text-primary)] transition-colors"
        >
          {state.expertName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text-primary)]">Book Session</span>
      </motion.nav>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight mb-2"
      >
        Book a Session
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.07, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-white border border-[var(--color-border)] rounded-2xl px-5 py-4 mb-8 text-sm"
      >
        <p className="font-medium text-[var(--color-text-primary)]">{state.expertName}</p>
        <p className="text-[var(--color-text-secondary)] mt-0.5">
          {formatDate(state.date)} · {state.timeSlot}
        </p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-6"
          >
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        <Field label="Full Name" error={fieldErrors.name}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className={inputCls(Boolean(fieldErrors.name))}
          />
        </Field>

        <Field label="Email Address" error={fieldErrors.email}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={inputCls(Boolean(fieldErrors.email))}
          />
        </Field>

        <Field label="Phone Number" error={fieldErrors.phone}>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={inputCls(Boolean(fieldErrors.phone))}
          />
        </Field>

        <Field label="Notes (optional)">
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Topics you'd like to cover…"
            rows={3}
            className={inputCls(false) + ' resize-none'}
          />
        </Field>

        <motion.button
          type="submit"
          disabled={isPending}
          whileTap={isPending ? undefined : { opacity: 0.8, scale: 0.995 }}
          className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-white text-sm font-semibold tracking-wide hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isPending ? 'Booking…' : 'Confirm Booking'}
        </motion.button>
      </motion.form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-text-primary)] mb-1.5">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-red-500 overflow-hidden"
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
    'w-full px-4 py-2.5 rounded-xl border text-sm text-[var(--color-text-primary)] bg-white',
    'placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition',
    hasError ? 'border-red-400' : 'border-[var(--color-border)]',
  ].join(' ');
}
