import React, { useState } from "react";
import { Dialog } from "@mui/material";

interface VoucherListModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierName: string;
  vouchers: any[];
  error: string | null;
}

type SortField =
  | "name"
  | "amount"
  | "total_comm"
  | "retailer_comm"
  | "sales_agent_comm"
  | "profit"
  | "created_at";
type SortDirection = "asc" | "desc";

const VoucherListModal: React.FC<VoucherListModalProps> = ({
  isOpen,
  onClose,
  supplierName,
  vouchers,
  error,
}) => {
  // Add sorting state
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Format commission value to 2 decimal places
  const formatCommission = (value: number | string): string => {
    if (typeof value === "string") {
      value = parseFloat(value);
    }
    return value.toFixed(2) + "%";
  };

  // Format amount based on supplier
  const formatAmount = (
    amount: number | string,
    supplierName: string,
  ): string => {
    let numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

    // Divide by 100 for Glocell (convert cents to Rand)
    if (supplierName.toLowerCase() === "glocell") {
      numAmount = numAmount / 100;
    }

    // Format with 2 decimal places and R symbol
    return `R${numAmount.toFixed(2)}`;
  };

  // Format profit value
  const formatProfit = (value: number | string): string => {
    if (typeof value === "string") {
      value = parseFloat(value);
    }
    return `R${value.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return new Intl.DateTimeFormat("en-ZA", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort vouchers
  const sortedVouchers = [...vouchers].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    // Handle special cases
    if (sortField === "created_at") {
      valueA = new Date(valueA || 0).getTime();
      valueB = new Date(valueB || 0).getTime();
    } else if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Default numeric comparison
    if (sortDirection === "asc") {
      return (valueA || 0) - (valueB || 0);
    } else {
      return (valueB || 0) - (valueA || 0);
    }
  });

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;

    return (
      <span className="ml-1 inline-block">
        {sortDirection === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="voucher-list-modal-title"
      PaperProps={{
        style: {
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2
              id="voucher-list-modal-title"
              className="text-xl font-semibold text-gray-900 dark:text-white"
            >
              {supplierName} Vouchers
            </h2>
            {!error && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {vouchers.length} voucher{vouchers.length !== 1 ? "s" : ""}{" "}
                available
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500 dark:hover:bg-gray-700"
            aria-label="Close modal"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClose()}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto dark:bg-gray-900">
        {error ? (
          <div className="p-6">
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
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
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error loading vouchers
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : vouchers.length > 0 ? (
          <div className="w-full">
            <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
              {/* Sticky Table Header */}
              <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    className="w-1/5 cursor-pointer whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => handleSort("name")}
                  >
                    <span className="flex items-center">
                      Name
                      {renderSortIndicator("name")}
                    </span>
                  </th>
                  <th
                    className="w-1/8 cursor-pointer whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => handleSort("amount")}
                  >
                    <span className="flex items-center">
                      Amount
                      {renderSortIndicator("amount")}
                    </span>
                  </th>
                  <th
                    className="w-1/8 cursor-pointer whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => handleSort("total_comm")}
                  >
                    <span className="flex items-center">
                      Supplier Com
                      {renderSortIndicator("total_comm")}
                    </span>
                  </th>
                  <th
                    className="w-1/8 cursor-pointer whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => handleSort("retailer_comm")}
                  >
                    <span className="flex items-center">
                      Retailer Com
                      {renderSortIndicator("retailer_comm")}
                    </span>
                  </th>
                  <th
                    className="w-1/8 cursor-pointer whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => handleSort("sales_agent_comm")}
                  >
                    <span className="flex items-center">
                      Agent Com
                      {renderSortIndicator("sales_agent_comm")}
                    </span>
                  </th>
                  <th
                    className="w-1/8 cursor-pointer whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => handleSort("profit")}
                  >
                    <span className="flex items-center">
                      Profit
                      {renderSortIndicator("profit")}
                    </span>
                  </th>
                  <th
                    className="w-1/5 cursor-pointer whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => handleSort("created_at")}
                  >
                    <span className="flex items-center">
                      Created At
                      {renderSortIndicator("created_at")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {sortedVouchers.map((voucher) => (
                  <tr
                    key={voucher.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {voucher.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      R {voucher.amount.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatCommission(voucher.total_comm)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatCommission(voucher.retailer_comm)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatCommission(voucher.sales_agent_comm)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {voucher.profit !== undefined && voucher.profit !== null
                        ? formatProfit(voucher.profit)
                        : "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatDate(voucher.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400">
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-2">No vouchers found for this supplier</p>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default VoucherListModal;
