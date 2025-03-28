import React, { useState, useEffect, useCallback } from "react";
import { Supplier } from "../../../types/supplier";
import { getSupplierVouchersAction, deleteVoucherAction } from "../actions";
import VoucherListModal from "./VoucherListModal";

interface SupplierRowProps {
  supplier: Supplier;
  onUploadClick: (supplier: Supplier) => void;
  onReportClick: (supplier: Supplier) => void;
  supportsVoucherUpload: (supplier: Supplier) => boolean;
}

const SupplierRow: React.FC<SupplierRowProps> = ({
  supplier,
  onUploadClick,
  onReportClick,
  supportsVoucherUpload,
}) => {
  const [showVouchers, setShowVouchers] = useState(false);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voucherCount, setVoucherCount] = useState<number>(
    supplier.voucherCount || 0,
  );
  const [refreshVouchers, setRefreshVouchers] = useState(false);

  // Define fetchVouchers as a useCallback function so it can be used in multiple places
  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSupplierVouchersAction(supplier.supplier_name);

      if (result.error) {
        setError(result.error);
      } else {
        setVouchers(result.vouchers || []);
        setVoucherCount(result.vouchers ? result.vouchers.length : 0);
        console.log("Vouchers: ", result.vouchers);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
      setRefreshVouchers(false);
    }
  }, [supplier.supplier_name]);

  // Fetch vouchers when component mounts or when refreshVouchers changes
  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers, refreshVouchers]);

  const handleVoucherClick = () => {
    setShowVouchers(true);
  };

  const handleCloseModal = () => {
    setShowVouchers(false);
  };

  const handleDeleteVoucher = async (voucherId: string) => {
    return await deleteVoucherAction(voucherId);
  };

  const handleVoucherDeleted = () => {
    setRefreshVouchers(true);
  };

  return (
    <>
      <tr key={supplier.id}>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
          {supplier.supplier_name}
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-sm">
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
              supplier.status === true
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
            }`}
          >
            {supplier.status ? "active" : "inactive"}
          </span>
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
          <button
            onClick={handleVoucherClick}
            className="inline-flex rounded bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-900"
            aria-label="View vouchers"
          >
            {loading ? "Loading..." : `${voucherCount} vouchers`}
          </button>
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
          {new Date(supplier.created_at).toLocaleDateString()}
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
          <div className="flex space-x-2">
            <button
              className={`rounded px-3 py-1 text-xs font-medium text-white ${
                supportsVoucherUpload(supplier)
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
              disabled={!supportsVoucherUpload(supplier)}
              onClick={() => onUploadClick(supplier)}
            >
              Upload Vouchers
            </button>
            <button
              className="rounded bg-purple-600 px-3 py-1 text-xs font-medium text-white hover:bg-purple-700"
              onClick={() => onReportClick(supplier)}
            >
              Sales Report
            </button>
          </div>
        </td>
      </tr>

      {/* Voucher List Modal */}
      <VoucherListModal
        isOpen={showVouchers}
        onClose={handleCloseModal}
        supplierName={supplier.supplier_name}
        vouchers={vouchers}
        error={error}
        deleteVoucher={handleDeleteVoucher}
        onVoucherDeleted={handleVoucherDeleted}
      />
    </>
  );
};

export default SupplierRow;
