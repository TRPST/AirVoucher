import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import {
  getSuppliersAction,
  getSupplierMainVoucherGroups,
  getSupplierMobileDataVouchers,
  getSupplierApis,
  addVouchersToMobileDataVouchers,
  getSupplierMobileAirtimeVouchers,
} from "./actions";
import { Supplier, MobileDataVoucher, SupplierAPI } from "@/app/types/common";
import BulkUpload from "@/components/vouchers/BulkUpload";
import { useVoucherForm } from "@/hooks/useVoucherForm";
import { VoucherGroup, MainVoucherGroup } from "@/app/types/vouchers";

// Import new components
import SupplierSelect from "./components/AddSupplierModal/SupplierSelect";
import SupplierApiSelect from "./components/AddSupplierModal/SupplierApiSelect";
import VoucherSelect from "./components/AddSupplierModal/VoucherSelect";
import CommissionInputs from "./components/AddSupplierModal/CommissionInputs";
import VoucherTable from "./components/AddSupplierModal/VoucherTable";

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
  commGroupId: string;
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

  const {
    voucher: currentVoucher,
    errors,
    handleChange: handleVoucherFieldChange,
    validate,
    reset: resetVoucherForm,
    setVoucher: setCurrentVoucher,
  } = useVoucherForm();

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
    //console.log("result", result);
    const mainVoucherGroups = result?.mainVoucherGroups || [];
    if (mainVoucherGroups) {
      setMainVoucherGroups(mainVoucherGroups);
    }
    setVoucherGroupsLoading(false);
  };

  const fetchSupplierApis = async (supplierName: string) => {
    setVouchersLoading(true);

    const result = await getSupplierApis(supplierName);

    //console.log("Supplier api results", result);

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
    //console.log("Mobile data vouchers", mobileDataVouchers);
    setMobileDataVouchers(mobileDataVouchers);
    setVouchersLoading(false);
  };

  const fetchSupplierMobileAirtimeVouchers = async (supplierName: string) => {
    setVouchersLoading(true);
    const result = await getSupplierMobileAirtimeVouchers(supplierName);
    const mobileAirtimeVouchers = result?.mobileAirtimeVouchers || [];
    setMobileAirtimeVouchers(mobileAirtimeVouchers);
    //console.log("Mobile airtime vouchers", mobileAirtimeVouchers);
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
    handleVoucherFieldChange(field as keyof MobileDataVoucher, value);
  };

  const handleBulkUpload = (vouchers: MobileDataVoucher[]) => {
    setSelectedVouchers((prev) => [...prev, ...vouchers]);
  };

  const handleAddVoucher = () => {
    if (!selectedSupplier) return;
    if (!validate()) return;

    const voucherAmount = currentVoucher.amount / 100;
    const totalCommissionAmount =
      voucherAmount * (currentVoucher.total_comm || 0);
    const retailerCommissionAmount =
      totalCommissionAmount * (currentVoucher.retailer_comm || 0);
    const salesAgentCommissionAmount =
      totalCommissionAmount * (currentVoucher.sales_agent_comm || 0);
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
    // Reset with explicit 0 values
    resetVoucherForm();
    setSelectedMainVoucherGroup(undefined);
  };

  const handleSubmit = async () => {
    if (selectedVouchers.length > 0 && commGroupId) {
      setLoading(true);
      //console.log("Selected vouchers:", selectedVouchers);
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
        resetVoucherForm();
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
    resetVoucherForm();
    setSelectedMainVoucherGroup(undefined);
    onClose();
  };

  const handleDeleteVoucher = (index: number) => {
    setSelectedVouchers((prevVouchers) =>
      prevVouchers.filter((_, i) => i !== index),
    );
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
          maxHeight: "90vh",
          overflowY: "auto",
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

            <SupplierSelect
              suppliers={suppliers}
              selectedSupplier={selectedSupplier}
              onSupplierSelect={setSelectedSupplier}
              loading={loading}
              setSupplierName={setSupplierName}
            />

            <div className="mb-5">
              <BulkUpload onUpload={handleBulkUpload} />
            </div>

            {vouchersLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <>
                <SupplierApiSelect
                  supplierApis={supplierApis}
                  selectedSupplierApi={selectedSupplierApi}
                  onApiSelect={setSelectedSupplierApi}
                />

                <VoucherTable
                  vouchers={selectedVouchers}
                  onDeleteVoucher={handleDeleteVoucher}
                />

                <VoucherSelect
                  currentVoucher={currentVoucher}
                  selectedSupplier={selectedSupplier}
                  selectedSupplierApi={selectedSupplierApi}
                  mobileDataVouchers={mobileDataVouchers}
                  mobileAirtimeVouchers={mobileAirtimeVouchers}
                  onVoucherSelect={setCurrentVoucher}
                  ottVoucher={ottVoucher}
                />

                <CommissionInputs
                  currentVoucher={currentVoucher}
                  errors={errors}
                  onCommissionChange={handleVoucherChange}
                />

                <button
                  className="mb-3 w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800"
                  onClick={handleAddVoucher}
                >
                  Add Voucher
                </button>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    className="w-32 rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700"
                    onClick={handleModalClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-32 rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 disabled:bg-blue-300"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
