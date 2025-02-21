import React from "react";
import { History } from "lucide-react";

interface TransactionHistoryButtonProps {
  onClick: () => void;
}

const TransactionHistoryButton: React.FC<TransactionHistoryButtonProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 flex items-center space-x-2 rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      <History className="h-5 w-5" />
      <span>Transaction History</span>
    </button>
  );
};

export default TransactionHistoryButton;
