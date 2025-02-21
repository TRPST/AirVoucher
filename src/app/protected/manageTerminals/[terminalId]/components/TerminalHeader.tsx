import React from "react";
import { Search } from "lucide-react";
import SyncIndicator from "./SyncIndicator";

interface TerminalHeaderProps {
  terminalId: string;
  lastSync: Date;
  onSearch: (query: string) => void;
  onAnalytics: () => void;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  terminalId,
  lastSync,
  onSearch,
  onAnalytics,
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Row 1 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Terminal {terminalId}
          </h2>
          <SyncIndicator lastSync={lastSync} />
        </div>
      </div>

      {/* Row 2 */}
      {/* <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-x-4 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search vouchers..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onAnalytics}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Analytics
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default TerminalHeader;
