import React, { useState } from "react";

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

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-3/4 max-w-lg rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Add Supplier</h2>
        <div className="mb-4">
          <label className="block font-semibold">Supplier Name:</label>
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="w-full rounded border px-2 py-1"
            placeholder="Enter supplier name"
          />
        </div>
        <h3 className="mb-2 font-semibold">Vouchers</h3>
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
  ) : null;
};

export default AddSupplierModal;
