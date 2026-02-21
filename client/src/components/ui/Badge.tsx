import type { BookingStatus } from '../../types';

interface BadgeProps {
  status: BookingStatus;
}

const colorMap: Record<BookingStatus, string> = {
  Pending:   'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
  Confirmed: 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-400',
  Completed: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
};

const Badge = ({ status }: BadgeProps) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${colorMap[status]}`}>
    {status}
  </span>
);

export default Badge;
