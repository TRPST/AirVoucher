import React from "react";
import { MenuItem, Select } from "@mui/material";
import { MobileDataVoucher, Supplier, SupplierAPI } from "@/app/types/common";

interface VoucherSelectProps {
  currentVoucher: MobileDataVoucher;
  selectedSupplier?: Supplier;
  selectedSupplierApi: SupplierAPI | null;
  mobileDataVouchers: MobileDataVoucher[];
  mobileAirtimeVouchers: MobileDataVoucher[];
  onVoucherSelect: (voucher: MobileDataVoucher) => void;
  ottVoucher: MobileDataVoucher;
}

const VoucherSelect = ({
  currentVoucher,
  selectedSupplier,
  selectedSupplierApi,
  mobileDataVouchers,
  mobileAirtimeVouchers,
  onVoucherSelect,
  ottVoucher,
}: VoucherSelectProps) => {
  return (
    <>
      <h3 className="mb-2 mt-5 font-semibold">Vouchers</h3>
      <Select
        value={currentVoucher.name}
        onChange={(e) => {
          const voucherName = e.target.value;
          if (selectedSupplierApi?.name === "Mobile Data") {
            const selectedVoucher = mobileDataVouchers.find(
              (v) => v.name === voucherName,
            );
            if (selectedVoucher) {
              onVoucherSelect({
                ...selectedVoucher,
                supplier_id: selectedSupplier?.id || 0,
                supplier_name: selectedSupplier?.supplier_name || "",
              });
            }
          } else if (selectedSupplierApi?.name === "Mobile Airtime") {
            const selectedVoucher = mobileAirtimeVouchers.find(
              (v) => v.name === voucherName,
            );
            if (selectedVoucher) {
              onVoucherSelect({
                ...selectedVoucher,
                supplier_id: selectedSupplier?.id || 0,
                supplier_name: selectedSupplier?.supplier_name || "",
              });
            }
          } else if (voucherName === "OTT Variable Amount") {
            onVoucherSelect({
              ...ottVoucher,
              supplier_id: selectedSupplier?.id || 0,
              supplier_name: selectedSupplier?.supplier_name || "",
            });
          }
        }}
        displayEmpty
        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
        style={{ color: "white" }}
        sx={{
          height: "40px",
          alignItems: "center",
          backgroundColor: "#1f2937",
          marginBottom: "20px",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "1px solid grey",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "2px solid grey",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "2px solid grey",
          },
          "& .MuiSelect-select": {
            color: "white",
            padding: "8px",
          },
          "& .MuiSelect-icon": {
            color: "grey",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "#1f2937",
              "& .MuiMenuItem-root": {
                color: "white",
                "&:hover": {
                  bgcolor: "#374151",
                },
                "&.Mui-selected": {
                  bgcolor: "#4B5563",
                },
              },
            },
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
      >
        <MenuItem value="" disabled>
          Select voucher
        </MenuItem>
        {selectedSupplier?.supplier_name === "OTT" ? (
          <MenuItem value={ottVoucher.name} className="hover:bg-gray-700">
            OTT Variable Amount
          </MenuItem>
        ) : selectedSupplierApi?.name === "Mobile Data" ? (
          mobileDataVouchers.map((voucher) => (
            <MenuItem
              key={voucher.id}
              value={voucher.name}
              className="hover:bg-gray-700"
            >
              {voucher.vendorId?.toUpperCase()} --- {voucher.name} --- (R{" "}
              {(voucher.amount / 100).toFixed(2)})
            </MenuItem>
          ))
        ) : selectedSupplierApi?.name === "Mobile Airtime" ? (
          mobileAirtimeVouchers.map((voucher) => (
            <MenuItem
              key={voucher.id}
              value={voucher.name}
              className="hover:bg-gray-700"
            >
              {voucher.name}
            </MenuItem>
          ))
        ) : null}
      </Select>
    </>
  );
};

export default VoucherSelect;
