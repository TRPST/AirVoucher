import React from "react";
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
}: VoucherSelectProps) => {
  const getAvailableVouchers = () => {
    const ensureId = (voucher: MobileDataVoucher) => ({
      ...voucher,
      networkProvider: (voucher.vendorId?.toUpperCase() || "MTN") as
        | "CELLC"
        | "MTN"
        | "TELKOM"
        | "VODACOM",
      id: voucher.id || `${voucher.name}-${voucher.vendorId}`,
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

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
        Vouchers
      </h3>
      <VoucherDropdown
        items={getAvailableVouchers()}
        value={currentVoucher?.name}
        onChange={(name: string) => {
          const selectedVoucher = getAvailableVouchers().find(
            (v) => v.name === name,
          );
          if (selectedVoucher) {
            onVoucherSelect({
              ...selectedVoucher,
              supplier_id: selectedSupplier?.id || 0,
              supplier_name: selectedSupplier?.supplier_name || "",
            });
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
