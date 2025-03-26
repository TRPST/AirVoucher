import { Supplier } from "../../../../types/supplier";
import { UploadedVoucher, VoucherEntry } from "../VoucherUploadModal";

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export const handleRingaFileUpload = async (
  file: File,
  supplier: Supplier,
  setVoucherEntries: SetStateFunction<VoucherEntry[]>,
  setCurrentVoucher: SetStateFunction<UploadedVoucher | null>,
  setUploadedVouchers: SetStateFunction<UploadedVoucher[]>,
  setUploadStatus: SetStateFunction<string | null>,
) => {
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

    // Extract individual voucher entries with serial numbers and pins
    const entries: VoucherEntry[] = voucherLines.map((line, index) => {
      const columns = line.split("|");
      const columnsCount = columns.length;

      // For Ringa, the last column is the pin and second-to-last is the serial number
      const pin = columns[columnsCount - 1]?.trim() || "";
      const serialNumber = columns[columnsCount - 2]?.trim() || "";

      // Extract expiry date if available (usually in column 5)
      const expiryDate = columns[5] || "";

      return {
        id: `ringa-entry-${index}-${Date.now()}`,
        type: voucherType,
        amount: parseFloat(amount),
        serialNumber,
        pin,
        expiryDate,
      };
    });

    setVoucherEntries(entries);

    // Create individual voucher entries for each serial number/pin
    const uploadedVouchers: UploadedVoucher[] = entries.map((entry, index) => ({
      id: `ringa-${index}-${Date.now()}`,
      name: voucherType,
      vendorId: "RINGA",
      amount: parseFloat(amount),
      supplier_id: supplier.id,
      supplier_name: supplier.supplier_name,
      total_comm: 0,
      retailer_comm: 0,
      sales_agent_comm: 0,
      profit: 0,
      networkProvider: "CELLC",
      voucher_serial_number: entry.serialNumber,
      voucher_pin: entry.pin || "",
      expiry_date: entry.expiryDate || "",
      category: "data",
      status: "active",
      source: "manual_upload",
    }));

    setUploadedVouchers(uploadedVouchers);
    // Just set the first voucher as current for display purposes
    setCurrentVoucher(uploadedVouchers[0]);
    setUploadStatus(`Successfully processed ${entries.length} Ringa vouchers`);
  } catch (error) {
    console.error("Error processing Ringa file:", error);
    setUploadStatus("Error processing file. Please check the file format.");
  }
};

export const handleHollywoodbetsFileUpload = async (
  file: File,
  supplier: Supplier,
  setVoucherEntries: SetStateFunction<VoucherEntry[]>,
  setCurrentVoucher: SetStateFunction<UploadedVoucher | null>,
  setUploadedVouchers: SetStateFunction<UploadedVoucher[]>,
  setUploadStatus: SetStateFunction<string | null>,
) => {
  try {
    const text = await file.text();
    const lines = text.split("\n");

    // Filter out empty lines and keep only lines that start with "D|"
    const voucherLines = lines.filter(
      (line) => line.trim() && line.startsWith("D|"),
    );

    if (voucherLines.length === 0) {
      setUploadStatus("No valid voucher entries found in file");
      return;
    }

    // Validate that this is a Hollywoodbets file
    const firstLine = voucherLines[0].split("|");
    if (!firstLine[1] || !firstLine[1].includes("HWB")) {
      setUploadStatus(
        "This doesn't seem to be a Hollywoodbets file. Please upload the correct file for Hollywoodbets supplier.",
      );
      return;
    }

    // Extract individual voucher entries
    const entries: VoucherEntry[] = [];
    const uploadedVouchers: UploadedVoucher[] = [];

    for (const line of voucherLines) {
      const columns = line.split("|");

      // Ensure we have enough columns
      if (columns.length >= 7) {
        // Format based on the sample: D|HWB000010|10.00|1095|10|02/05/2027|39942|1359713349|00186831686370119
        const voucherType = columns[1].trim();
        const amountStr = columns[2].trim();
        const amount = parseFloat(amountStr);

        // Get expiry date from column 6
        const expiryDate = columns[5].trim();

        // For Hollywoodbets, the last column is the pin and second-to-last is the serial number
        const columnsCount = columns.length;
        const pin = columns[columnsCount - 1]?.trim() || "";
        const serialNumber = columns[columnsCount - 2]?.trim() || "";

        if (!isNaN(amount) && serialNumber && pin) {
          // Add to individual entries
          entries.push({
            id: `hwb-entry-${entries.length}-${Date.now()}`,
            type: `${voucherType} R${amount.toFixed(2)}`,
            amount,
            serialNumber,
            pin,
            expiryDate: formatExpiryDate(expiryDate),
          });

          // Create individual voucher entry
          uploadedVouchers.push({
            id: `hwb-${entries.length}-${Date.now()}`,
            name: `${voucherType} R${amount.toFixed(2)}`,
            vendorId: "HOLLYWOODBETS",
            amount,
            supplier_id: supplier.id,
            supplier_name: supplier.supplier_name,
            total_comm: 0,
            retailer_comm: 0,
            sales_agent_comm: 0,
            profit: 0,
            networkProvider: "CELLC",
            voucher_serial_number: serialNumber,
            voucher_pin: pin,
            expiry_date: formatExpiryDate(expiryDate),
            category: "data",
            status: "active",
            source: "manual_upload",
          });
        }
      }
    }

    setVoucherEntries(entries);
    setUploadedVouchers(uploadedVouchers);

    // Set the first voucher as current for display purposes
    if (uploadedVouchers.length > 0) {
      setCurrentVoucher(uploadedVouchers[0]);
    }

    setUploadStatus(
      `Successfully processed ${entries.length} Hollywoodbets vouchers`,
    );
  } catch (error) {
    console.error("Error processing Hollywoodbets file:", error);
    setUploadStatus("Error processing file. Please check the file format.");
  }
};

