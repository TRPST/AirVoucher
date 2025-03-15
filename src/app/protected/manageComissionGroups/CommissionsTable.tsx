import { MobileDataVoucher, Retailer } from "@/app/types/common";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditVoucherModal from "./EditVoucherModal";

interface CommissionTableProps {
  group: {
    id: string;
    name: string;
    vouchers: MobileDataVoucher[];
  };
  handleDeleteVoucher?: (voucherId: string) => void;
  handleEditVoucher?: (
    groupId: string,
    voucherIndex: number,
    updatedVoucher: MobileDataVoucher,
    isJustOpening?: boolean,
  ) => void;
  editLoading?: boolean;
  editError?: string;
  editSuccess?: string;
}

const CommissionTable: React.FC<CommissionTableProps> = ({
  group,
  handleDeleteVoucher,
  handleEditVoucher,
  editLoading,
  editError,
  editSuccess,
}) => {
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedVoucher, setSelectedVoucher] = React.useState<{
    voucher: MobileDataVoucher;
    groupId: string;
    index: number;
  } | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc",
  );

  // Update column widths to be more responsive
  const columnWidths = {
    supplier: "w-[150px] min-w-[100px]",
    voucherName: "w-[300px] min-w-[200px]",
    vendor: "w-[120px] min-w-[100px]",
    amount: "w-[130px] min-w-[100px]",
    totalComm: "w-[180px] min-w-[120px]",
    retailerComm: "w-[180px] min-w-[120px]",
    salesAgentComm: "w-[180px] min-w-[120px]",
    profit: "w-[130px] min-w-[100px]",
    actions: "w-[100px] min-w-[80px]",
  } as const;

  const handleEditClick = (
    groupId: string,
    index: number,
    voucher: MobileDataVoucher,
  ) => {
    if (!handleEditVoucher) return;

    setSelectedVoucher({ voucher, groupId, index });
    setEditModalOpen(true);
    handleEditVoucher(groupId, index, voucher, true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedVoucher(null);
  };

  const handleEditVoucherSubmit = (updatedVoucher: MobileDataVoucher) => {
    if (!selectedVoucher || !handleEditVoucher) return;

    handleEditVoucher(
      selectedVoucher.groupId,
      selectedVoucher.index,
      updatedVoucher,
    );
  };

  const handleDeleteVoucherClick = () => {
    if (!selectedVoucher?.voucher.id || !handleDeleteVoucher) return;

    handleDeleteVoucher(selectedVoucher.voucher.id.toString());
  };

  // Add an effect to close the modal on success
  React.useEffect(() => {
    if (editSuccess) {
      handleEditModalClose();
    }
  }, [editSuccess]);

  const handleSortToggle = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortVouchers = (vouchers: MobileDataVoucher[]) => {
    return [...vouchers].sort((a, b) => {
      if (a.name === "OTT Variable Amount") return 1;
      if (b.name === "OTT Variable Amount") return -1;

      const aAmount = a.amount / 100;
      const bAmount = b.amount / 100;

      return sortDirection === "asc" ? aAmount - bAmount : bAmount - aAmount;
    });
  };

  // Add a helper function to determine if amount should be divided by 100
  const shouldDivideAmount = (supplierName: string): boolean => {
    const noConversionSuppliers = ["Ringa", "Hollywoodbets", "Easyload"];
    return !noConversionSuppliers.includes(supplierName);
  };

  return (
    <>
      <div className="min-w-full">
        <table className="w-full table-auto border-collapse bg-white shadow-md dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <th
                className={`${columnWidths.supplier} truncate border border-gray-300 px-4 py-1 text-left text-sm font-semibold dark:border-gray-600 dark:text-white`}
              >
                Supplier
              </th>
              <th
                className={`${columnWidths.voucherName} truncate border border-gray-300 px-4 py-1 text-left text-sm font-semibold dark:border-gray-600 dark:text-white`}
              >
                Voucher Name
              </th>
              <th
                className={`${columnWidths.vendor} truncate border border-gray-300 px-4 py-1 text-left text-sm font-semibold dark:border-gray-600 dark:text-white`}
              >
                Vendor
              </th>
              <th
                className={`${columnWidths.amount} truncate border border-gray-300 px-4 py-1 text-left text-sm font-semibold dark:border-gray-600 dark:text-white`}
              >
                <button
                  onClick={handleSortToggle}
                  className="inline-flex items-center gap-1 hover:text-blue-600 focus:outline-none dark:hover:text-blue-400"
                  aria-label={`Sort by amount ${sortDirection === "asc" ? "ascending" : "descending"}`}
                >
                  <span>Amount</span>
                  {sortDirection === "asc" ? (
                    <ArrowUpwardIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ fontSize: 18 }} />
                  )}
                </button>
              </th>
              <th
                className={`${columnWidths.totalComm} truncate border border-gray-300 px-4 py-1 text-left text-sm font-semibold dark:border-gray-600 dark:text-white`}
              >
                Supplier Com
              </th>
              <th
                className={`${columnWidths.retailerComm} truncate border border-gray-300 px-4 py-1 text-left text-sm font-semibold dark:border-gray-600 dark:text-white`}
              >
                Retailer Com
              </th>
              <th
                className={`${columnWidths.salesAgentComm} truncate border border-gray-300 px-4 py-1 text-left text-sm font-semibold dark:border-gray-600 dark:text-white`}
              >
                Sales Agent Com
              </th>
              <th
                className={`${columnWidths.profit} truncate border border-gray-300 px-4 py-1 text-left text-sm font-semibold dark:border-gray-600 dark:text-white`}
              >
                Profit
              </th>
              <th
                className={`${columnWidths.actions} whitespace-nowrap border border-gray-300 px-4 py-1 text-left text-sm font-semibold dark:border-gray-600`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortVouchers(group.vouchers).map((voucher, index) => {
              // Update the amount calculation logic
              const voucherAmount = shouldDivideAmount(voucher.supplier_name)
                ? voucher.amount / 100
                : voucher.amount;

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
                    className={`${columnWidths.supplier} truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white`}
                    title={voucher.supplier_name}
                  >
                    {voucher.supplier_name}
                  </td>
                  <td
                    className={`${columnWidths.voucherName} border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white`}
                  >
                    {voucher.name}
                  </td>
                  <td
                    className={`${columnWidths.vendor} truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white`}
                    title={voucher.vendorId}
                  >
                    {typeof voucher.vendorId === "string"
                      ? voucher.vendorId.toUpperCase()
                      : "-"}
                  </td>
                  <td
                    className={`${columnWidths.amount} truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white`}
                  >
                    {voucher.name === "OTT Variable Amount" || !voucher.amount
                      ? "-"
                      : `R ${voucherAmount.toFixed(2)}`}
                  </td>
                  <td
                    className={`${columnWidths.totalComm} truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white`}
                    title={
                      voucher.name === "OTT Variable Amount" || !voucher.amount
                        ? `${(voucher.total_comm * 100).toFixed(2)}%`
                        : `${(voucher.total_comm * 100).toFixed(2)}% (R ${totalCommissionAmount.toFixed(2)})`
                    }
                  >
                    {voucher.name === "OTT Variable Amount" || !voucher.amount
                      ? `${(voucher.total_comm * 100).toFixed(2)}%`
                      : `${(voucher.total_comm * 100).toFixed(2)}% (R ${totalCommissionAmount.toFixed(2)})`}
                  </td>
                  <td
                    className={`${columnWidths.retailerComm} truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white`}
                    title={
                      voucher.name === "OTT Variable Amount" || !voucher.amount
                        ? `${(voucher.retailer_comm * 100).toFixed(2)}%`
                        : `${(voucher.retailer_comm * 100).toFixed(2)}% (R ${retailerCommissionAmount.toFixed(2)})`
                    }
                  >
                    {voucher.name === "OTT Variable Amount" || !voucher.amount
                      ? `${(voucher.retailer_comm * 100).toFixed(2)}%`
                      : `${(voucher.retailer_comm * 100).toFixed(2)}% (R ${retailerCommissionAmount.toFixed(2)})`}
                  </td>
                  <td
                    className={`${columnWidths.salesAgentComm} truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white`}
                    title={
                      voucher.name === "OTT Variable Amount" || !voucher.amount
                        ? `${(voucher.sales_agent_comm * 100).toFixed(2)}%`
                        : `${(voucher.sales_agent_comm * 100).toFixed(2)}% (R ${salesAgentCommissionAmount.toFixed(2)})`
                    }
                  >
                    {voucher.name === "OTT Variable Amount" || !voucher.amount
                      ? `${(voucher.sales_agent_comm * 100).toFixed(2)}%`
                      : `${(voucher.sales_agent_comm * 100).toFixed(2)}% (R ${salesAgentCommissionAmount.toFixed(2)})`}
                  </td>
                  <td
                    className={`${columnWidths.profit} truncate border border-gray-300 px-4 py-1 dark:border-gray-600 dark:text-white`}
                    title={
                      voucher.name === "OTT Variable Amount" || !voucher.amount
                        ? "-"
                        : `R ${profitAmount.toFixed(2)}`
                    }
                  >
                    {voucher.name === "OTT Variable Amount" || !voucher.amount
                      ? "-"
                      : `R ${profitAmount.toFixed(2)}`}
                  </td>
                  <td
                    className={`${columnWidths.actions} whitespace-nowrap border border-gray-300 px-4 py-1 dark:border-gray-600`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() =>
                          handleEditClick(group.id, index, voucher)
                        }
                        className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        aria-label="Edit voucher"
                      >
                        <EditIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedVoucher && (
        <EditVoucherModal
          open={editModalOpen}
          handleClose={handleEditModalClose}
          voucher={selectedVoucher.voucher}
          handleEditVoucher={handleEditVoucherSubmit}
          handleDeleteVoucher={(voucherId) => handleDeleteVoucher?.(voucherId)}
          loading={editLoading}
          editError={editError}
          editSuccess={editSuccess}
        />
      )}
    </>
  );
};

export default CommissionTable;
