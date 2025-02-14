import { MobileDataVoucher } from "@/app/types/common";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditVoucherModal from "./EditVoucherModal";

interface CommissionTableProps {
  data: Array<{
    id: string;
    name: string;
    vouchers: MobileDataVoucher[];
  }>;
  setAddSupplierModalOpen: (
    open: boolean,
    commGroupId?: string,
    commGroupName?: string,
  ) => void;
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
  data,
  setAddSupplierModalOpen,
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

  const handleEditClick = (
    groupId: string,
    index: number,
    voucher: MobileDataVoucher,
  ) => {
    setSelectedVoucher({ voucher, groupId, index });
    setEditModalOpen(true);
    if (handleEditVoucher) {
      handleEditVoucher(groupId, index, voucher, true);
    }
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedVoucher(null);
  };

  const handleEditVoucherSubmit = (updatedVoucher: MobileDataVoucher) => {
    if (selectedVoucher && handleEditVoucher) {
      handleEditVoucher(
        selectedVoucher.groupId,
        selectedVoucher.index,
        updatedVoucher,
      );
    }
  };

  const handleDeleteVoucherClick = () => {
    if (selectedVoucher && handleDeleteVoucher && selectedVoucher.voucher.id) {
      handleDeleteVoucher(selectedVoucher.voucher.id.toString());
    }
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

  return (
    <>
      <div className="container mx-auto py-8">
        {data.map((group) => (
          <div key={group.id} className="mb-8">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-2xl font-bold">{group.name}</h2>
              <button
                className="rounded border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700"
                onClick={() => {
                  setAddSupplierModalOpen(true, group.id, group.name);
                }}
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
                  {sortVouchers(group.vouchers).map((voucher, index) => {
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
                          {voucher.name === "OTT Variable Amount" ||
                          !voucher.amount
                            ? "-"
                            : `R ${voucherAmount.toFixed(2)}`}
                        </td>
                        <td
                          className={`${columnWidths.totalComm} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                        >
                          {voucher.name === "OTT Variable Amount" ||
                          !voucher.amount
                            ? voucher.total_comm
                            : `${voucher.total_comm} (R ${totalCommissionAmount.toFixed(2)})`}
                        </td>
                        <td
                          className={`${columnWidths.retailerComm} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                        >
                          {voucher.name === "OTT Variable Amount" ||
                          !voucher.amount
                            ? voucher.retailer_comm
                            : `${voucher.retailer_comm} (R ${retailerCommissionAmount.toFixed(2)})`}
                        </td>
                        <td
                          className={`${columnWidths.salesAgentComm} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                        >
                          {voucher.name === "OTT Variable Amount" ||
                          !voucher.amount
                            ? voucher.sales_agent_comm
                            : `${voucher.sales_agent_comm} (R ${salesAgentCommissionAmount.toFixed(2)})`}
                        </td>
                        <td
                          className={`${columnWidths.profit} border border-gray-300 px-4 py-2 dark:border-gray-600`}
                        >
                          {voucher.name === "OTT Variable Amount" ||
                          !voucher.amount
                            ? "-"
                            : `R ${profitAmount.toFixed(2)}`}
                        </td>
                        <td
                          className={`${columnWidths.actions} border border-gray-300 px-4 py-2 dark:border-gray-600`}
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
          </div>
        ))}
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
