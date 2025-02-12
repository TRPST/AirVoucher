import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, MenuItem, Select } from "@mui/material";
import {
  getSuppliersAction,
  getSupplierVouchers,
  getSupplierMainVoucherGroups,
  getSupplierMobileDataVouchers,
  getSupplierApis,
  addVouchersToMobileDataVouchers,
} from "./actions";
import {
  Supplier,
  Terminal,
  Retailer,
  VoucherGroup,
  MainVoucherGroup,
  MobileDataVoucher,
  SupplierAPI,
} from "@/app/types/common";
import { useTheme } from "@mui/material/styles";

const AddSupplierModal = ({ isOpen, onClose, onAddSupplier }) => {
  const [supplierName, setSupplierName] = useState("");
  const [mobileDataVouchers, setMobileDataVouchers] = useState<
    MobileDataVoucher[]
  >([]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [voucherGroups, setVoucherGroups] = useState<VoucherGroup[]>([]);
  const [mainVoucherGroups, setMainVoucherGroups] = useState<
    MainVoucherGroup[]
  >([]);
  const [selectedMainVoucherGroups, setSelectedMainVoucherGroups] = useState<
    MainVoucherGroup[]
  >([]);
  const [selectedMainVoucherGroup, setSelectedMainVoucherGroup] =
    useState<MainVoucherGroup>();
  const [selectedVoucherGroup, setSelectedVoucherGroup] =
    useState<VoucherGroup>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [voucherGroupsLoading, setVoucherGroupsLoading] =
    useState<boolean>(false);

  const [vouchersLoading, setVouchersLoading] = useState<boolean>(false);

  const [supplierApis, setSupplierApis] = useState([]);

  const [selectedSupplierApi, setSelectedSupplierApi] = useState<
    SupplierAPI | undefined
  >();

  // Add new state for selected vouchers and current voucher
  const [selectedVouchers, setSelectedVouchers] = useState<MobileDataVoucher[]>(
    [],
  );

  const [currentVoucher, setCurrentVoucher] = useState<MobileDataVoucher>({
    name: "",
    vendorId: "",
    amount: 0,
    total_comm: 0,
    retailer_comm: 0,
    sales_agent_comm: 0,
    supplier_id: 0,
    supplier_name: "",
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      const result = await getSuppliersAction();
      const suppliers = result?.suppliers || [];
      if (suppliers) {
        setSuppliers(suppliers);
      }
      setLoading(false);
    };
    fetchSuppliers();
  }, []);

  const fetchSupplierVoucherGroups = async (supplierId: number) => {
    setVoucherGroupsLoading(true);
    const result = await getSupplierMainVoucherGroups(supplierId);
    console.log("result", result);
    const mainVoucherGroups = result?.mainVoucherGroups || [];
    if (mainVoucherGroups) {
      setMainVoucherGroups(mainVoucherGroups);
    }
    setVoucherGroupsLoading(false);
  };

  const fetchSupplierApis = async (supplierName: string) => {
    setVouchersLoading(true);

    const result = await getSupplierApis(supplierName);

    console.log("Supplier api results", result);

    const supplierApis = result?.supplierApis || [];
    if (supplierApis) {
      setSupplierApis(supplierApis);
    }
    setVouchersLoading(false);
  };

  const fetchSupplierMobileDataVouchers = async (supplierName: string) => {
    setVouchersLoading(true);
    console.log("Fetching vouchers for supplier:", supplierName);
    const result = await getSupplierMobileDataVouchers(supplierName);
    console.log("Mobile data vouchers result:", result);
    const mobileDataVouchers = result?.mobileDataVouchers || [];
    console.log("Setting mobile data vouchers:", mobileDataVouchers);
    setMobileDataVouchers(mobileDataVouchers);
    setVouchersLoading(false);
  };

  useEffect(() => {
    if (selectedSupplier) {
      //fetchSupplierVoucherGroups(selectedSupplier.id);
      fetchSupplierMobileDataVouchers(selectedSupplier.supplier_name);
      fetchSupplierApis(selectedSupplier.supplier_name);
    }
  }, [selectedSupplier]);

  const handleVoucherChange = (field: string, value: number) => {
    setCurrentVoucher((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddVoucher = () => {
    if (!selectedSupplier) return;

    const voucherAmount = currentVoucher.amount / 100; // Convert cents to Rands
    const totalCommissionAmount =
      voucherAmount * (currentVoucher.total_comm ?? 0);
    const retailerCommissionAmount =
      totalCommissionAmount * (currentVoucher.retailer_comm ?? 0);
    const salesAgentCommissionAmount =
      totalCommissionAmount * (currentVoucher.sales_agent_comm ?? 0);
    const profitAmount =
      totalCommissionAmount -
      retailerCommissionAmount -
      salesAgentCommissionAmount;

    const newVoucher = {
      supplier_id: selectedSupplier.id,
      supplier_name: selectedSupplier.supplier_name,
      vendorId: currentVoucher.vendorId,
      amount: currentVoucher.amount,
      name: currentVoucher.name,
      total_comm: currentVoucher.total_comm,
      retailer_comm: currentVoucher.retailer_comm,
      sales_agent_comm: currentVoucher.sales_agent_comm,
      category: currentVoucher.category,
      profit: profitAmount.toFixed(2),
    };

    setSelectedVouchers((prev) => [...prev, newVoucher]);
    // Reset current voucher
    setCurrentVoucher({
      name: "",
      vendorId: "",
      amount: 0,
      total_comm: 0,
      retailer_comm: 0,
      sales_agent_comm: 0,
      supplier_id: 0,
      supplier_name: "",
    });
    setSelectedMainVoucherGroup(undefined);
  };

  const handleSubmit = async () => {
    if (selectedVouchers.length > 0) {
      setLoading(true);
      console.log("Selected vouchers:", selectedVouchers);
      const result = await addVouchersToMobileDataVouchers(selectedVouchers);
      if (result.error) {
        console.error("Error adding vouchers:", result.error);
      } else {
        // Reset all form values on successful submission
        setSelectedSupplier(undefined);
        setSelectedSupplierApi(undefined);
        setSelectedVouchers([]);
        setCurrentVoucher({
          name: "",
          vendorId: "",
          amount: 0,
          total_comm: 0,
          retailer_comm: 0,
          sales_agent_comm: 0,
          supplier_id: 0,
          supplier_name: "",
        });
        setSelectedMainVoucherGroup(undefined);
        onClose();
      }
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setSelectedSupplier(undefined);
    onClose();
  };

  const handleDeleteVoucher = (index: number) => {
    setSelectedVouchers((prevVouchers) =>
      prevVouchers.filter((_, i) => i !== index),
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
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
          <div className="w-full rounded-lg bg-white dark:bg-gray-800">
            <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
              Add Vouchers
            </h2>
            <h3 className="mb-2 mt-5 font-semibold">Supplier</h3>
            <div className="mb-5">
              <Select
                labelId="retailer-select-label"
                value={selectedSupplier ? selectedSupplier.id : ""}
                onChange={(event) => {
                  const selectedSupplierId = Number(event.target.value);
                  const selectedSupplier = suppliers.find(
                    (s) => s.id === selectedSupplierId,
                  );
                  if (selectedSupplier) {
                    setSelectedSupplier(selectedSupplier);
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
                    color: "white",
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

            <h3 className="mb-2 mt-5 font-semibold">Supplier API</h3>
            <div className="mb-5">
              <Select
                labelId="supplier-api-select-label"
                value={selectedSupplierApi ? selectedSupplierApi.id : ""}
                onChange={(event) => {
                  console.log("Selected API ID:", event.target.value);
                  const selectedApiId = Number(event.target.value);
                  const selectedApi = supplierApis.find(
                    (api: SupplierAPI) => api.id === selectedApiId,
                  );
                  console.log("Selected API:", selectedApi);
                  if (selectedApi) {
                    setSelectedSupplierApi(selectedApi);
                  }
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

            {selectedVouchers.length > 0 && (
              <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Supplier
                    </th>
                    <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Voucher Name
                    </th>
                    <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Vendor
                    </th>
                    <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Amount (R)
                    </th>
                    <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Total Comm
                    </th>
                    <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Retailer Comm
                    </th>
                    <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Sales Agent Comm
                    </th>
                    <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Profit
                    </th>
                    <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVouchers.map((voucher, index) => {
                    // Calculate monetary values
                    const voucherAmount = voucher.amount / 100; // Convert cents to Rands
                    const totalCommissionAmount =
                      voucherAmount * (voucher.total_comm ?? 0);
                    const retailerCommissionAmount =
                      totalCommissionAmount * (voucher.retailer_comm ?? 0);
                    const salesAgentCommissionAmount =
                      totalCommissionAmount * (voucher.sales_agent_comm ?? 0);
                    const profitAmount =
                      totalCommissionAmount -
                      retailerCommissionAmount -
                      salesAgentCommissionAmount;

                    return (
                      <tr
                        key={index}
                        className="bg-white transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                          {voucher.supplier_name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                          {voucher.name}
                        </td>
                        <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                          {voucher.vendorId}
                        </td>
                        <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                          {voucherAmount.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                          {voucher.total_comm} (R{" "}
                          {totalCommissionAmount.toFixed(2)})
                        </td>
                        <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                          {voucher.retailer_comm} (R{" "}
                          {retailerCommissionAmount.toFixed(2)})
                        </td>
                        <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                          {voucher.sales_agent_comm} (R{" "}
                          {salesAgentCommissionAmount.toFixed(2)})
                        </td>
                        <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                          R {profitAmount.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                          <button
                            onClick={() => handleDeleteVoucher(index)}
                            className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                            aria-label="Delete voucher"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            <h3 className="mb-2 mt-5 font-semibold">Vouchers</h3>
            <div className="mb-5 flex flex-col space-y-3">
              <Select
                value={currentVoucher.name}
                onChange={(e) => {
                  console.log("Selected voucher value:", e.target.value);
                  const voucherName = e.target.value;
                  if (selectedSupplierApi?.name === "Mobile Data") {
                    const selectedVoucher = mobileDataVouchers.find(
                      (v) => v.name === voucherName,
                    );
                    if (selectedVoucher) {
                      setCurrentVoucher({
                        name: selectedVoucher.name,
                        vendorId: selectedVoucher.vendorId,
                        amount: selectedVoucher.amount,
                        total_comm: selectedVoucher.total_comm || 0,
                        retailer_comm: selectedVoucher.retailer_comm || 0,
                        sales_agent_comm: selectedVoucher.sales_agent_comm || 0,
                        supplier_id: selectedSupplier?.id || 0,
                        supplier_name: selectedSupplier?.supplier_name || "",
                      });
                    }
                  } else {
                    const selectedGroup = mainVoucherGroups.find(
                      (group) => group.name === voucherName,
                    );
                    if (selectedGroup) {
                      setSelectedMainVoucherGroup(selectedGroup);
                      setCurrentVoucher({
                        name: selectedGroup.name,
                        total_comm: selectedGroup.total_comm || 0,
                        retailer_comm: selectedGroup.retailer_comm || 0,
                        sales_agent_comm: selectedGroup.sales_agent_comm || 0,
                      });
                    }
                  }
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
                  Select voucher
                </MenuItem>
                {selectedSupplierApi?.name === "Mobile Data"
                  ? mobileDataVouchers.map((voucher) => {
                      return (
                        <MenuItem
                          key={voucher.id}
                          value={voucher.name}
                          className="hover:bg-gray-700"
                        >
                          {voucher.vendorId?.toUpperCase()} --- {voucher.name}{" "}
                          --- (R {(voucher.amount / 100).toFixed(2)})
                        </MenuItem>
                      );
                    })
                  : selectedSupplierApi?.name === "Mobile Airtime"
                    ? mainVoucherGroups.map((group) => (
                        <MenuItem
                          key={group.id}
                          value={group.name}
                          className="hover:bg-gray-700"
                        >
                          {group.name}
                        </MenuItem>
                      ))
                    : null}
              </Select>
              <div className="mb-5 flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">
                    Total Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={currentVoucher.total_comm}
                    onChange={(e) =>
                      handleVoucherChange(
                        "total_comm",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-2/3 rounded-lg border px-4 py-2 dark:bg-gray-700"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">
                    Retailer Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={currentVoucher.retailer_comm}
                    onChange={(e) =>
                      handleVoucherChange(
                        "retailer_comm",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-2/3 rounded-lg border px-4 py-2 dark:bg-gray-700"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">
                    Sales Agent Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={currentVoucher.sales_agent_comm}
                    onChange={(e) =>
                      handleVoucherChange(
                        "sales_agent_comm",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-2/3 rounded-lg border px-4 py-2 dark:bg-gray-700"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <button
                className="mt-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                onClick={handleAddVoucher}
              >
                Add Voucher
              </button>
            </div>

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
