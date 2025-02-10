import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, MenuItem, Select } from "@mui/material";
import {
  getSuppliersAction,
  getSupplierVouchers,
  getSupplierMainVoucherGroups,
  getSupplierMobileDataVouchers,
  getSupplierApis,
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

    console.log("Mobile data results", result);

    const mobileDataVouchers = result?.mobileDataVouchers || [];
    if (mobileDataVouchers) {
      setMobileDataVouchers(mobileDataVouchers);
    }
    setVouchersLoading(false);
  };

  useEffect(() => {
    if (selectedSupplier) {
      //fetchSupplierVoucherGroups(selectedSupplier.id);
      fetchSupplierMobileDataVouchers(selectedSupplier.supplier_name);
      fetchSupplierApis(selectedSupplier.supplier_name);
    }
  }, [selectedSupplier]);

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

  const handleAddVoucherGroup = () => {
    if (selectedMainVoucherGroup) {
      setSelectedMainVoucherGroups([
        ...selectedMainVoucherGroups,
        {
          id: selectedMainVoucherGroup.id,
          name: selectedMainVoucherGroup.name,
          supplier_id: selectedMainVoucherGroup.supplier_id,
          created_at: selectedMainVoucherGroup.created_at,
          total_comm: selectedMainVoucherGroup.total_comm,
          retailer_comm: selectedMainVoucherGroup.retailer_comm,
          sales_agent_comm: selectedMainVoucherGroup.sales_agent_comm,
        },
      ]);
      setSelectedVoucherGroup(undefined);
    }
  };

  const handleVoucherGroupChange = (field, value) => {
    if (selectedMainVoucherGroup) {
      setSelectedMainVoucherGroup({
        ...selectedMainVoucherGroup,
        [field]: value,
      });
    }
  };

  const handleSubmit = () => {
    onAddSupplier({ name: supplierName, vouchers: selectedMainVoucherGroups });
    onClose();
  };

  const handleModalClose = () => {
    setSelectedSupplier(undefined);
    onClose();
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
          width: "70%",
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
                  const selectedApiId = Number(event.target.value);
                  const selectedApi = supplierApis.find(
                    (api: SupplierAPI) => api.id === selectedApiId,
                  );
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
                  Select the supplier API
                </MenuItem>
                {supplierApis.map((api: SupplierAPI) => (
                  <MenuItem key={api.id} value={api.id}>
                    {api.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {selectedMainVoucherGroups.length > 0 && (
              <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Supplier
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Voucher
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Total comm
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Retailer comm
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                      Sales Agent comm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVouchers.map((selectedVoucher, index) => (
                    <tr
                      key={index}
                      className="bg-white transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                        {selectedMainVoucherGroup.supplier}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                        {selectedMainVoucherGroup.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                        {selectedMainVoucherGroup.total_comm}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                        {selectedMainVoucherGroup.retailer_comm}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                        {selectedMainVoucherGroup.sales_agent_comm}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h3 className="mb-2 mt-5 font-semibold">Vouchers</h3>
            <div className="mb-5 flex flex-col space-y-3">
              <Select
                value={
                  selectedMainVoucherGroup ? selectedMainVoucherGroup.id : ""
                }
                onChange={(e) => {
                  const selectedGroupId = Number(e.target.value);
                  const selectedGroup = mainVoucherGroups.find(
                    (group) => group.id === selectedGroupId,
                  );
                  console.log("selectedGroup", selectedGroup);
                  setSelectedMainVoucherGroup(selectedGroup);
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
                <MenuItem value="" disabled>
                  Select Voucher Group
                </MenuItem>
                {mainVoucherGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
              <input
                type="name"
                value={selectedVoucherGroup?.total_comm}
                onChange={(e) =>
                  handleVoucherGroupChange(
                    "total_comm",
                    parseFloat(e.target.value),
                  )
                }
                className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
                placeholder="Total Commission (%)"
              />
              <input
                type="name"
                value={selectedVoucherGroup?.retailer_comm}
                onChange={(e) =>
                  handleVoucherGroupChange(
                    "retailer_comm",
                    parseFloat(e.target.value),
                  )
                }
                className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
                placeholder="Retailer Commission (%)"
              />
              <input
                type="name"
                value={selectedVoucherGroup?.sales_agent_comm}
                onChange={(e) =>
                  handleVoucherGroupChange(
                    "sales_agent_comm",
                    parseFloat(e.target.value),
                  )
                }
                className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
                placeholder="Agent Commission (%)"
              />
              <button
                className="mt-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                onClick={handleAddVoucherGroup}
              >
                Add Voucher Group
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
