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

    // Log the first few lines to help with debugging
    console.log("First few lines of file:", text.split("\n").slice(0, 5));

    // Handle different line endings
    const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

    // Only keep lines that start with 'D'
    const voucherLines = lines.filter((line) => line.trim().startsWith("D"));

    console.log(`Found ${voucherLines.length} voucher lines starting with D`);

    if (voucherLines.length === 0) {
      setUploadStatus(
        "No valid Ringa voucher entries found in file. Voucher lines should start with 'D'.",
      );
      return;
    }

    // Validate that this is a Ringa file by checking the first voucher line
    const firstLine = voucherLines[0].split("|");
    if (firstLine.length < 2 || !firstLine[1].includes("RINGA")) {
      setUploadStatus(
        "This doesn't seem to be a Ringa file. Voucher names should contain 'RINGA'.",
      );
      return;
    }

    // Extract individual voucher entries
    const entries: VoucherEntry[] = [];
    const uploadedVouchers: UploadedVoucher[] = [];

    for (const line of voucherLines) {
      // Split by pipe character
      const parts = line.split("|");

      if (parts.length >= 7) {
        // Ensure we have enough columns
        // Format based on your specification:
        // D|RINGA0100|100.00|0|100.00|01/06/2026|127465|RT09C1044798F43|2691290788475827
        const voucherType = parts[1]?.trim() || ""; // 2nd column is voucher name

        // Skip this voucher if it doesn't contain "RINGA" in the name
        if (!voucherType.includes("RINGA")) {
          console.log(`Skipping non-Ringa voucher: ${voucherType}`);
          continue;
        }

        const amountStr = parts[2]?.trim() || "0"; // 3rd column is amount
        const amount = parseFloat(amountStr);
        const expiryDate = parts[5]?.trim() || ""; // 6th column is expiry date

        // For Ringa, the last column is the pin and second-to-last is the serial number
        const columnsCount = parts.length;
        const pin = parts[columnsCount - 1]?.trim() || "";
        const serialNumber = parts[columnsCount - 2]?.trim() || "";

        console.log(
          `Processing Ringa line: Type=${voucherType}, Amount=${amount}, SN=${serialNumber}, PIN=${pin}, Expiry=${expiryDate}`,
        );

        if (!isNaN(amount) && serialNumber && pin) {
          // Add to individual entries
          entries.push({
            id: `ringa-entry-${entries.length}-${Date.now()}`,
            type: `${voucherType} R${amount.toFixed(2)}`,
            amount,
            serialNumber,
            pin,
            expiryDate,
          });

          // Create individual voucher entry
          uploadedVouchers.push({
            id: `ringa-${entries.length}-${Date.now()}`,
            name: `${voucherType} R${amount.toFixed(2)}`,
            vendorId: "RINGA",
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
            expiry_date: expiryDate,
            category: "data",
            status: "active",
            source: "manual_upload",
          });
        }
      }
    }

    if (entries.length === 0) {
      setUploadStatus(
        "Could not parse any valid Ringa vouchers from the file. Please check the format or ensure the file contains Ringa vouchers.",
      );
      return;
    }

    setVoucherEntries(entries);
    setUploadedVouchers(uploadedVouchers);

    // Set the first voucher as current for display purposes
    if (uploadedVouchers.length > 0) {
      setCurrentVoucher(uploadedVouchers[0]);
    }

    setUploadStatus(`Successfully processed ${entries.length} Ringa vouchers`);
  } catch (error) {
    console.error("Error processing Ringa file:", error);
    setUploadStatus(
      `Error processing file: ${error instanceof Error ? error.message : "Unknown error"}. Please check the file format.`,
    );
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
