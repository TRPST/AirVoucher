import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { MobileDataVoucher, Supplier, SupplierAPI } from "@/app/types/common";
import { useVoucherForm } from "@/hooks/useVoucherForm";
import {
  addVouchersToMobileDataVouchers,
  getSupplierApis,
} from "../../actions";

// Import components
import SupplierSection from "./SupplierSection";
import NetworkSelector from "./NetworkSelector";
import VoucherSection from "./VoucherSection";
import ActionButtons from "./ActionButtons";

// Add this type at the top of the file
type SupplierToApiMap = {
  [key: string]: SupplierAPI[];
};

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
  // Core state
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [selectedSupplierApi, setSelectedSupplierApi] =
    useState<SupplierAPI | null>(null);
  const [selectedVouchers, setSelectedVouchers] = useState<MobileDataVoucher[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("CELLC");
  const [voucherError, setVoucherError] = useState<string>("");

  // Form handling
  const {
    formData: currentVoucher,
    errors,
    handleChange: handleVoucherFieldChange,
    validate,
    reset: resetVoucherForm,
    setFormData: setCurrentVoucher,
  } = useVoucherForm();

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
  };

  const handleDeleteVoucher = (index: number) => {
    setSelectedVouchers((prevVouchers) =>
      prevVouchers.filter((_, i) => i !== index),
    );
  };

  const handleVoucherChange = (
    field: keyof typeof currentVoucher,
    value: number,
  ) => {
    if (handleVoucherFieldChange) {
      // Convert to decimal (e.g., 0.105) for internal storage
      const decimalValue = value ? value / 100 : null;
      handleVoucherFieldChange(field, decimalValue);
    }
  };

  const handleSupplierSelect = async (supplier: Supplier | undefined) => {
    setSelectedSupplier(supplier);

    if (supplier) {
      try {
        const result = await getSupplierApis(supplier.supplier_name);
        if (result.supplierApis && result.supplierApis.length === 1) {
          // If supplier has exactly one API, select it automatically
          setSelectedSupplierApi(result.supplierApis[0]);
        } else {
          // If supplier has multiple APIs or no APIs, clear the selection
          setSelectedSupplierApi(null);
        }
      } catch (error) {
        console.error("Error fetching supplier APIs:", error);
        setSelectedSupplierApi(null);
      }
    } else {
      setSelectedSupplierApi(null);
    }

    setSelectedVouchers([]); // Clear selected vouchers
    resetVoucherForm(); // Reset the voucher form
  };

  const handleSubmit = async () => {
    if (selectedVouchers.length > 0 && commGroupId) {
      setLoading(true);

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
    setSelectedSupplierApi(null);
    setSelectedVouchers([]);
    resetVoucherForm();
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

            <SupplierSection
              selectedSupplier={selectedSupplier}
              setSelectedSupplier={handleSupplierSelect}
              selectedSupplierApi={selectedSupplierApi}
              setSelectedSupplierApi={setSelectedSupplierApi}
            />

            {selectedSupplierApi?.name &&
              selectedSupplier?.supplier_name !== "OTT" &&
              (selectedSupplierApi.name === "Mobile Data" ||
                selectedSupplierApi.name === "Mobile Airtime") && (
                <NetworkSelector
                  selectedNetwork={selectedNetwork}
                  setSelectedNetwork={setSelectedNetwork}
                />
              )}

            <VoucherSection
              currentVoucher={currentVoucher}
              selectedSupplier={selectedSupplier}
              selectedSupplierApi={selectedSupplierApi}
              selectedNetwork={selectedNetwork}
              voucherError={voucherError}
              errors={errors}
              selectedVouchers={selectedVouchers}
              existingVouchers={existingVouchers}
              onVoucherSelect={handleVoucherSelect}
              onVoucherChange={handleVoucherChange}
              onAddVoucher={handleAddVoucher}
              onDeleteVoucher={handleDeleteVoucher}
            />

            <ActionButtons
              loading={loading}
              onCancel={handleModalClose}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddSupplierModal;
