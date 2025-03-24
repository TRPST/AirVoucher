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

    // Create consolidated voucher entry
    const uploadedVoucher: UploadedVoucher = {
      id: `ringa-${Date.now()}`,
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
      metadata: {
        voucherCount: entries.length,
        serialNumbers: entries.map((e) => e.serialNumber),
        pins: entries.map((e) => e.pin || ""),
        date: new Date().toISOString().split("T")[0],
      },
      displayName: `${voucherType} (${entries.length} vouchers)`,
    };

    setUploadedVouchers([uploadedVoucher]);
    setCurrentVoucher(uploadedVoucher);
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

    // Filter out empty lines and headers
    const voucherLines = lines.filter(
      (line) =>
        line.trim() && !line.includes("VOUCHER") && !line.includes("PIN"),
    );

    if (voucherLines.length === 0) {
      setUploadStatus("No valid voucher entries found in file");
      return;
    }

    // Extract individual voucher entries
    const entries: VoucherEntry[] = [];
    const vouchersByAmount = new Map<
      number,
      { serials: string[]; pins: string[] }
    >();

    for (const line of voucherLines) {
      const parts = line.split(/\s+/);
      if (parts.length >= 3) {
        // Format: VOUCHER_NUMBER PIN AMOUNT
        const serialNumber = parts[0].trim();
        const pin = parts[1].trim();
        const amountStr = parts[2].replace("R", "").trim();
        const amount = parseFloat(amountStr);

        if (!isNaN(amount) && serialNumber && pin) {
          // Add to individual entries
          entries.push({
            id: `hwb-entry-${entries.length}-${Date.now()}`,
            type: `Hollywoodbets R${amount.toFixed(2)}`,
            amount,
            serialNumber,
            pin,
          });

          // Group by amount
          if (!vouchersByAmount.has(amount)) {
            vouchersByAmount.set(amount, { serials: [], pins: [] });
          }
          const group = vouchersByAmount.get(amount)!;
          group.serials.push(serialNumber);
          group.pins.push(pin);
        }
      }
    }

    setVoucherEntries(entries);

    // Convert grouped vouchers to array of voucher objects
    const groupedVouchers: UploadedVoucher[] = Array.from(
      vouchersByAmount.entries(),
    ).map(([amount, { serials, pins }]) => ({
      id: `hwb-${amount}-${Date.now()}`,
      name: `Hollywoodbets R${amount.toFixed(2)}`,
      vendorId: "HOLLYWOODBETS",
      amount,
      supplier_id: supplier.id,
      supplier_name: supplier.supplier_name,
      total_comm: 0,
      retailer_comm: 0,
      sales_agent_comm: 0,
      profit: 0,
      networkProvider: "CELLC",
      metadata: {
        voucherCount: serials.length,
        serialNumbers: serials,
        pins,
        date: new Date().toISOString().split("T")[0],
      },
      displayName: `Hollywoodbets R${amount.toFixed(2)} (${serials.length} vouchers)`,
    }));

    setUploadedVouchers(groupedVouchers);

    // If there's only one voucher type, select it automatically
    if (groupedVouchers.length === 1) {
      setCurrentVoucher(groupedVouchers[0]);
    }

    setUploadStatus(
      `Successfully processed ${entries.length} Hollywoodbets vouchers in ${groupedVouchers.length} groups`,
    );
  } catch (error) {
    console.error("Error processing Hollywoodbets file:", error);
    setUploadStatus("Error processing file. Please check the file format.");
  }
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

    // Filter out empty lines and headers
    const voucherLines = lines.filter(
      (line) =>
        line.trim() && !line.includes("VOUCHER") && !line.includes("PIN"),
    );

    if (voucherLines.length === 0) {
      setUploadStatus("No valid voucher entries found in file");
      return;
    }

    // Group vouchers by amount
    const vouchersByAmount = new Map<number, string[]>();
    const allEntries: VoucherEntry[] = [];

    for (const line of voucherLines) {
      const columns = line.split(",");
      if (columns.length >= 4) {
        const amount = parseFloat(columns[1]);
        const serialNumber = columns[2]?.trim() || "";
        const pin = columns[3]?.trim() || "";

        if (!isNaN(amount) && serialNumber) {
          if (!vouchersByAmount.has(amount)) {
            vouchersByAmount.set(amount, []);
          }
          vouchersByAmount.get(amount)?.push(serialNumber);

          // Add to individual entries
          allEntries.push({
            id: `easyload-entry-${allEntries.length}-${Date.now()}`,
            type: `Easyload R${amount.toFixed(2)}`,
            amount: amount,
            serialNumber,
            pin,
          });
        }
      }
    }

    setVoucherEntries(allEntries);

    // Convert grouped vouchers to array of voucher objects
    const groupedVouchers: UploadedVoucher[] = Array.from(
      vouchersByAmount.entries(),
    ).map(([amount, serialNumbers]) => ({
      id: `easyload-${amount}-${Date.now()}`,
      name: `Easyload R${amount.toFixed(2)}`,
      vendorId: "EASYLOAD",
      amount: amount,
      supplier_id: supplier.id,
      supplier_name: supplier.supplier_name,
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
    }));

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
