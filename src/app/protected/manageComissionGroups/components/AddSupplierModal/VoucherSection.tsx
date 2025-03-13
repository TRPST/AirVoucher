import React, { useEffect, useState, useRef } from "react";
import { MobileDataVoucher, Supplier, SupplierAPI } from "@/app/types/common";
import { getSupplierVoucherProducts } from "../../actions";
import VoucherSelect from "./VoucherSelect";
import CommissionInputs from "./CommissionInputs";
import VoucherTable from "./VoucherTable";

interface VoucherSectionProps {
  currentVoucher: any;
  selectedSupplier: Supplier | undefined;
  selectedSupplierApi: SupplierAPI | null;
  selectedNetwork: string;
  voucherError: string;
  errors: any;
  selectedVouchers: MobileDataVoucher[];
  existingVouchers?: MobileDataVoucher[];
  onVoucherSelect: (voucher: MobileDataVoucher) => void;
  onVoucherChange: (field: string, value: number) => void;
  onAddVoucher: () => void;
  onDeleteVoucher: (index: number) => void;
  onFileUpload: (file: File) => void;
}

const VoucherSection: React.FC<VoucherSectionProps> = ({
  currentVoucher,
  selectedSupplier,
  selectedSupplierApi,
  selectedNetwork,
  voucherError,
  errors,
  selectedVouchers,
  existingVouchers,
  onVoucherSelect,
  onVoucherChange,
  onAddVoucher,
  onDeleteVoucher,
  onFileUpload,
}) => {
  const [mobileDataVouchers, setMobileDataVouchers] = useState<
    MobileDataVoucher[]
  >([]);
  const [mobileAirtimeVouchers, setMobileAirtimeVouchers] = useState<
    MobileDataVoucher[]
  >([]);
  const [vouchersLoading, setVouchersLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedSupplier && selectedSupplierApi) {
      fetchSupplierVoucherProducts(selectedSupplier.supplier_name);
    }
  }, [selectedSupplier, selectedSupplierApi]);

  const fetchSupplierVoucherProducts = async (supplierName: string) => {
    setVouchersLoading(true);
    try {
      const result = await getSupplierVoucherProducts(supplierName);
      if ("error" in result) {
        console.error(result.error);
        return;
      }

      setMobileDataVouchers(result.mobileDataVouchers || []);
      setMobileAirtimeVouchers(result.mobileAirtimeVouchers || []);
    } catch (error) {
      console.error("Error fetching voucher products:", error);
    } finally {
      setVouchersLoading(false);
    }
  };

  const ottVoucher: MobileDataVoucher = {
    name: "OTT Variable Amount",
    vendorId: "OTT",
    amount: 0,
    total_comm: 0,
    retailer_comm: 0,
    sales_agent_comm: 0,
    supplier_id: 0,
    supplier_name: "",
  };

  const showUploadButton =
    selectedSupplier?.supplier_name === "Ringa" ||
    selectedSupplier?.supplier_name === "Hollywoodbets" ||
    selectedSupplier?.supplier_name === "Easyload";

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
      // Reset the input so the same file can be selected again
      event.target.value = "";
    }
  };

  if (vouchersLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <VoucherSelect
        currentVoucher={currentVoucher}
        selectedSupplier={selectedSupplier}
        selectedSupplierApi={selectedSupplierApi}
        mobileDataVouchers={mobileDataVouchers.filter(
          (voucher) =>
            !selectedNetwork ||
            voucher.vendorId?.toUpperCase() === selectedNetwork,
        )}
        mobileAirtimeVouchers={mobileAirtimeVouchers.filter(
          (voucher) =>
            !selectedNetwork ||
            voucher.vendorId?.toUpperCase() === selectedNetwork,
        )}
        onVoucherSelect={onVoucherSelect}
        ottVoucher={ottVoucher}
        error={voucherError}
        selectedVouchers={selectedVouchers}
        existingVouchers={existingVouchers}
        onFileUpload={onFileUpload}
      />

      <CommissionInputs
        currentVoucher={currentVoucher}
        errors={errors}
        onCommissionChange={onVoucherChange}
      />

      <button
        className="mb-3 w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:text-white"
        onClick={onAddVoucher}
      >
        Add Voucher
      </button>

      <VoucherTable
        vouchers={selectedVouchers}
        onDeleteVoucher={onDeleteVoucher}
      />
    </div>
  );
};

export default VoucherSection;
