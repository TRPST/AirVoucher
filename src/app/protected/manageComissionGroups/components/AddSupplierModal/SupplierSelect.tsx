import React from "react";
import VoucherDropdown from "@/components/vouchers/VoucherDropdown";
import { Supplier } from "@/app/types/common";

interface SupplierSelectProps {
  suppliers: Supplier[];
  selectedSupplier?: Supplier;
  onSupplierSelect: (supplier: Supplier) => void;
  loading: boolean;
  setSupplierName: (name: string) => void;
}

const SupplierSelect = ({
  suppliers,
  selectedSupplier,
  onSupplierSelect,
  loading,
  setSupplierName,
}: SupplierSelectProps) => {
  return (
    <>
      <h3 className="mb-2 mt-5 font-semibold text-gray-800 dark:text-gray-100">
        Supplier
      </h3>
      <VoucherDropdown
        items={suppliers}
        value={selectedSupplier?.supplier_name || ""}
        onChange={(name) => {
          const supplier = suppliers.find((s) => s.supplier_name === name);
          if (supplier) {
            onSupplierSelect(supplier);
            setSupplierName(supplier.supplier_name);
          }
        }}
        displayKey="supplier_name"
        placeholder="Select supplier..."
        loading={loading}
        className="mb-5"
        disableSearch
      />
    </>
  );
};

export default SupplierSelect;
