import React, { useState } from "react";
import { Supplier } from "../../../../types/supplier";
import VoucherUploadModal from "./VoucherUploadModal";
import SalesReportModal from "./SalesReportModal";
import SupplierRow from "./SupplierRow";

interface SupplierTableProps {
  suppliers: Supplier[];
  onRefresh: () => void;
}

const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  onRefresh,
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Check if supplier supports manual voucher upload
  const supportsVoucherUpload = (supplier: Supplier) => {
    const supportedSuppliers = ["Ringa", "Hollywoodbets", "Easyload"];
    return supportedSuppliers.includes(supplier.name);
  };

  // Handle upload button click
  const handleUploadClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsUploadModalOpen(true);
  };

  // Handle report button click
  const handleReportClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsReportModalOpen(true);
  };

  // Close modals and refresh data if needed
  const handleModalClose = (refresh: boolean = false) => {
    setIsUploadModalOpen(false);
    setIsReportModalOpen(false);
    setSelectedSupplier(null);

    if (refresh) {
      onRefresh();
    }
  };

  return (
    <div className="w-full">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              NAME
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              STATUS
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              VOUCHER INVENTORY
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              CREATED AT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              UPDATED AT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {suppliers.map((supplier) => (
            <SupplierRow
              key={supplier.id}
              supplier={supplier}
              onUploadClick={handleUploadClick}
              onReportClick={handleReportClick}
              supportsVoucherUpload={supportsVoucherUpload}
            />
          ))}
        </tbody>
      </table>

      {/* Voucher Upload Modal */}
      {selectedSupplier && (
        <VoucherUploadModal
          isOpen={isUploadModalOpen}
          supplier={selectedSupplier}
          onClose={(refresh) => handleModalClose(refresh)}
        />
      )}

      {/* Sales Report Modal */}
      {selectedSupplier && (
        <SalesReportModal
          isOpen={isReportModalOpen}
          supplier={selectedSupplier}
          onClose={() => handleModalClose()}
        />
      )}
    </div>
  );
};

export default SupplierTable;
