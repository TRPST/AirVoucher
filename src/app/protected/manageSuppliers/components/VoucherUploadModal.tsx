import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "@mui/material";
import { Supplier, Voucher } from "../../../types/supplier";
import { useVoucherManagement } from "../../../../../hooks/useVoucherManagement";
import { Upload, Loader } from "lucide-react";
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
import {
  uploadBulkVouchersAction,
  checkExistingVouchersAction,
} from "../actions";

export interface VoucherEntry {
  id: string;
  type: string;
  amount: number;
  serialNumber: string;
  pin?: string;
  expiryDate?: string;
  exists?: boolean; // Flag to indicate if the voucher already exists
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
  exists?: boolean; // Flag to indicate if the voucher already exists
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
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSavingVouchers, setIsSavingVouchers] = useState(false);
  const [isStatusError, setIsStatusError] = useState<boolean>(false);
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

  // Check for existing vouchers after they're loaded
  useEffect(() => {
    const checkExistingVouchers = async () => {
      if (uploadedVouchers.length === 0) return;

      setIsCheckingDuplicates(true);
      setUploadStatus("Checking for existing vouchers...");

      try {
        // Get serial numbers from uploaded vouchers
        const serialNumbers = uploadedVouchers.map(
          (v) => v.voucher_serial_number,
        );

        // Check which serial numbers already exist
        const result = await checkExistingVouchersAction(
          supplier.supplier_name,
          serialNumbers,
        );

        if (result.error) {
          setUploadStatus(`Error checking for duplicates: ${result.error}`);
          return;
        }

        // Mark existing vouchers
        const existingSerialNumbers = new Set(
          result.existingSerialNumbers || [],
        );

        // Update voucher entries
        setVoucherEntries((prev) =>
          prev.map((entry) => ({
            ...entry,
            exists: existingSerialNumbers.has(entry.serialNumber),
          })),
        );

        // Update uploaded vouchers
        setUploadedVouchers((prev) =>
          prev.map((voucher) => ({
            ...voucher,
            exists: existingSerialNumbers.has(voucher.voucher_serial_number),
          })),
        );

        // Update status message
        const existingCount = existingSerialNumbers.size;
        if (existingCount > 0) {
          setUploadStatus(
            `${existingCount} of ${serialNumbers.length} vouchers already exist in the database.`,
          );
        } else {
          setUploadStatus(`All ${serialNumbers.length} vouchers are new.`);
        }
      } catch (error) {
        console.error("Error checking for existing vouchers:", error);
        setUploadStatus("Error checking for duplicates. Proceeding anyway.");
      } finally {
        setIsCheckingDuplicates(false);
      }
    };

    checkExistingVouchers();
  }, [uploadedVouchers.length, supplier.supplier_name]);

  // Handle file change
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setUploadStatus(null);
    setIsStatusError(false);
    setVoucherEntries([]);
    setUploadedVouchers([]);
    setCurrentVoucher(null);

    try {
      // Get supplier name and normalize it for case-insensitive comparison
      const supplierName = supplier.supplier_name.toLowerCase();

      console.log("Processing file for supplier:", supplierName);
      console.log("File name:", file.name);
      console.log("File type:", file.type);
      console.log("File size:", file.size);

      // Check which supplier handler to use
      if (supplierName === "ringa") {
        await handleRingaFileUpload(
          file,
          supplier,
          setVoucherEntries,
          setCurrentVoucher,
          setUploadedVouchers,
          (message: string | null) => {
            setUploadStatus(message);
            // Set error status based on message content
            if (
              message &&
              (message.includes("No valid") ||
                message.includes("doesn't seem") ||
                message.includes("Could not parse"))
            ) {
              setIsStatusError(true);
            } else {
              setIsStatusError(false);
            }
          },
        );
      } else if (supplierName === "hollywoodbets") {
        await handleHollywoodbetsFileUpload(
          file,
          supplier,
          setVoucherEntries,
          setCurrentVoucher,
          setUploadedVouchers,
          (message: string | null) => {
            setUploadStatus(message);
            // Set error status based on message content
            if (
              message &&
              (message.includes("No valid") ||
                message.includes("doesn't seem") ||
                message.includes("Could not parse"))
            ) {
              setIsStatusError(true);
            } else {
              setIsStatusError(false);
            }
          },
        );
      } else if (supplierName === "easyload") {
        await handleEasyloadFileUpload(
          file,
          supplier,
          setVoucherEntries,
          setCurrentVoucher,
          setUploadedVouchers,
          (message: string | null) => {
            setUploadStatus(message);
            // Set error status based on message content
            if (
              message &&
              (message.includes("No valid") ||
                message.includes("doesn't seem") ||
                message.includes("Could not parse"))
            ) {
              setIsStatusError(true);
            } else {
              setIsStatusError(false);
            }
          },
        );
      } else {
        setUploadStatus(
          `File upload for ${supplier.supplier_name} is not supported yet.`,
        );
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadStatus(
        `Error processing file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
      setIsStatusError(true);
    } finally {
      setIsProcessingFile(false);
      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle removing a voucher from the list
  const handleRemoveVoucher = (serialNumber: string) => {
    // Remove from voucher entries
    setVoucherEntries((prev) =>
      prev.filter((entry) => entry.serialNumber !== serialNumber),
    );

    // Remove from uploaded vouchers
    setUploadedVouchers((prev) =>
      prev.filter((voucher) => voucher.voucher_serial_number !== serialNumber),
    );

    // Update current voucher if needed
    if (currentVoucher?.voucher_serial_number === serialNumber) {
      const remaining = uploadedVouchers.filter(
        (v) => v.voucher_serial_number !== serialNumber,
      );
      setCurrentVoucher(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Handle save vouchers
  const handleSaveVouchers = async () => {
    if (uploadedVouchers.length === 0) return;

    setIsSavingVouchers(true);
    try {
      // Filter out vouchers that already exist
      const newVouchers = uploadedVouchers.filter((v) => !v.exists);

      if (newVouchers.length === 0) {
        setUploadStatus(
          "No new vouchers to upload. All vouchers already exist in the database.",
        );
        setIsSavingVouchers(false);
        return;
      }

      setUploadStatus(`Saving ${newVouchers.length} vouchers...`);

      // Call the server action to save the vouchers
      const result = await uploadBulkVouchersAction(newVouchers);

      if (result.error) {
        setUploadStatus(`Error saving vouchers: ${result.error}`);
        setIsStatusError(true);
      } else if (!result.success) {
        // All vouchers were duplicates
        setUploadStatus(
          result.message ||
            "No new vouchers were uploaded. All vouchers already exist in the database.",
        );
        setIsStatusError(true);
      } else {
        // Show success message with duplicate info if any
        if (result.duplicates && result.duplicates > 0) {
          setUploadStatus(
            result.message ||
              `Successfully uploaded ${result.count} vouchers. ${result.duplicates} duplicate vouchers were skipped.`,
          );

          // Give the user a moment to see the message before closing
          setTimeout(() => {
            onClose(true);
          }, 2000);
        } else {
          // No duplicates, close immediately
          onClose(true);
        }
      }
    } catch (error) {
      console.error("Error saving vouchers:", error);
      setUploadStatus("Error saving vouchers. Please try again.");
      setIsStatusError(true);
    } finally {
      setIsSavingVouchers(false);
    }
  };

  // Determine if the save button should be disabled
  const isSaveDisabled =
    uploadedVouchers.length === 0 ||
    uploadedVouchers.every((v) => v.exists) ||
    isCheckingDuplicates ||
    isSavingVouchers;

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

        {/* Loading indicator for file processing */}
        {isProcessingFile && (
          <div className="mb-6 flex items-center justify-center">
            <Loader className="mr-2 h-5 w-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Processing file, please wait...
            </span>
          </div>
        )}

        {/* Loading indicator for saving vouchers */}
        {isSavingVouchers && (
          <div className="mb-6 flex items-center justify-center">
            <Loader className="mr-2 h-5 w-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Saving vouchers to database...
            </span>
          </div>
        )}

        {uploadStatus && (
          <StatusMessage message={uploadStatus} isError={isStatusError} />
        )}

        {/* Detailed Voucher Entries Table */}
        {voucherEntries.length > 0 && (
          <VoucherEntriesTable
            entries={voucherEntries}
            onRemoveVoucher={handleRemoveVoucher}
            isCheckingDuplicates={isCheckingDuplicates}
          />
        )}
      </div>

      <ModalFooter
        onClose={() => onClose(false)}
        handleSaveVouchers={handleSaveVouchers}
        isDisabled={isSaveDisabled}
      />
    </Dialog>
  );
};

export default VoucherUploadModal;
