import React, { useState, useRef } from "react";
import { Dialog } from "@mui/material";
import { Supplier, Voucher } from "../../../types/supplier";
import { useVoucherManagement } from "../../../../../hooks/useVoucherManagement";
import { Upload } from "lucide-react";
import ModalHeader from "./VoucherUploadModal/ModalHeader";
import FileUploadSection from "./VoucherUploadModal/FileUploadSection";
import StatusMessage from "./VoucherUploadModal/StatusMessage";
import VoucherEntriesTable from "./VoucherUploadModal/VoucherEntriesTable";
import ModalFooter from "./VoucherUploadModal/ModalFooter";
import {
  handleRingaFileUpload,
  handleHollywoodbetsFileUpload,
  handleEasyloadFileUpload,
} from "./VoucherUploadModal/fileHandlers";
import { uploadBulkVouchersAction } from "../actions";

export interface VoucherEntry {
  id: string;
  type: string;
  amount: number;
  serialNumber: string;
  pin?: string;
  expiryDate?: string;
}

export interface UploadedVoucher {
  id: string;
  name: string;
  vendorId: string;
  amount: number;
  supplier_id: number | string;
  supplier_name: string;
  total_comm: number;
  retailer_comm: number;
  sales_agent_comm: number;
  profit: number;
  networkProvider: string;
  voucher_serial_number: string;
  voucher_pin: string;
  expiry_date?: string;
  category: string;
  status: string;
  source: string;
  displayName?: string;
}

interface VoucherUploadModalProps {
  isOpen: boolean;
  supplier: Supplier;
  onClose: (refresh?: boolean) => void;
}

const VoucherUploadModal: React.FC<VoucherUploadModalProps> = ({
  isOpen,
  supplier,
  onClose,
}) => {
  const [uploadedVouchers, setUploadedVouchers] = useState<UploadedVoucher[]>(
    [],
  );
  const [currentVoucher, setCurrentVoucher] = useState<UploadedVoucher | null>(
    null,
  );
  const [voucherEntries, setVoucherEntries] = useState<VoucherEntry[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadPreview,
    uploadError,
    handleFileSelect: handleFileSelectFromHook,
    uploadVouchers,
    clearUploadPreview,
  } = useVoucherManagement();

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Determine which handler to use based on supplier name
    if (supplier.supplier_name === "Ringa") {
      handleRingaFileUpload(
        file,
        supplier,
        setVoucherEntries,
        setCurrentVoucher,
        setUploadedVouchers,
        setUploadStatus,
      );
    } else if (supplier.supplier_name === "Hollywoodbets") {
      handleHollywoodbetsFileUpload(
        file,
        supplier,
        setVoucherEntries,
        setCurrentVoucher,
        setUploadedVouchers,
        setUploadStatus,
      );
    } else if (supplier.supplier_name === "Easyload") {
      handleEasyloadFileUpload(
        file,
        supplier,
        setVoucherEntries,
        setCurrentVoucher,
        setUploadedVouchers,
        setUploadStatus,
      );
    }
  };

  // Handle save vouchers
  const handleSaveVouchers = async () => {
    if (uploadedVouchers.length === 0) return;

    try {
      setUploadStatus("Saving vouchers...");

      // Call the server action to save the vouchers
      const result = await uploadBulkVouchersAction(uploadedVouchers);

      if (result.error) {
        setUploadStatus(`Error saving vouchers: ${result.error}`);
      } else {
        // Close the modal and refresh the parent component
        onClose(true);
      }
    } catch (error) {
      console.error("Error saving vouchers:", error);
      setUploadStatus("Error saving vouchers. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose(false)}
      maxWidth="lg"
      fullWidth
      aria-labelledby="voucher-upload-modal-title"
      PaperProps={{
        style: {
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <ModalHeader
        supplierName={supplier.supplier_name}
        onClose={() => onClose(false)}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 dark:bg-gray-900">
        <FileUploadSection
          supplierName={supplier.supplier_name}
          handleFileSelect={handleFileSelect}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />

        {uploadStatus && <StatusMessage message={uploadStatus} />}

        {/* Detailed Voucher Entries Table */}
        {voucherEntries.length > 0 && (
          <VoucherEntriesTable entries={voucherEntries} />
        )}
      </div>

      <ModalFooter
        onClose={() => onClose(false)}
        handleSaveVouchers={handleSaveVouchers}
        isDisabled={uploadedVouchers.length === 0}
      />
    </Dialog>
  );
};

export default VoucherUploadModal;
