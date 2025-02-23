import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import {
  getSuppliersAction,
  getSupplierMainVoucherGroups,
  getSupplierApis,
  addVouchersToMobileDataVouchers,
  getSupplierVoucherProducts,
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

type CommissionField = "total_comm" | "retailer_comm" | "sales_agent_comm";

const AddSupplierModal = ({
  isOpen,
  onClose,
  onAddVouchers,
  commGroupId,
  commGroupName,
  existingVouchers,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddVouchers: (vouchers: MobileDataVoucher[]) => void;
  commGroupId: string;
  commGroupName: string;
  existingVouchers?: MobileDataVoucher[];
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

  // Fix for the MobileDataVouchers[] type error
  const [selectedVouchers, setSelectedVouchers] = useState<MobileDataVoucher[]>(
    [],
  );

  const {
    formData: currentVoucher,
    errors,
    handleChange: handleVoucherFieldChange,
    validate,
    reset: resetVoucherForm,
    setFormData: setCurrentVoucher,
  } = useVoucherForm();

  // Update the initial state to select CELLC by default
  const [selectedNetwork, setSelectedNetwork] = useState<string>("CELLC");

  // Network options constant remains the same
  const networkOptions = ["CELLC", "MTN", "VODACOM", "TELKOM"];

  // Fix for the networkStyles type safety
  type NetworkProvider = "CELLC" | "MTN" | "VODACOM" | "TELKOM";

  const networkStyles: Record<
    NetworkProvider,
    {
      selected: string;
      default: string;
    }
  > = {
    CELLC: {
      selected: "border-gray-300 bg-white text-black",
      default:
        "border-gray-300 bg-transparent dark:text-white hover:bg-gray-50 dark:hover:text-black",
    },
    MTN: {
      selected: "border-yellow-400 bg-yellow-400 text-black",
      default:
        "border-yellow-400 bg-transparent dark:text-white hover:bg-yellow-400 dark:hover:text-black",
    },
    VODACOM: {
      selected: "border-red-600 bg-red-600 text-white",
      default:
        "border-red-600 bg-transparent dark:text-white hover:bg-red-600 hover:text-white",
    },
    TELKOM: {
      selected: "border-blue-600 bg-blue-600 text-white",
      default:
        "border-blue-600 bg-transparent dark:text-white hover:bg-blue-600 hover:text-white",
    },
  };

  // Add new state for voucher selection error
  const [voucherError, setVoucherError] = useState<string>("");

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
    try {
      const result = await getSupplierApis(supplierName);
      if (result.supplierApis) {
        setSupplierApis(result.supplierApis);
      }
    } catch (error) {
      console.error("Error fetching supplier APIs:", error);
    } finally {
      setVouchersLoading(false);
    }
  };

  const fetchSupplierVoucherProducts = async (supplierName: string) => {
    setVouchersLoading(true);
    try {
      const result = await getSupplierVoucherProducts(supplierName);
      if ("error" in result) {
        console.error(result.error);
        return;
      }

      console.log(
        "result.mobileAirtimeVouchers ",
        result.mobileAirtimeVouchers,
      );
      console.log("result.mobileDataVouchers ", result.mobileDataVouchers);

      setMobileDataVouchers(result.mobileDataVouchers || []);
      setMobileAirtimeVouchers(result.mobileAirtimeVouchers || []);
    } catch (error) {
      console.error("Error fetching voucher products:", error);
    } finally {
      setVouchersLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSupplier) {
      //fetchSupplierVoucherGroups(selectedSupplier.id);
      fetchSupplierVoucherProducts(selectedSupplier.supplier_name);
      fetchSupplierApis(selectedSupplier.supplier_name);
    }
  }, [selectedSupplier]);

  const handleVoucherChange = (field: CommissionField, value: number) => {
    if (handleVoucherFieldChange) {
      // Only convert to decimal if there's a value
      const decimalValue = value ? value / 100 : null;
      handleVoucherFieldChange(field, decimalValue);
    }
  };

  const handleBulkUpload = (vouchers: MobileDataVoucher[]) => {
    setSelectedVouchers((prev) => [...prev, ...vouchers]);
  };

  const handleAddVoucher = () => {
    if (!selectedSupplier) return;

    // Clear previous errors
    setVoucherError("");

    // Check if a voucher is selected
    if (!currentVoucher?.name) {
      setVoucherError("Please select a voucher first");
      return;
    }

    // Remove this validation for OTT Variable Amount vouchers
    if (currentVoucher.name === "OTT Variable Amount") {
      const newVoucher: MobileDataVoucher = {
        ...currentVoucher,
        supplier_id: selectedSupplier.id,
        supplier_name: selectedSupplier.supplier_name,
        // For OTT, we don't calculate profit since amount is variable
        profit: 0,
        // Ensure commissions are properly set
        total_comm: currentVoucher.total_comm || 0,
        retailer_comm: currentVoucher.retailer_comm || 0,
        sales_agent_comm: currentVoucher.sales_agent_comm || 0,
      };

      setSelectedVouchers((prev) => [...prev, newVoucher]);
      resetVoucherForm();
      setSelectedMainVoucherGroup(undefined);
      return;
    }

    // Existing validation for non-OTT vouchers
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
    resetVoucherForm();
    setSelectedMainVoucherGroup(undefined);
  };

  const handleSubmit = async () => {
    console.log("commGroupId", commGroupId);
    if (selectedVouchers.length > 0 && commGroupId) {
      setLoading(true);

      type VoucherWithNetwork = MobileDataVoucher & {
        networkProvider?: string;
        comm_group_id: string;
      };

      const vouchersWithCommGroupId = selectedVouchers.map((voucher) => {
        // Create a new object with only the fields we want to save
        const {
          name,
          vendorId,
          amount,
          total_comm,
          retailer_comm,
          sales_agent_comm,
          supplier_id,
          supplier_name,
          profit,
        } = voucher;

        return {
          name,
          vendorId,
          amount,
          total_comm,
          retailer_comm,
          sales_agent_comm,
          supplier_id,
          supplier_name,
          profit,
          comm_group_id: commGroupId,
        };
      });

      try {
        const result = await addVouchersToMobileDataVouchers(
          vouchersWithCommGroupId,
        );

        if ("error" in result) {
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
      } catch (error) {
        console.error("Error adding vouchers:", error);
      } finally {
        setLoading(false);
      }
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

  const handleVoucherSelect = (selectedVoucher: MobileDataVoucher) => {
    setCurrentVoucher({
      ...selectedVoucher,
      supplier_id: selectedSupplier?.id || 0,
      supplier_name: selectedSupplier?.supplier_name || "",
      networkProvider: (selectedVoucher.vendorId?.toUpperCase() || "MTN") as
        | "CELLC"
        | "MTN"
        | "TELKOM"
        | "VODACOM",
    });
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

            {/* <div className="mb-5">
              <BulkUpload onUpload={handleBulkUpload} />
            </div> */}

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

                {/* Add Network Selection Blocks */}
                {selectedSupplierApi?.name &&
                  selectedSupplier?.supplier_name !== "OTT" &&
                  (selectedSupplierApi.name === "Mobile Data" ||
                    selectedSupplierApi.name === "Mobile Airtime") && (
                    <div className="mb-6 mt-6">
                      <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
                        Filter by Network
                      </h3>
                      <div className="grid grid-cols-4 gap-4">
                        {networkOptions.map((network) => (
                          <button
                            key={network}
                            onClick={() =>
                              setSelectedNetwork(network as NetworkProvider)
                            }
                            className={`
                              rounded-lg border p-4 text-center text-xs font-semibold shadow transition-colors duration-200
                              ${
                                selectedNetwork === network
                                  ? networkStyles[network as NetworkProvider]
                                      .selected
                                  : networkStyles[network as NetworkProvider]
                                      .default
                              }
                            `}
                          >
                            {network}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                  onVoucherSelect={handleVoucherSelect}
                  ottVoucher={ottVoucher}
                  error={voucherError}
                  selectedVouchers={selectedVouchers}
                  existingVouchers={existingVouchers}
                />

                <CommissionInputs
                  currentVoucher={currentVoucher}
                  errors={errors}
                  onCommissionChange={handleVoucherChange}
                />

                <button
                  className="mb-3 w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:text-white"
                  onClick={handleAddVoucher}
                >
                  Add Voucher
                </button>

                <VoucherTable
                  vouchers={selectedVouchers}
                  onDeleteVoucher={handleDeleteVoucher}
                />

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    className="w-32 rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700 dark:text-white"
                    onClick={handleModalClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className={`w-32 rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 ${
                      loading ? null : "hover:bg-blue-800"
                    } dark:text-white`}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2 bg-blue-700">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span className="dark:text-white">Saving...</span>
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
