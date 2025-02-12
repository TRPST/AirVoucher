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
  getSupplierMobileAirtimeVouchers,
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
const AddSupplierModal = ({
  isOpen,
  onClose,
  onAddVouchers,
  commGroupId,
  commGroupName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddVouchers: (vouchers: MobileDataVoucher[]) => void;
  commGroupId: number;
  commGroupName: string;
}) => {
  const [supplierName, setSupplierName] = useState("");
  const [mobileDataVouchers, setMobileDataVouchers] = useState<
    MobileDataVoucher[]
  >([]);
  const [mobileAirtimeVouchers, setMobileAirtimeVouchers] = useState<
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

  const [selectedSupplierApi, setSelectedSupplierApi] =
    useState<SupplierAPI | null>(null);

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
    const result = await getSupplierMobileDataVouchers(supplierName);
    const mobileDataVouchers = result?.mobileDataVouchers || [];
    console.log("Mobile data vouchers", mobileDataVouchers);
    setMobileDataVouchers(mobileDataVouchers);
    setVouchersLoading(false);
  };

  const fetchSupplierMobileAirtimeVouchers = async (supplierName: string) => {
    setVouchersLoading(true);
    const result = await getSupplierMobileAirtimeVouchers(supplierName);
    const mobileAirtimeVouchers = result?.mobileAirtimeVouchers || [];
    setMobileAirtimeVouchers(mobileAirtimeVouchers);
    console.log("Mobile airtime vouchers", mobileAirtimeVouchers);
    setVouchersLoading(false);
  };

  useEffect(() => {
    if (selectedSupplier) {
      //fetchSupplierVoucherGroups(selectedSupplier.id);
      fetchSupplierMobileDataVouchers(selectedSupplier.supplier_name);
      fetchSupplierMobileAirtimeVouchers(selectedSupplier.supplier_name);
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

    const newVoucher: MobileDataVoucher = {
      ...currentVoucher,
      supplier_id: selectedSupplier.id,
      supplier_name: selectedSupplier.supplier_name,
      profit: Number(profitAmount.toFixed(2)),
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
    if (selectedVouchers.length > 0 && commGroupId) {
      setLoading(true);
      console.log("Selected vouchers:", selectedVouchers);
      const vouchersWithCommGroupId = selectedVouchers.map((voucher) => ({
        ...voucher,
        comm_group_id: commGroupId,
      }));
      const result = await addVouchersToMobileDataVouchers(
        vouchersWithCommGroupId,
      );
      if (result.error) {
        console.error("Error adding vouchers:", result.error);
      } else {
        // Reset all form values on successful submission
        setSelectedSupplier(undefined);
        setSelectedSupplierApi(null);
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
        onAddVouchers(selectedVouchers);
        onClose();
      }
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setSelectedSupplier(undefined);
    // Reset all form values on successful submission
    setSelectedSupplier(undefined);
    setSelectedSupplierApi(null);
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
  };

  const handleDeleteVoucher = (index: number) => {
    setSelectedVouchers((prevVouchers) =>
      prevVouchers.filter((_, i) => i !== index),
    );
  };

  const ottVoucher = {
    name: "OTT Variable Amount",
    vendorId: "OTT",
    amount: 0,
    total_comm: 0,
    retailer_comm: 0,
    sales_agent_comm: 0,
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
            <h4 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-white">
              {commGroupName}
            </h4>
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

                    if (selectedSupplier.supplier_name === "OTT") {
                      setSelectedSupplierApi({ id: 0, name: "OTT" });
                    } else if (selectedSupplier.supplier_name === "Glocell") {
                      setSelectedSupplierApi({ id: 0, name: "Mobile Data" });
                    }
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
                  <MenuItem
                    key={supplier.id}
                    value={supplier.id}
                    disabled={supplier.supplier_name === "BlueLabel"}
                  >
                    {supplier.supplier_name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {vouchersLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <>
                <h3 className="mb-2 mt-5 font-semibold">Supplier API</h3>
                <div className="mb-5">
                  <Select
                    labelId="supplier-api-select-label"
                    value={selectedSupplierApi?.id || ""}
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
                          totalCommissionAmount *
                          (voucher.sales_agent_comm ?? 0);
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
                              {voucher.name === "OTT Variable Amount" ||
                              !voucher.amount
                                ? "-"
                                : voucherAmount.toFixed(2)}
                            </td>
                            <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                              {voucher.name === "OTT Variable Amount" ||
                              !voucher.amount
                                ? voucher.total_comm
                                : `${voucher.total_comm} (R ${totalCommissionAmount.toFixed(2)})`}
                            </td>
                            <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                              {voucher.name === "OTT Variable Amount" ||
                              !voucher.amount
                                ? voucher.retailer_comm
                                : `${voucher.retailer_comm} (R ${retailerCommissionAmount.toFixed(2)})`}
                            </td>
                            <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                              {voucher.name === "OTT Variable Amount" ||
                              !voucher.amount
                                ? voucher.sales_agent_comm
                                : `${voucher.sales_agent_comm} (R ${salesAgentCommissionAmount.toFixed(2)})`}
                            </td>
                            <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                              {voucher.name === "OTT Variable Amount" ||
                              !voucher.amount
                                ? "-"
                                : `R ${profitAmount.toFixed(2)}`}
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
                      console.log("Selected supplierApi:", selectedSupplierApi);

                      const voucherName = e.target.value;
                      if (selectedSupplierApi?.name === "Mobile Data") {
                        const selectedVoucher = mobileDataVouchers.find(
                          (v) => v.name === voucherName,
                        );
                        if (selectedVoucher) {
                          setCurrentVoucher({
                            ...selectedVoucher,
                            supplier_id: selectedSupplier?.id || 0,
                            supplier_name:
                              selectedSupplier?.supplier_name || "",
                          });
                        }
                      } else if (
                        selectedSupplierApi?.name === "Mobile Airtime"
                      ) {
                        const selectedVoucher = mobileAirtimeVouchers.find(
                          (v) => v.name === voucherName,
                        );
                        if (selectedVoucher) {
                          setCurrentVoucher({
                            ...selectedVoucher,
                            supplier_id: selectedSupplier?.id || 0,
                            supplier_name:
                              selectedSupplier?.supplier_name || "",
                          });
                        }
                      } else if (voucherName === "OTT Variable Amount") {
                        console.log("OTT voucher");
                        setCurrentVoucher({
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
                      <MenuItem
                        value={ottVoucher.name}
                        className="hover:bg-gray-700"
                      >
                        OTT Variable Amount
                      </MenuItem>
                    ) : selectedSupplierApi?.name === "Mobile Data" ? (
                      mobileDataVouchers.map((voucher) => {
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
                    ) : selectedSupplierApi?.name === "Mobile Airtime" ? (
                      mobileAirtimeVouchers.map((voucher) => {
                        return (
                          <MenuItem
                            key={voucher.id}
                            value={voucher.name}
                            className="hover:bg-gray-700"
                          >
                            {voucher.name}
                          </MenuItem>
                        );
                      })
                    ) : null}
                  </Select>

                  <div className="mb-5 mt-10 flex flex-col space-y-4">
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
                    className="mt-10 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    onClick={handleAddVoucher}
                    style={{ marginTop: "20px" }}
                  >
                    Add Voucher
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    className="mr-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                    onClick={handleModalClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddSupplierModal;
