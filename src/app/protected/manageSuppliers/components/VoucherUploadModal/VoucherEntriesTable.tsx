import React from "react";
import { VoucherEntry } from "../VoucherUploadModal";

interface VoucherEntriesTableProps {
  entries: VoucherEntry[];
}

const VoucherEntriesTable: React.FC<VoucherEntriesTableProps> = ({
  entries,
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherEntriesTable;
