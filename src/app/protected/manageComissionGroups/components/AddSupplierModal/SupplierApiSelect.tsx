import React from "react";
import VoucherDropdown from "@/components/vouchers/VoucherDropdown";
import { SupplierAPI } from "@/app/types/common";

interface SupplierApiSelectProps {
  supplierApis: SupplierAPI[];
  selectedSupplierApi: SupplierAPI | null;
  onApiSelect: (api: SupplierAPI | null) => void;
}

const SupplierApiSelect = ({
  supplierApis,
  selectedSupplierApi,
  onApiSelect,
}: SupplierApiSelectProps) => {
  return (
    <>
      <h3 className="mb-2 mt-5 font-semibold text-gray-800 dark:text-gray-100">
        Supplier API
      </h3>
      <VoucherDropdown
        items={supplierApis}
        value={selectedSupplierApi?.name || ""}
        onChange={(name) => {
          const selectedApi = supplierApis.find((api) => api.name === name);
          onApiSelect(selectedApi || null);
        }}
        displayKey="name"
        placeholder="Select supplier API..."
        className="mb-5"
        disableSearch
      />
    </>
  );
};

export default SupplierApiSelect;
