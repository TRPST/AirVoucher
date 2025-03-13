import React, { useRef } from "react";
import VoucherDropdown from "@/components/vouchers/VoucherDropdown";
import { MobileDataVoucher, Supplier, SupplierAPI } from "@/app/types/common";

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

    //console.log("Selected selectedSupplierApi", selectedSupplierApi);

    if (selectedSupplier?.supplier_name === "OTT") {
      return [ensureId(ottVoucher)];
    }

    if (selectedSupplierApi?.name === "Mobile Data") {
      console.log("Selected mobile data vouchers", mobileDataVouchers);
      return mobileDataVouchers.map(ensureId);
    }

    if (selectedSupplierApi?.name === "Mobile Airtime") {
      console.log("Selected mobile airtime vouchers", mobileAirtimeVouchers);
      return mobileAirtimeVouchers.map(ensureId);
    }

    if (selectedSupplier?.supplier_name === "Ringa") {
      // Show the current voucher if it's a Ringa batch
      if (currentVoucher?.metadata?.voucherCount) {
        return [
          {
            ...currentVoucher,
            id: `${currentVoucher.name}-batch`,
            name: `${currentVoucher.name} (${currentVoucher.metadata.voucherCount} vouchers)`,
            disabled: false,
            networkProvider: "CELLC" as const,
            amount: currentVoucher.amount,
          },
        ];
      }
    }

    return [];
  };

  const formatVoucherDisplay = (
    voucher: MobileDataVoucher & { networkProvider: string },
  ) => {
    if (voucher.name === "OTT Variable Amount") {
      return voucher.name;
    }

    return `${voucher.vendorId.toUpperCase()} --- ${voucher.name}`;
  };

  const showUploadButton =
    selectedSupplier?.supplier_name === "Ringa" ||
    selectedSupplier?.supplier_name === "Hollywoodbets" ||
    selectedSupplier?.supplier_name === "Easyload";

  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          Vouchers
        </h3>
        {showUploadButton && (
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              accept=".txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload Vouchers
            </button>
          </div>
        )}
      </div>
      <VoucherDropdown
        items={getAvailableVouchers()}
        value={
          currentVoucher?.metadata?.voucherCount
            ? `${currentVoucher.name} (${currentVoucher.metadata.voucherCount} vouchers)`
            : currentVoucher?.name
        }
        onChange={(name: string) => {
          // Extract the base name without the count for Ringa vouchers
          const baseName = name.includes(" (") ? name.split(" (")[0] : name;

          const selectedVoucher = getAvailableVouchers().find(
            (v) =>
              v.name === name ||
              (v.name.includes(baseName) && v.metadata?.voucherCount),
          );

          if (selectedVoucher) {
            // Create a clean version of the voucher with the correct name
            const cleanVoucher = {
              ...selectedVoucher,
              // Keep the original name without the count
              name: selectedVoucher.metadata?.voucherCount
                ? baseName
                : selectedVoucher.name,
              supplier_id: selectedSupplier?.id || 0,
              supplier_name: selectedSupplier?.supplier_name || "",
            };

            // Pass the clean voucher to the parent component
            onVoucherSelect(cleanVoucher);
          }
        }}
        displayKey="name"
        formatDisplay={formatVoucherDisplay}
        placeholder="Search voucher..."
        className={`mb-5 ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default VoucherSelect;
