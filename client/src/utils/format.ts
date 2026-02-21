// formats "2026-02-25" → "Tuesday, 25 Feb"
export const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
};

// formats "2026-02-25" → "25 Feb 2026"
export const formatDateShort = (iso: string): string => {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// "4.8" → ["★","★","★","★","½"] — for display only
export const ratingLabel = (rating: number): string => {
  return rating.toFixed(1);
};
