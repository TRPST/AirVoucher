import React from "react";
import { VoucherEntry } from "../VoucherUploadModal";
import { Trash2, AlertCircle, CheckCircle, Loader } from "lucide-react";

interface VoucherEntriesTableProps {
  entries: VoucherEntry[];
  onRemoveVoucher: (serialNumber: string) => void;
  isCheckingDuplicates: boolean;
}

const VoucherEntriesTable: React.FC<VoucherEntriesTableProps> = ({
  entries,
  onRemoveVoucher,
  isCheckingDuplicates,
}) => {
  return (
    <div className="mb-6">
      <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Individual Voucher Details:
      </h4>
      <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Serial Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Pin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Expiry Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  entry.exists ? "bg-red-50 dark:bg-red-900/10" : ""
                }`}
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {entry.type}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  R{entry.amount.toFixed(2)}
                </td>
                <td className="font-mono whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {entry.serialNumber}
                </td>
                <td className="font-mono whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {entry.pin}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {entry.expiryDate}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {isCheckingDuplicates ? (
                    <div className="flex items-center text-blue-500">
                      <Loader className="mr-1 h-4 w-4 animate-spin" />
                      <span>Checking...</span>
                    </div>
                  ) : entry.exists ? (
                    <div className="flex items-center text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      <span>Already exists</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      <span>New</span>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <button
                    onClick={() => onRemoveVoucher(entry.serialNumber)}
                    className="rounded p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                    aria-label="Remove voucher"
                    title="Remove voucher"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherEntriesTable;
