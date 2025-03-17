import React, { useRef } from "react";
import VoucherDropdown from "@/components/vouchers/VoucherDropdown";
import { MobileDataVoucher, Supplier, SupplierAPI } from "@/app/types/common";
import { Upload } from "lucide-react";

interface VoucherSelectProps {
  currentVoucher: MobileDataVoucher;
  selectedSupplier?: Supplier;
  selectedSupplierApi: SupplierAPI | null;
  mobileDataVouchers: MobileDataVoucher[];
  mobileAirtimeVouchers: MobileDataVoucher[];
  onVoucherSelect: (voucher: MobileDataVoucher) => void;
  ottVoucher: MobileDataVoucher;
  error?: string;
  selectedVouchers: MobileDataVoucher[];
  existingVouchers?: MobileDataVoucher[];
  onFileUpload: (file: File) => void;
  easyloadVouchers: MobileDataVoucher[];
}

const VoucherSelect = ({
  currentVoucher,
  selectedSupplier,
  selectedSupplierApi,
  mobileDataVouchers,
  mobileAirtimeVouchers,
  onVoucherSelect,
  ottVoucher,
  error,
  selectedVouchers,
  existingVouchers,
  onFileUpload,
  easyloadVouchers,
}: VoucherSelectProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
      event.target.value = "";
    }
  };

  const getAvailableVouchers = () => {
    const ensureId = (voucher: MobileDataVoucher) => ({
      ...voucher,
      networkProvider: (voucher.vendorId?.toUpperCase() || "MTN") as
        | "CELLC"
        | "MTN"
        | "TELKOM"
        | "VODACOM",
      id: voucher.id || `${voucher.name}-${voucher.vendorId}`,
      disabled:
        selectedVouchers.some(
          (selected) =>
            selected.name === voucher.name &&
            selected.vendorId === voucher.vendorId,
        ) ||
        existingVouchers.some(
          (existing) =>
            existing.name === voucher.name &&
            existing.vendorId === voucher.vendorId &&
            existing.supplier_name === selectedSupplier?.supplier_name,
        ),
    });

    if (selectedSupplier?.supplier_name === "OTT") {
      return [ensureId(ottVoucher)];
    }

    if (selectedSupplierApi?.name === "Mobile Data") {
      return mobileDataVouchers.map(ensureId);
    }

    if (selectedSupplierApi?.name === "Mobile Airtime") {
      return mobileAirtimeVouchers.map(ensureId);
    }

    // Handle Ringa, Hollywoodbets, and Easyload vouchers
    if (
      selectedSupplier?.supplier_name === "Ringa" ||
      selectedSupplier?.supplier_name === "Hollywoodbets"
    ) {
      // Show the current voucher if it's a batch with metadata
      if (currentVoucher?.metadata?.voucherCount) {
        // Create a clean voucher object without modifying the name
        return [
          {
            ...currentVoucher,
            id: `${currentVoucher.name}-batch-${Date.now()}`,
            // Keep the original name in the voucher object
            displayName:
              selectedSupplier?.supplier_name === "Hollywoodbets"
                ? `${currentVoucher.name} (${currentVoucher.metadata.voucherCount} vouchers - R${currentVoucher.amount.toFixed(2)})`
                : `${currentVoucher.name} (${currentVoucher.metadata.voucherCount} vouchers)`,
            disabled: false,
            networkProvider: "CELLC" as const,
            amount: currentVoucher.amount,
          },
        ];
      }
    }

    // Handle Easyload vouchers
    if (selectedSupplier?.supplier_name === "Easyload") {
      console.log("Processing Easyload vouchers:", easyloadVouchers);

      if (easyloadVouchers && easyloadVouchers.length > 0) {
        return easyloadVouchers.map((voucher) => ({
          ...voucher,
          id: voucher.id || `easyload-${voucher.amount}-${Date.now()}`,
          networkProvider: "CELLC" as const,
          disabled: selectedVouchers.some(
            (selected) =>
              selected.name === voucher.name &&
              selected.amount === voucher.amount,
          ),
        }));
      }

      // Show the current voucher if it's an Easyload batch
      if (currentVoucher?.metadata?.voucherCount) {
        return [
          {
            ...currentVoucher,
            id: `easyload-${currentVoucher.amount}-${Date.now()}`,
            displayName: `Easyload R${currentVoucher.amount.toFixed(2)} (${currentVoucher.metadata.voucherCount} vouchers)`,
            disabled: false,
            networkProvider: "CELLC" as const,
          },
        ];
      }
    }

    return [];
  };

  const formatVoucherDisplay = (
    voucher: MobileDataVoucher & {
      networkProvider: string;
      displayName?: string;
    },
  ) => {
    // If the voucher has a displayName property, use that for display
    if (voucher.displayName) {
      return voucher.displayName;
    }

    if (voucher.name === "OTT Variable Amount") {
      return voucher.name;
    }

    return `${voucher.vendorId.toUpperCase()} --- ${voucher.name}`;
  };

  const showUploadButton =
    selectedSupplier?.supplier_name === "Ringa" ||
    selectedSupplier?.supplier_name === "Hollywoodbets" ||
    selectedSupplier?.supplier_name === "Easyload";

  const availableVouchers = getAvailableVouchers();
  console.log("Available vouchers for dropdown:", availableVouchers);

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Select Voucher
        </label>
        {showUploadButton && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleUploadClick}
              className="ml-2 flex items-center rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
            >
              <Upload className="mr-1 h-4 w-4" />
              Upload File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.csv"
            />
          </div>
        )}
      </div>
      <VoucherDropdown
        items={availableVouchers}
        value={currentVoucher?.displayName || currentVoucher?.name}
        onChange={(value) => {
          const selectedVoucher = availableVouchers.find(
            (v) => v.displayName === value || v.name === value,
          );
          if (selectedVoucher) {
            // Create a clean version without the displayName property
            const { displayName, ...cleanVoucher } = selectedVoucher;
            onVoucherSelect(cleanVoucher);
          }
        }}
        displayKey="name"
        formatDisplay={formatVoucherDisplay}
        placeholder="Select a voucher..."
        disabled={!selectedSupplier || !selectedSupplierApi}
        loading={false}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default VoucherSelect;
