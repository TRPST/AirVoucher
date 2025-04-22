import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface StatusMessageProps {
  message: string;
  isError?: boolean; // Optional prop to explicitly mark as error
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, isError }) => {
  // Determine if this is an error message based on content or explicit flag
  const isErrorMessage =
    isError ||
    message.toLowerCase().includes("error") ||
    message.toLowerCase().includes("invalid") ||
    message.toLowerCase().includes("no valid") ||
    message.toLowerCase().includes("doesn't seem") ||
    message.toLowerCase().includes("could not parse") ||
    message.toLowerCase().includes("already exist") ||
    message.toLowerCase().includes("vouchers already") ||
    (message.toLowerCase().includes("found") &&
      message.toLowerCase().includes("already exist"));

  return (
    <div
      className={`mb-6 flex items-center rounded-md p-3 ${
        isErrorMessage
          ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      }`}
    >
      {isErrorMessage ? (
        <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
      ) : (
        <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0" />
      )}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default StatusMessage;
