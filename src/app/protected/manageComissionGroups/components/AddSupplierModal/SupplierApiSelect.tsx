import React from "react";
import { MenuItem, Select } from "@mui/material";
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
      <h3 className="mb-2 mt-5 font-semibold">Supplier API</h3>
      <div className="mb-5">
        <Select
          value={selectedSupplierApi?.id || ""}
          onChange={(event) => {
            const selectedApiId = Number(event.target.value);
            const selectedApi = supplierApis.find(
              (api: SupplierAPI) => api.id === selectedApiId,
            );
            onApiSelect(selectedApi || null);
          }}
          displayEmpty
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
          style={{ color: "white" }}
          sx={{
            height: "40px",
            alignItems: "center",
            backgroundColor: "#1f2937",
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
            Select the supplier API
          </MenuItem>
          {supplierApis.map((api: SupplierAPI) => (
            <MenuItem key={api.id} value={api.id}>
              {api.name}
            </MenuItem>
          ))}
        </Select>
      </div>
    </>
  );
};

export default SupplierApiSelect;
