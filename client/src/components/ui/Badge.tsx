import type { BookingStatus } from '../../types';

interface BadgeProps {
  status: BookingStatus;
}

const colorMap: Record<BookingStatus, string> = {
  Pending:   'bg-amber-50 text-amber-800',
  Confirmed: 'bg-green-50 text-green-800',
  Completed: 'bg-neutral-100 text-neutral-600',
};

const Badge = ({ status }: BadgeProps) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${colorMap[status]}`}>
    {status}
  </span>
);

export default Badge;
