import { MobileDataVoucher } from "@/app/types/common";
import React from "react";

interface CommissionTableProps {
  data: Array<{
    id: string;
    name: string;
    vouchers: MobileDataVoucher[];
  }>;
  setAddSupplierModalOpen: (open: boolean, commGroupId?: string) => void;
  handleDeleteVoucher?: (groupId: string, voucherIndex: number) => void;
}

const CommissionTable: React.FC<CommissionTableProps> = ({
  data,
  setAddSupplierModalOpen,
  handleDeleteVoucher,
}) => {
  // Define column widths as constants at the top of the component
  const columnWidths = {
    supplier: "w-[100px]",
    voucherName: "w-[300px]",
    vendor: "w-[100px]",
    amount: "w-[120px]",
    totalComm: "w-[150px]",
    retailerComm: "w-[150px]",
    salesAgentComm: "w-[150px]",
    profit: "w-[120px]",
    actions: "w-[100px]",
  } as const;

  return (
    <div className="container mx-auto py-8">
      {data.map((group) => (
        <div key={group.id} className="mb-8">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-2xl font-bold">{group.name}</h2>
            <button
              className="rounded border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700"
              onClick={() => setAddSupplierModalOpen(true, group.id)}
            >
              Add Vouchers
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
              <thead>
                <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  <th
                    className={`${columnWidths.supplier} border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600`}
                  >
                    Supplier
                  </th>
                  <th
                    className={`${columnWidths.voucherName} border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600`}
                  >
                    Voucher Name
                  </th>
                  <th
                    className={`${columnWidths.vendor} border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600`}
                  >
                    Vendor
                  </th>
                  <th
                    className={`${columnWidths.amount} border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600`}
                  >
                    Amount
                  </th>
                  <th
                    className={`${columnWidths.totalComm} border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600`}
                  >
                    Total Comm
                  </th>
                  <th
                    className={`${columnWidths.retailerComm} border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600`}
                  >
                    Retailer Comm
                  </th>
                  <th
                    className={`${columnWidths.salesAgentComm} border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600`}
                  >
                    Sales Agent Comm
                  </th>
                  <th
                    className={`${columnWidths.profit} border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600`}
                  >
                    Profit
                  </th>
                  <th
                    className={`${columnWidths.actions} border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.vouchers.map((voucher, index) => {
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
                      className="bg-white transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <td
                        className={`${columnWidths.supplier} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                      >
                        {voucher.supplier_name}
                      </td>
                      <td
                        className={`${columnWidths.voucherName} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                      >
                        {voucher.name}
                      </td>
                      <td
                        className={`${columnWidths.vendor} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                      >
                        {voucher.vendorId}
                      </td>
                      <td
                        className={`${columnWidths.amount} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                      >
                        R {voucherAmount.toFixed(2)}
                      </td>
                      <td
                        className={`${columnWidths.totalComm} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                      >
                        {voucher.total_comm} (R{" "}
                        {totalCommissionAmount.toFixed(2)})
                      </td>
                      <td
                        className={`${columnWidths.retailerComm} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                      >
                        {voucher.retailer_comm} (R{" "}
                        {retailerCommissionAmount.toFixed(2)})
                      </td>
                      <td
                        className={`${columnWidths.salesAgentComm} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                      >
                        {voucher.sales_agent_comm} (R{" "}
                        {salesAgentCommissionAmount.toFixed(2)})
                      </td>
                      <td
                        className={`${columnWidths.profit} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                      >
                        R {profitAmount.toFixed(2)}
                      </td>
                      <td
                        className={`${columnWidths.actions} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                      >
                        <button
                          onClick={() => handleDeleteVoucher?.(group.id, index)}
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommissionTable;
