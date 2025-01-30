import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, MenuItem, Select } from "@mui/material";
import { getSuppliersAction, getSupplierVouchers } from "./actions";
import { Supplier, Terminal, Retailer } from "@/app/types/common";

const AddSupplierModal = ({ isOpen, onClose, onAddSupplier }) => {
  const [supplierName, setSupplierName] = useState("");
  const [vouchers, setVouchers] = useState([
    {
      name: "",
      total_commission: 0,
      retailer_commission: 0,
      agent_commission: 0,
    },
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);

      const result = await getSuppliersAction();

      console.log("Suppliers result", result);

      const suppliers = result?.suppliers || [];

      if (suppliers) {
        setSuppliers(suppliers);
      }

      setLoading(false);
    };

    fetchSuppliers();
  }, []);

  const handleAddVoucher = () => {
    setVouchers([
      ...vouchers,
      {
        name: "",
        total_commission: 0,
        retailer_commission: 0,
        agent_commission: 0,
      },
    ]);
  };

  const handleVoucherChange = (index, field, value) => {
    const updatedVouchers = vouchers.map((voucher, i) =>
      i === index ? { ...voucher, [field]: value } : voucher,
    );
    setVouchers(updatedVouchers);
  };

  const handleSubmit = () => {
    onAddSupplier({ name: supplierName, vouchers });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          maxHeight: "90vh", // Limit height to 90% of the viewport height
          overflowY: "auto", // Make contents scrollable
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
        className="bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800">
            <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
              Add Supplier
            </h2>

            <div>
              <Select
                labelId="retailer-select-label"
                value={selectedSupplier}
                onChange={(event) => {
                  const selectedSupplierId = event.target.value;
                  const selectedSupplier = suppliers.find(
                    (s) => s.id === selectedSupplierId,
                  );
                  if (selectedSupplier) {
                    setSelectedSupplier(selectedSupplierId);
                    setSupplierName(selectedSupplier.supplier_name);
                  }
                }}
                displayEmpty
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                style={{ color: "white" }}
                sx={{
                  height: "40px",
                  alignItems: "center",
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
                    color: "grey",
                    padding: "0",
                    paddingLeft: "0px",
                  },
                  "& .MuiSelect-icon": {
                    color: "grey",
                  },
                }}
              >
                <MenuItem value="" disabled sx={{ display: "none" }}>
                  Select a supplier
                </MenuItem>
                {suppliers.map((supplier: Supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.supplier_name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* <div className="mb-4">
              <label className="block font-semibold">Supplier Name:</label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full rounded border px-2 py-1"
                placeholder="Enter supplier name"
              />
            </div> */}
            <h3 className="mb-2 mt-10 font-semibold">Vouchers</h3>
            {vouchers.map((voucher, index) => (
              <div key={index} className="mb-2 grid grid-cols-5 gap-2">
                <input
                  type="text"
                  value={voucher.name}
                  onChange={(e) =>
                    handleVoucherChange(index, "name", e.target.value)
                  }
                  className="col-span-2 rounded border px-2 py-1"
                  placeholder="Voucher Name"
                />
                <input
                  type="number"
                  value={voucher.total_commission}
                  onChange={(e) =>
                    handleVoucherChange(
                      index,
                      "total_commission",
                      parseFloat(e.target.value),
                    )
                  }
                  className="rounded border px-2 py-1"
                  placeholder="Total Comm (%)"
                />
                <input
                  type="number"
                  value={voucher.retailer_commission}
                  onChange={(e) =>
                    handleVoucherChange(
                      index,
                      "retailer_commission",
                      parseFloat(e.target.value),
                    )
                  }
                  className="rounded border px-2 py-1"
                  placeholder="Retailer Comm (%)"
                />
                <input
                  type="number"
                  value={voucher.agent_commission}
                  onChange={(e) =>
                    handleVoucherChange(
                      index,
                      "agent_commission",
                      parseFloat(e.target.value),
                    )
                  }
                  className="rounded border px-2 py-1"
                  placeholder="Agent Comm (%)"
                />
              </div>
            ))}
            <button
              className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              onClick={handleAddVoucher}
            >
              Add Voucher
            </button>
            <div className="flex justify-end">
              <button
                className="mr-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddSupplierModal;
