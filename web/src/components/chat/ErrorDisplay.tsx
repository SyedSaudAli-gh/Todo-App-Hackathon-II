interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

/**
 * ErrorDisplay Component
 * T099-T102: Error banner with retry functionality
 */
export function ErrorDisplay({ message, onDismiss, onRetry }: ErrorDisplayProps) {
  // Determine if error is recoverable (has retry option)
  const isRecoverable = !!onRetry;

  return (
    // T102: Style error banner with Tailwind CSS
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* T100: Error message display */}
          <p className="text-sm text-red-700 font-medium">{message}</p>
        </div>
        <div className="flex gap-2 ml-4">
          {/* T101: Retry button for recoverable errors */}
          {isRecoverable && (
            <button
              onClick={onRetry}
              className="text-sm text-red-600 hover:text-red-800 font-medium underline"
            >
              Retry
            </button>
          )}
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
