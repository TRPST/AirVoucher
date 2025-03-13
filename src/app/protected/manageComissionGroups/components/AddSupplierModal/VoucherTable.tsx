import React from "react";
import { MobileDataVoucher } from "@/app/types/common";
import { cn } from "@/lib/utils";

interface VoucherTableProps {
  vouchers: MobileDataVoucher[];
  onDeleteVoucher: (index: number) => void;
}

const VoucherTable = ({ vouchers, onDeleteVoucher }: VoucherTableProps) => {
  // Helper function to format amount based on supplier
  const formatAmount = (voucher: MobileDataVoucher) => {
    // For these suppliers, the amount is already in Rands
    const noConversionSuppliers = ["Ringa", "Hollywoodbets", "Easyload"];

    if (voucher.name === "OTT Variable Amount" || !voucher.amount) {
      return "-";
    }

    if (noConversionSuppliers.includes(voucher.supplier_name)) {
      return `R ${voucher.amount.toFixed(2)}`;
    }

    // For other suppliers, divide by 100 (convert cents to Rands)
    const voucherAmount = voucher.amount / 100;
    return `R ${voucherAmount.toFixed(2)}`;
  };

  if (vouchers.length === 0) return null;

  return (
    <div className="relative w-full">
      <h3 className="mb-2 mt-5 font-semibold text-gray-800 dark:text-gray-100">
        Selected Vouchers
      </h3>
      <div className="overflow-x-auto rounded-lg border border-gray-400">
        <div className="min-w-full">
          <table className="w-full table-auto border-collapse bg-white shadow-md dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600 dark:text-white">
                  Supplier
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600 dark:text-white">
                  Voucher Name
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600 dark:text-white">
                  Vendor
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600 dark:text-white">
                  Amount (R)
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600 dark:text-white">
                  Supplier Com
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600 dark:text-white">
                  Retailer Com
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600 dark:text-white">
                  Sales Agent Com
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600 dark:text-white">
                  Profit
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher, index) => {
                const voucherAmount = voucher.amount / 100;
                const totalCommissionAmount =
                  voucherAmount * (voucher.total_comm || 0);
                const retailerCommissionAmount =
                  totalCommissionAmount * (voucher.retailer_comm || 0);
                const salesAgentCommissionAmount =
                  totalCommissionAmount * (voucher.sales_agent_comm || 0);
                const profitAmount =
                  totalCommissionAmount -
                  retailerCommissionAmount -
                  salesAgentCommissionAmount;

                return (
                  <tr
                    key={`${voucher.id}-${index}`}
                    className="bg-white text-sm transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <td
                      className="truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white"
                      title={voucher.supplier_name}
                    >
                      {voucher.supplier_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white">
                      {voucher.name}
                      {voucher.metadata?.voucherCount && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({voucher.metadata.voucherCount} vouchers)
                        </span>
                      )}
                    </td>
                    <td
                      className="truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white"
                      title={voucher.vendorId}
                    >
                      {voucher.vendorId ? voucher.vendorId.toUpperCase() : "-"}
                    </td>
                    <td className="truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white">
                      {formatAmount(voucher)}
                    </td>
                    <td
                      className="truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white"
                      title={
                        voucher.name === "OTT Variable Amount" ||
                        !voucher.amount
                          ? `${(voucher.total_comm * 100).toFixed(2)}%`
                          : `${(voucher.total_comm * 100).toFixed(2)}% (R ${totalCommissionAmount.toFixed(2)})`
                      }
                    >
                      {voucher.name === "OTT Variable Amount" || !voucher.amount
                        ? `${(voucher.total_comm * 100).toFixed(2)}%`
                        : `${(voucher.total_comm * 100).toFixed(2)}% (R ${totalCommissionAmount.toFixed(2)})`}
                    </td>
                    <td
                      className="truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white"
                      title={
                        voucher.name === "OTT Variable Amount" ||
                        !voucher.amount
                          ? `${(voucher.retailer_comm * 100).toFixed(2)}%`
                          : `${(voucher.retailer_comm * 100).toFixed(2)}% (R ${retailerCommissionAmount.toFixed(2)})`
                      }
                    >
                      {voucher.name === "OTT Variable Amount" || !voucher.amount
                        ? `${(voucher.retailer_comm * 100).toFixed(2)}%`
                        : `${(voucher.retailer_comm * 100).toFixed(2)}% (R ${retailerCommissionAmount.toFixed(2)})`}
                    </td>
                    <td
                      className="truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white"
                      title={
                        voucher.name === "OTT Variable Amount" ||
                        !voucher.amount
                          ? `${(voucher.sales_agent_comm * 100).toFixed(2)}%`
                          : `${(voucher.sales_agent_comm * 100).toFixed(2)}% (R ${salesAgentCommissionAmount.toFixed(2)})`
                      }
                    >
                      {voucher.name === "OTT Variable Amount" || !voucher.amount
                        ? `${(voucher.sales_agent_comm * 100).toFixed(2)}%`
                        : `${(voucher.sales_agent_comm * 100).toFixed(2)}% (R ${salesAgentCommissionAmount.toFixed(2)})`}
                    </td>
                    <td
                      className="truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white"
                      title={
                        voucher.name === "OTT Variable Amount" ||
                        !voucher.amount
                          ? "-"
                          : `R ${profitAmount.toFixed(2)}`
                      }
                    >
                      {voucher.name === "OTT Variable Amount" || !voucher.amount
                        ? "-"
                        : `R ${profitAmount.toFixed(2)}`}
                    </td>
                    <td className="whitespace-nowrap border border-gray-300 px-4 py-1 dark:border-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onDeleteVoucher(index)}
                          className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                          aria-label="Delete voucher"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VoucherTable;