// Helper function to format expiry date from DD/MM/YYYY to YYYY-MM-DD
const formatExpiryDate = (dateString: string): string => {
  if (!dateString || !dateString.includes("/")) return "";

  const parts = dateString.split("/");
  if (parts.length !== 3) return "";

  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];

  return `${year}-${month}-${day}`;
};

export const handleEasyloadFileUpload = async (
  file: File,
  supplier: Supplier,
  setVoucherEntries: SetStateFunction<VoucherEntry[]>,
  setCurrentVoucher: SetStateFunction<UploadedVoucher | null>,
  setUploadedVouchers: SetStateFunction<UploadedVoucher[]>,
  setUploadStatus: SetStateFunction<string | null>,
) => {
  try {
    const text = await file.text();
    const lines = text.split("\n");

    // Filter for valid Easyload voucher lines
    const voucherLines = lines.filter(
      (line) => line.trim() && line.trim().startsWith("Easyload"),
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

    const allEntries: VoucherEntry[] = [];
    const uploadedVouchers: UploadedVoucher[] = [];

    for (const line of voucherLines) {
      // Split by comma but handle cases where there might be extra commas
      const parts = line.split(",");

      if (parts.length >= 4) {
        // Format based on sample: Easyload,5,25357070837651,00100050000096969531,20270822
        const voucherType = parts[0]?.trim() || "Easyload";
        const amountStr = parts[1]?.trim() || "0";
        const amount = parseFloat(amountStr);
        const pin = parts[3]?.trim() || "";
        const serialNumber = parts[2]?.trim() || "";

        // Get expiry date from the last column
        const expiryDate = parts[parts.length - 1]?.trim() || "";

        // Format expiry date (YYYYMMDD to YYYY-MM-DD)
        const formattedExpiryDate = formatEasyloadExpiryDate(expiryDate);

        if (!isNaN(amount) && serialNumber && pin) {
          // Add to individual entries
          allEntries.push({
            id: `easyload-entry-${allEntries.length}-${Date.now()}`,
            type: `${voucherType} R${amount.toFixed(2)}`,
            amount: amount,
            serialNumber,
            pin,
            expiryDate: formattedExpiryDate,
            exists: false, // Initialize as not existing
          });

          // Create individual voucher entry
          uploadedVouchers.push({
            id: `easyload-${allEntries.length}-${Date.now()}`,
            name: `${voucherType} R${amount.toFixed(2)}`,
            vendorId: "EASYLOAD",
            amount: amount,
            supplier_id: supplier.id,
            supplier_name: supplier.supplier_name,
            total_comm: 0,
            retailer_comm: 0,
            sales_agent_comm: 0,
            profit: 0,
            networkProvider: "CELLC",
            voucher_serial_number: serialNumber,
            voucher_pin: pin,
            expiry_date: formattedExpiryDate,
            category: "data",
            status: "active",
            source: "manual_upload",
            exists: false, // Initialize as not existing
          });
        }
      }
    }

    if (allEntries.length === 0) {
      setUploadStatus(
        "No valid voucher entries found in the file. Please check the file format.",
      );
      return;
    }

    setVoucherEntries(allEntries);
    setUploadedVouchers(uploadedVouchers);

    // Set the first voucher as current for display purposes
    if (uploadedVouchers.length > 0) {
      setCurrentVoucher(uploadedVouchers[0]);
    }

    setUploadStatus(
      `Successfully processed ${allEntries.length} Easyload vouchers`,
    );
  } catch (error) {
    console.error("Error processing Easyload file:", error);
    setUploadStatus(
      `Error processing file: ${error instanceof Error ? error.message : "Unknown error"}. Please check the file format.`,
    );
  }
};

// Helper function to format Easyload expiry date from YYYYMMDD to YYYY-MM-DD
const formatEasyloadExpiryDate = (dateString: string): string => {
  if (!dateString || dateString.length !== 8) return "";

  try {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting expiry date:", error);
    return "";
  }
};
