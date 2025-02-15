import React from "react";
import { MobileDataVoucher } from "@/app/types/common";

interface VoucherTableProps {
  vouchers: MobileDataVoucher[];
  onDeleteVoucher: (index: number) => void;
}

const VoucherTable = ({ vouchers, onDeleteVoucher }: VoucherTableProps) => {
  if (vouchers.length === 0) return null;

  return (
    <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
      <thead>
        <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
            Supplier
          </th>
          <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
            Voucher Name
          </th>
          <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
            Vendor
          </th>
          <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
            Amount (R)
          </th>
          <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
            Total Comm
          </th>
          <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
            Retailer Comm
          </th>
          <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
            Sales Agent Comm
          </th>
          <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
            Profit
          </th>
          <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {vouchers.map((voucher, index) => {
          const voucherAmount = voucher.amount / 100;
          const totalCommissionAmount =
            voucherAmount * (voucher.total_comm ?? 0);
          const retailerCommissionAmount =
            totalCommissionAmount * (voucher.retailer_comm ?? 0);
          const salesAgentCommissionAmount =
            totalCommissionAmount * (voucher.sales_agent_comm ?? 0);
          const profitAmount =
            totalCommissionAmount -
            retailerCommissionAmount -
            salesAgentCommissionAmount;

          return (
            <tr
              key={index}
              className="bg-white transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                {voucher.supplier_name}
              </td>
              <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                {voucher.name}
              </td>
              <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                {voucher.vendorId}
              </td>
              <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                {voucher.name === "OTT Variable Amount" || !voucher.amount
                  ? "-"
                  : voucherAmount.toFixed(2)}
              </td>
              <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                {voucher.name === "OTT Variable Amount" || !voucher.amount
                  ? voucher.total_comm
                  : `${voucher.total_comm} (R ${totalCommissionAmount.toFixed(
                      2,
                    )})`}
              </td>
              <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                {voucher.name === "OTT Variable Amount" || !voucher.amount
                  ? voucher.retailer_comm
                  : `${
                      voucher.retailer_comm
                    } (R ${retailerCommissionAmount.toFixed(2)})`}
              </td>
              <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                {voucher.name === "OTT Variable Amount" || !voucher.amount
                  ? voucher.sales_agent_comm
                  : `${
                      voucher.sales_agent_comm
                    } (R ${salesAgentCommissionAmount.toFixed(2)})`}
              </td>
              <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                {voucher.name === "OTT Variable Amount" || !voucher.amount
                  ? "-"
                  : `R ${profitAmount.toFixed(2)}`}
              </td>
              <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
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
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default VoucherTable;
