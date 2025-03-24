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

interface VoucherMetadata {
  voucherCount: number;
  serialNumbers: string[];
  pins?: string[];
  batchNumber?: string;
  date?: string;
}

export interface UploadedVoucher {
  id?: string | number;
  name: string;
  vendorId: string;
  amount: number;
  supplier_id: number | string;
  supplier_name: string;
  total_comm: number;
  retailer_comm: number;
  sales_agent_comm: number;
  profit: number;
  networkProvider: "CELLC" | "MTN" | "TELKOM" | "VODACOM";
  metadata?: VoucherMetadata;
  displayName?: string;
}

// Interface for individual voucher entries
export interface VoucherEntry {
  id: string;
  type: string;
  amount: number;
  serialNumber: string;
  pin?: string;
  expiryDate?: string;
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
    if (!currentVoucher) return;

    try {
      // Call the API to save the vouchers
      await uploadVouchers([currentVoucher]);

      // Close the modal and refresh the parent component
      onClose(true);
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
        onClose={() => onClose()}
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
        onClose={() => onClose()}
        handleSaveVouchers={handleSaveVouchers}
        isDisabled={!currentVoucher}
      />
    </Dialog>
  );
};

export default VoucherUploadModal;
