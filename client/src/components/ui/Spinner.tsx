interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4 border',
  md: 'w-7 h-7 border-2',
  lg: 'w-11 h-11 border-[3px]',
};

const Spinner = ({ size = 'md', fullPage = false }: SpinnerProps) => {
  const ring = (
    <span
      role="status"
      aria-label="Loading"
      className={`block rounded-full border-[var(--color-border)] border-t-[var(--color-accent)] animate-spin ${sizeMap[size]}`}
    />
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        {ring}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{ring}</div>;
};

export default Spinner;
