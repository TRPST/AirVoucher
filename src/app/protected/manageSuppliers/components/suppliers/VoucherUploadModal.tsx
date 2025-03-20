import React, { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Supplier, Voucher } from "../../../../types/supplier";
import { useVoucherManagement } from "../../../../../../hooks/useVoucherManagement";
import { Upload } from "lucide-react";

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
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadPreview,
    uploadError,
    handleFileSelect: handleFileSelectFromHook,
    uploadVouchers,
    clearUploadPreview,
  } = useVoucherManagement();

  // Handle file selection - our local implementation
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Determine which handler to use based on supplier name
    if (supplier.name === "Ringa") {
      handleRingaFileUpload(file);
    } else if (supplier.name === "Hollywoodbets") {
      handleHollywoodbetsFileUpload(file);
    } else if (supplier.name === "Easyload") {
      handleEasyloadFileUpload(file);
    }

    // Reset the input so the same file can be selected again
    event.target.value = "";
  };

  // Handle Ringa file upload
  const handleRingaFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split("\n");

      const voucherLines = lines.filter((line) => line.startsWith("D"));

      if (voucherLines.length === 0) {
        setUploadStatus("No valid voucher entries found in file");
        return;
      }

      // Validate that this is a Ringa file
      const firstLine = voucherLines[0].split("|");
      if (!firstLine[1] || !firstLine[1].includes("RINGA")) {
        setUploadStatus(
          "This doesn't seem to be a Ringa file. Please upload the correct file for Ringa supplier.",
        );
        return;
      }

      const [_, voucherType, amount] = firstLine;

      const serialNumbers = voucherLines.map((line) => {
        const columns = line.split("|");
        return columns[columns.length - 1].trim();
      });

      // Create consolidated voucher entry
      const uploadedVoucher: UploadedVoucher = {
        id: `ringa-${Date.now()}`,
        name: voucherType,
        vendorId: "RINGA",
        amount: parseFloat(amount),
        supplier_id: supplier.id,
        supplier_name: supplier.name,
        total_comm: 0,
        retailer_comm: 0,
        sales_agent_comm: 0,
        profit: 0,
        networkProvider: "CELLC",
        metadata: {
          voucherCount: voucherLines.length,
          serialNumbers: serialNumbers,
        },
      };

      setCurrentVoucher(uploadedVoucher);
      setUploadedVouchers([uploadedVoucher]);
      setUploadStatus(
        `Successfully processed ${voucherLines.length} Ringa vouchers`,
      );
    } catch (error) {
      console.error("Error processing Ringa file:", error);
      setUploadStatus("Error processing file. Please check the file format.");
    }
  };

  // Handle Hollywoodbets file upload
  const handleHollywoodbetsFileUpload = async (file: File) => {
    try {
      const text = await file.text();

      // Handle different line endings
      const lines = text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n");

      // Filter for data lines
      const voucherLines = lines.filter((line) => {
        const trimmed = line.trim();
        return trimmed.length > 0 && trimmed.startsWith("D");
      });

      if (voucherLines.length === 0) {
        setUploadStatus("No valid voucher entries found in file");
        return;
      }

      // Parse the first line
      const firstLine = voucherLines[0].split("|");

      if (firstLine.length < 3) {
        setUploadStatus("Invalid file format. Expected pipe-delimited data.");
        return;
      }

      // Validate that this is a Hollywoodbets file
      if (!firstLine[1] || !firstLine[1].includes("HWB")) {
        setUploadStatus(
          "This doesn't seem to be a Hollywoodbets file. Please upload the correct file for Hollywoodbets supplier.",
        );
        return;
      }

      const voucherType = firstLine[1];
      const amount = parseFloat(firstLine[2]);

      if (isNaN(amount)) {
        setUploadStatus("Invalid amount value in file");
        return;
      }

      // Extract serial numbers and pins
      const serialNumbers = [];
      const pins = [];

      for (const line of voucherLines) {
        const columns = line.split("|");
        if (columns.length >= 3) {
          serialNumbers.push(columns[columns.length - 2]?.trim() || "");
          pins.push(columns[columns.length - 1]?.trim() || "");
        }
      }

      // Create consolidated voucher entry
      const uploadedVoucher: UploadedVoucher = {
        id: `hwb-${Date.now()}`,
        name: voucherType,
        vendorId: "HWB",
        amount: amount,
        supplier_id: supplier.id,
        supplier_name: supplier.name,
        total_comm: 0,
        retailer_comm: 0,
        sales_agent_comm: 0,
        profit: 0,
        networkProvider: "CELLC",
        metadata: {
          voucherCount: voucherLines.length,
          serialNumbers: serialNumbers,
          pins: pins,
          batchNumber: file.name.split("_")[3]?.replace(".txt", "") || "",
          date: file.name.split("_")[4]?.split(".")[0] || "",
        },
      };

      setCurrentVoucher(uploadedVoucher);
      setUploadedVouchers([uploadedVoucher]);
      setUploadStatus(
        `Successfully processed ${voucherLines.length} Hollywoodbets vouchers`,
      );
    } catch (error) {
      console.error("Error processing Hollywoodbets file:", error);
      setUploadStatus("Error processing file. Please check the file format.");
    }
  };

  // Handle Easyload file upload
  const handleEasyloadFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split("\n");

      // Filter for valid voucher lines
      const voucherLines = lines.filter(
        (line) => line.trim().length > 0 && line.trim().startsWith("Easyload"),
      );

      if (voucherLines.length === 0) {
        setUploadStatus("No valid Easyload voucher entries found in file");
        return;
      }

      // Validate that this is an Easyload file
      const firstLine = voucherLines[0].split(",");
      if (!firstLine[0] || !firstLine[0].includes("Easyload")) {
        setUploadStatus(
          "This doesn't seem to be an Easyload file. Please upload the correct file for Easyload supplier.",
        );
        return;
      }

      // Group vouchers by amount
      const vouchersByAmount = new Map<number, string[]>();

      for (const line of voucherLines) {
        const columns = line.split(",");
        if (columns.length >= 4) {
          const amount = parseFloat(columns[1]);
          const serialNumber = columns[2]?.trim() || "";

          if (!isNaN(amount) && serialNumber) {
            if (!vouchersByAmount.has(amount)) {
              vouchersByAmount.set(amount, []);
            }
            vouchersByAmount.get(amount)?.push(serialNumber);
          }
        }
      }

      // Convert grouped vouchers to array of voucher objects
      const groupedVouchers = Array.from(vouchersByAmount.entries()).map(
        ([amount, serialNumbers]) => ({
          id: `easyload-${amount}-${Date.now()}`,
          name: `Easyload R${amount.toFixed(2)}`,
          vendorId: "EASYLOAD",
          amount: amount,
          supplier_id: supplier.id,
          supplier_name: supplier.name,
          total_comm: 0,
          retailer_comm: 0,
          sales_agent_comm: 0,
          profit: 0,
          networkProvider: "CELLC",
          metadata: {
            voucherCount: serialNumbers.length,
            serialNumbers: serialNumbers,
            date: new Date().toISOString().split("T")[0],
          },
          displayName: `Easyload R${amount.toFixed(2)} (${serialNumbers.length} vouchers)`,
        }),
      );

      setUploadedVouchers(groupedVouchers);

      // If there's only one voucher type, select it automatically
      if (groupedVouchers.length === 1) {
        setCurrentVoucher(groupedVouchers[0]);
      }

      setUploadStatus(
        `Successfully processed ${voucherLines.length} Easyload vouchers in ${groupedVouchers.length} groups`,
      );
    } catch (error) {
      console.error("Error processing Easyload file:", error);
      setUploadStatus("Error processing file. Please check the file format.");
    }
  };

  // Handle saving vouchers
  const handleSaveVouchers = async () => {
    if (!currentVoucher) return;

    try {
      // In a real app, this would be an API call to save the vouchers
      console.log("Saving voucher:", currentVoucher);

      // Simulate API call
      setTimeout(() => {
        setUploadStatus("Vouchers saved successfully!");
        // Close modal and refresh data after a short delay
        setTimeout(() => {
          onClose(true);
        }, 1000);
      }, 500);
    } catch (error) {
      console.error("Error saving vouchers:", error);
      setUploadStatus("Error saving vouchers. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">
            Upload Vouchers for {supplier.name}
          </h3>
          <button
            onClick={() => onClose()}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Upload a TXT file containing voucher data for {supplier.name}
            </p>
            <button
              onClick={handleFileSelect}
              className="flex items-center rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.csv"
            />
          </div>
        </div>

        {uploadStatus && (
          <div
            className={`mb-4 rounded p-3 text-sm ${
              uploadStatus.includes("Error") ||
              uploadStatus.includes("No valid")
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {uploadStatus}
          </div>
        )}

        {uploadedVouchers.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium">Processed Vouchers:</h4>
            <div className="max-h-60 overflow-y-auto rounded border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Voucher Count
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {uploadedVouchers.map((voucher) => (
                    <tr
                      key={voucher.id}
                      className={`cursor-pointer ${
                        currentVoucher?.id === voucher.id
                          ? "bg-blue-50 dark:bg-blue-900"
                          : ""
                      }`}
                      onClick={() => setCurrentVoucher(voucher)}
                    >
                      <td className="px-4 py-2 text-sm">{voucher.name}</td>
                      <td className="px-4 py-2 text-sm">
                        R{voucher.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {voucher.metadata?.voucherCount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => onClose()}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveVouchers}
            disabled={!currentVoucher}
            className={`rounded px-4 py-2 text-sm font-medium text-white ${
              currentVoucher
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-blue-400"
            }`}
          >
            Save Vouchers
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherUploadModal;
