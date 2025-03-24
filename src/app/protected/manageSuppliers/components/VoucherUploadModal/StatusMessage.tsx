import React from "react";

interface StatusMessageProps {
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  const isError = message.includes("Error") || message.includes("No valid");

  return (
    <div
      className={`mb-6 rounded-md p-4 text-sm ${
        isError
          ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
          : "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {isError ? (
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusMessage;
