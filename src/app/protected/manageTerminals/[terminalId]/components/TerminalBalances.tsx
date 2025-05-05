import React from "react";
import { Tooltip } from "@mui/material";
import { RefreshCw, Wallet, CreditCard, Award } from "lucide-react";
import SyncIndicator from "./SyncIndicator";

interface BalanceProps {
  available: number;
  credit: number;
  commission: number;
  lastUpdated: Date;
  onRefresh: () => void;
  isLoading: boolean;
}

const TerminalBalances: React.FC<BalanceProps> = ({
  available,
  credit,
  commission,
  lastUpdated,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="sticky top-0 z-50 mb-6 w-full">
      <div className="relative rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Terminal Balance
            </h2>
            <div className="flex items-center gap-4">
              <SyncIndicator lastSync={lastUpdated} />
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="rounded-full p-2 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Refresh balances"
              >
                <RefreshCw
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Available Balance */}
            <div className="group relative overflow-hidden rounded-xl bg-gray-100 p-4 transition-all hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-800/70">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gray-200/80 transition-transform group-hover:scale-150 dark:bg-gray-700/20" />
              <div className="relative flex items-center gap-4">
                <div className="rounded-lg bg-gray-200 p-2 dark:bg-gray-700/50">
                  <Wallet className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Available Balance
                  </p>
                  <p className="font-mono text-2xl font-bold text-green-600 dark:text-green-300">
                    R{available.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Credit Balance */}
            <div className="group relative overflow-hidden rounded-xl bg-gray-100 p-4 transition-all hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-800/70">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gray-200/80 transition-transform group-hover:scale-150 dark:bg-gray-700/20" />
              <div className="relative flex items-center gap-4">
                <div className="rounded-lg bg-gray-200 p-2 dark:bg-gray-700/50">
                  <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Credit Balance
                  </p>
                  <p className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-300">
                    R{credit.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Commission Balance */}
            <div className="group relative overflow-hidden rounded-xl bg-gray-100 p-4 transition-all hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-800/70">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gray-200/80 transition-transform group-hover:scale-150 dark:bg-gray-700/20" />
              <div className="relative flex items-center gap-4">
                <div className="rounded-lg bg-gray-200 p-2 dark:bg-gray-700/50">
                  <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Commission
                  </p>
                  <p className="font-mono text-2xl font-bold text-yellow-600 dark:text-yellow-200">
                    R{commission.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalBalances;
