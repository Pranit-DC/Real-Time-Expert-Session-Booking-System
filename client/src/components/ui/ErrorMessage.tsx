import { motion } from 'motion/react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className="px-5 py-4 bg-red-50 border border-red-200 rounded-[10px] text-center"
    >
      <p className="text-sm text-[var(--color-error)] m-0">{message}</p>
      {onRetry && (
        <motion.button
          onClick={onRetry}
          whileTap={{ opacity: 0.6 }}
          className="mt-2 text-sm text-[var(--color-accent)] bg-transparent border-none underline underline-offset-2"
        >
          Try again
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
