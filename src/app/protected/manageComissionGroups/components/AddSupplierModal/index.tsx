import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { MobileDataVoucher, Supplier, SupplierAPI } from "@/app/types/common";
import { useVoucherForm } from "@/hooks/useVoucherForm";
import {
  addVouchersToMobileDataVouchers,
  getSupplierApis,
} from "../../actions";

// Import components
import SupplierSection from "./SupplierSection";
import NetworkSelector from "./NetworkSelector";
import VoucherSection from "./VoucherSection";
import ActionButtons from "./ActionButtons";

// Add this type at the top of the file
type SupplierToApiMap = {
  [key: string]: SupplierAPI[];
};

// Add this type near the top of the file
type RingaVoucherBatch = {
  voucherType: string;
  amount: number;
  count: number;
  serialNumbers: string[];
};

const AddSupplierModal = ({
  isOpen,
  onClose,
  onAddVouchers,
  commGroupId,
  commGroupName,
  existingVouchers,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddVouchers: (vouchers: MobileDataVoucher[]) => void;
  commGroupId: string;
  commGroupName: string;
  existingVouchers?: MobileDataVoucher[];
}) => {
  // Core state
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [selectedSupplierApi, setSelectedSupplierApi] =
    useState<SupplierAPI | null>(null);
  const [selectedVouchers, setSelectedVouchers] = useState<MobileDataVoucher[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("CELLC");
  const [voucherError, setVoucherError] = useState<string>("");
  const [easyloadVouchers, setEasyloadVouchers] = useState<any[]>([]);

  // Form handling
  const {
    formData: currentVoucher,
    errors,
    handleChange: handleVoucherFieldChange,
    validate,
    reset: resetVoucherForm,
    setFormData: setCurrentVoucher,
  } = useVoucherForm();

  const handleVoucherSelect = (selectedVoucher: MobileDataVoucher) => {
    setCurrentVoucher({
      ...selectedVoucher,
      supplier_id: selectedSupplier?.id || 0,
      supplier_name: selectedSupplier?.supplier_name || "",
      networkProvider: (selectedVoucher.vendorId?.toUpperCase() || "MTN") as
        | "CELLC"
        | "MTN"
        | "TELKOM"
        | "VODACOM",
    });
  };

  const handleAddVoucher = () => {
    if (!currentVoucher) return;

    // Validate commission values
    if (currentVoucher.total_comm <= 0) {
      setVoucherError("Please specify commission values");
      return;
    }

    // For Ringa vouchers, use the metadata from the uploaded file
    if (currentVoucher.metadata?.voucherCount) {
      setSelectedVouchers((prev) => [
        ...prev,
        {
          ...currentVoucher,
          // Keep the metadata for the table display
          metadata: currentVoucher.metadata,
        },
      ]);
    } else {
      // Handle non-Ringa vouchers as before
      setSelectedVouchers((prev) => [...prev, currentVoucher]);
    }

    // Reset the form
    resetVoucherForm();
    setVoucherError("");
  };

  const handleDeleteVoucher = (index: number) => {
    setSelectedVouchers((prevVouchers) =>
      prevVouchers.filter((_, i) => i !== index),
    );
  };

  const handleVoucherChange = (field: string, value: number) => {
    if (handleVoucherFieldChange) {
      // Convert to decimal (e.g., 0.105) for internal storage
      const decimalValue = value ? value / 100 : null;
      handleVoucherFieldChange(
        field as keyof typeof currentVoucher,
        decimalValue,
      );
    }
  };

  const handleSupplierSelect = async (supplier: Supplier | undefined) => {
    setSelectedSupplier(supplier);

    if (supplier) {
      try {
        const result = await getSupplierApis(supplier.supplier_name);
        if (result.supplierApis && result.supplierApis.length === 1) {
          // If supplier has exactly one API, select it automatically
          setSelectedSupplierApi(result.supplierApis[0]);
        } else {
          // If supplier has multiple APIs or no APIs, clear the selection
          setSelectedSupplierApi(null);
        }
      } catch (error) {
        console.error("Error fetching supplier APIs:", error);
        setSelectedSupplierApi(null);
      }
    } else {
      setSelectedSupplierApi(null);
    }

    resetVoucherForm(); // Keep this to reset the form for new voucher entries
  };

  const handleSubmit = async () => {
    if (selectedVouchers.length > 0 && commGroupId) {
      setLoading(true);

      const vouchersWithCommGroupId = selectedVouchers.map((voucher) => {
        // Calculate profit based on commission values
        let voucherAmount = voucher.amount;

        // For Glocell vouchers, divide by 100 for calculation (since they're in cents)
        if (voucher.supplier_name?.toLowerCase() === "glocell") {
          voucherAmount = voucherAmount / 100;
        }

        const totalCommissionAmount = voucherAmount * (voucher.total_comm || 0);
        const retailerCommissionAmount =
          totalCommissionAmount * (voucher.retailer_comm || 0);
        const salesAgentCommissionAmount =
          totalCommissionAmount * (voucher.sales_agent_comm || 0);
        const calculatedProfit =
          totalCommissionAmount -
          retailerCommissionAmount -
          salesAgentCommissionAmount;

        // Create a new object with only the fields we want to save
        const {
          name,
          vendorId,
          amount,
          total_comm,
          retailer_comm,
          sales_agent_comm,
          supplier_id,
          supplier_name,
        } = voucher;

        return {
          name,
          vendorId,
          amount,
          total_comm,
          retailer_comm,
          sales_agent_comm,
          supplier_id,
          supplier_name,
          profit: Number(calculatedProfit.toFixed(2)),
          comm_group_id: commGroupId,
        };
      });

      console.log("VOUCHERS WITH COMM GROUP ID", vouchersWithCommGroupId);

      try {
        const result = await addVouchersToMobileDataVouchers(
          vouchersWithCommGroupId,
        );

        if ("error" in result) {
          console.error("Error adding vouchers:", result.error);
        } else {
          // Reset all form values on successful submission
          setSelectedSupplier(undefined);
          setSelectedSupplierApi(null);
          setSelectedVouchers([]);
          resetVoucherForm();
          onAddVouchers(selectedVouchers);
          onClose();
        }
      } catch (error) {
        console.error("Error adding vouchers:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalClose = () => {
    setSelectedSupplier(undefined);
    setSelectedSupplierApi(null);
    setSelectedVouchers([]);
    resetVoucherForm();
    onClose();
  };

  const handleRingaFileUpload = async (file: File) => {
    if (!selectedSupplier) {
      alert("Please select a supplier first");
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split("\n");

      const voucherLines = lines.filter((line) => line.startsWith("D"));

      if (voucherLines.length === 0) {
        alert("No valid voucher entries found in file");
        return;
      }

      // Validate that this is a Ringa file
      const firstLine = voucherLines[0].split("|");
      if (!firstLine[1] || !firstLine[1].includes("RINGA")) {
        alert(
          "This doesn't seem to be a Ringa file. Please upload the correct file for Ringa supplier.",
        );
        return;
      }

      const [_, voucherType, amount] = firstLine;

      const serialNumbers = voucherLines.map((line) => {
        const columns = line.split("|");
        return columns[columns.length - 1].trim();
      });

      // Create consolidated voucher entry but don't add it to selectedVouchers yet
      const uploadedVoucher = {
        name: voucherType,
        vendorId: "RINGA",
        amount: parseFloat(amount),
        supplier_id: selectedSupplier.id,
        supplier_name: selectedSupplier.supplier_name,
        total_comm: 0,
        retailer_comm: 0,
        sales_agent_comm: 0,
        profit: 0,
        networkProvider: "CELLC" as const,
        metadata: {
          voucherCount: voucherLines.length,
          serialNumbers: serialNumbers,
        },
      };

      // Update the current voucher to show in the form
      setCurrentVoucher(uploadedVoucher);
    } catch (error) {
      console.error("Error processing Ringa file:", error);
      alert("Error processing file. Please check the file format.");
    }
  };

  const handleHollywoodbetsFileUpload = async (file: File) => {
    if (!selectedSupplier) {
      alert("Please select a supplier first");
      return;
    }

    try {
      const text = await file.text();

      // Handle different line endings (Windows, Unix, Mac)
      const lines = text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n");

      // Filter for data lines that start with "D" and have content
      const voucherLines = lines.filter((line) => {
        const trimmed = line.trim();
        return trimmed.length > 0 && trimmed.startsWith("D");
      });

      if (voucherLines.length === 0) {
        console.error(
          "No voucher lines found. File content:",
          text.substring(0, 500),
        );
        alert("No valid voucher entries found in file");
        return;
      }

      // Parse the first line to get voucher type and amount
      const firstLine = voucherLines[0].split("|");

      if (firstLine.length < 3) {
        console.error("Invalid line format:", voucherLines[0]);
        alert("Invalid file format. Expected pipe-delimited data.");
        return;
      }

      // Validate that this is a Hollywoodbets file
      if (!firstLine[1] || !firstLine[1].includes("HWB")) {
        alert(
          "This doesn't seem to be a Hollywoodbets file. Please upload the correct file for Hollywoodbets supplier.",
        );
        return;
      }

      const voucherType = firstLine[1]; // Second column is voucher type
      const amount = parseFloat(firstLine[2]); // Third column is amount

      if (isNaN(amount)) {
        console.error("Invalid amount:", firstLine[2]);
        alert("Invalid amount value in file");
        return;
      }

      // Extract serial numbers and pins from all lines
      const serialNumbers = [];
      const pins = [];

      for (const line of voucherLines) {
        const columns = line.split("|");
        if (columns.length >= 3) {
          // Make sure we have enough columns
          serialNumbers.push(columns[columns.length - 2]?.trim() || "");
          pins.push(columns[columns.length - 1]?.trim() || "");
        }
      }

      // Create consolidated voucher entry
      const uploadedVoucher = {
        id: `hwb-${Date.now()}`, // Add a unique ID for the dropdown
        name: voucherType,
        vendorId: "HWB",
        amount: amount,
        supplier_id: selectedSupplier.id,
        supplier_name: selectedSupplier.supplier_name,
        total_comm: 0,
        retailer_comm: 0,
        sales_agent_comm: 0,
        profit: 0,
        networkProvider: "CELLC" as const,
        metadata: {
          voucherCount: voucherLines.length,
          serialNumbers: serialNumbers,
          pins: pins,
          batchNumber: file.name.split("_")[3]?.replace(".txt", "") || "",
          date: file.name.split("_")[4]?.split(".")[0] || "",
        },
      };

      console.log("Created Hollywoodbets voucher:", uploadedVoucher);

      // Update the current voucher to show in the form
      setCurrentVoucher(uploadedVoucher);
    } catch (error) {
      console.error("Error processing Hollywoodbets file:", error);
      alert("Error processing file. Please check the file format.");
    }
  };

  const handleEasyloadFileUpload = async (file: File) => {
    if (!selectedSupplier) {
      alert("Please select a supplier first");
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split("\n");

      // Filter for valid voucher lines (must start with "Easyload")
      const voucherLines = lines.filter(
        (line) => line.trim().length > 0 && line.trim().startsWith("Easyload"),
      );

      if (voucherLines.length === 0) {
        alert("No valid Easyload voucher entries found in file");
        return;
      }

      // Validate that this is an Easyload file
      const firstLine = voucherLines[0].split(",");
      if (!firstLine[0] || !firstLine[0].includes("Easyload")) {
        alert(
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
          supplier_id: selectedSupplier.id,
          supplier_name: selectedSupplier.supplier_name,
          total_comm: 0,
          retailer_comm: 0,
          sales_agent_comm: 0,
          profit: 0,
          networkProvider: "CELLC" as const,
          metadata: {
            voucherCount: serialNumbers.length,
            serialNumbers: serialNumbers,
            date: new Date().toISOString().split("T")[0],
          },
          displayName: `Easyload R${amount.toFixed(2)} (${serialNumbers.length} vouchers)`,
        }),
      );

      // Set all vouchers to be available for selection
      setEasyloadVouchers(groupedVouchers);

      // If there's only one voucher type, select it automatically
      if (groupedVouchers.length === 1) {
        setCurrentVoucher(groupedVouchers[0]);
      }
    } catch (error) {
      console.error("Error processing Easyload file:", error);
      alert("Error processing file. Please check the file format.");
    }
  };

  // Update the handleFileUpload function to include Easyload
  const handleFileUpload = async (file: File) => {
    if (!selectedSupplier) {
      alert("Please select a supplier first");
      return;
    }

    const supplierName = selectedSupplier.supplier_name.toLowerCase();

    if (supplierName === "ringa") {
      await handleRingaFileUpload(file);
    } else if (supplierName === "hollywoodbets") {
      await handleHollywoodbetsFileUpload(file);
    } else if (supplierName === "easyload") {
      await handleEasyloadFileUpload(file);
    } else {
      // Existing file upload logic for other suppliers
      try {
        const text = await file.text();
        const vouchers = text
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => {
            const [name, vendorId, amount] = line.split(",");
            return {
              name: name.trim(),
              vendorId: vendorId.trim(),
              amount: parseFloat(amount.trim()),
              supplier_id: selectedSupplier?.id || 0,
              supplier_name: selectedSupplier?.supplier_name || "",
              total_comm: 0,
              retailer_comm: 0,
              sales_agent_comm: 0,
              profit: 0,
            };
          });

        setSelectedVouchers((prev) => [...prev, ...vouchers]);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Error processing file. Please check the file format.");
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
        className="bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <div className="flex justify-center">
          <div className="w-full rounded-lg bg-white dark:bg-gray-800">
            <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
              Add Vouchers
            </h2>
            <h4 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-white">
              {commGroupName}
            </h4>

            <SupplierSection
              selectedSupplier={selectedSupplier}
              setSelectedSupplier={handleSupplierSelect}
              selectedSupplierApi={selectedSupplierApi}
              setSelectedSupplierApi={setSelectedSupplierApi}
            />

            {selectedSupplierApi?.name &&
              selectedSupplier?.supplier_name !== "OTT" &&
              (selectedSupplierApi.name === "Mobile Data" ||
                selectedSupplierApi.name === "Mobile Airtime") && (
                <NetworkSelector
                  selectedNetwork={selectedNetwork}
                  setSelectedNetwork={setSelectedNetwork}
                />
              )}

            <VoucherSection
              currentVoucher={currentVoucher}
              selectedSupplier={selectedSupplier}
              selectedSupplierApi={selectedSupplierApi}
              selectedNetwork={selectedNetwork}
              voucherError={voucherError}
              errors={errors}
              selectedVouchers={selectedVouchers}
              existingVouchers={existingVouchers}
              onVoucherSelect={handleVoucherSelect}
              onVoucherChange={handleVoucherChange}
              onAddVoucher={handleAddVoucher}
              onDeleteVoucher={handleDeleteVoucher}
              onFileUpload={handleFileUpload}
              easyloadVouchers={easyloadVouchers}
            />

            <ActionButtons
              loading={loading}
              onCancel={handleModalClose}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddSupplierModal;
