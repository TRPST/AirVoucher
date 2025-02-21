import React from "react";
import { Tooltip } from "@mui/material";
import { RefreshCw } from "lucide-react";

interface BalanceProps {
  balance: number;
  credit: number;
  balanceDue: number;
  lastUpdated: Date;
  onRefresh: () => void;
  isLoading: boolean;
}

const TerminalBalances: React.FC<BalanceProps> = ({
  balance,
  credit,
  balanceDue,
  lastUpdated,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Tooltip title="Available funds in your account" arrow>
        <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Balance
            </span>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            R {balance.toFixed(2)}
          </div>
        </div>
      </Tooltip>

      <Tooltip title="Available credit limit" arrow>
        <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Credit
            </span>
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            R {credit.toFixed(2)}
          </div>
        </div>
      </Tooltip>

      <Tooltip title="Outstanding balance to be paid" arrow>
        <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Balance Due
            </span>
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            R {balanceDue.toFixed(2)}
          </div>
        </div>
      </Tooltip>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        aria-label="Refresh balances"
      >
        <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
};

export default TerminalBalances;
