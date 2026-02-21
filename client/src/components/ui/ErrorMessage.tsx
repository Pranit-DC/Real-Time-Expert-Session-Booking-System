interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div
      role="alert"
      className="px-5 py-4 bg-red-50 border border-red-200 rounded-[10px] text-center"
    >
      <p className="text-sm text-[var(--color-error)] m-0">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-[var(--color-accent)] bg-transparent border-none cursor-pointer underline underline-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
