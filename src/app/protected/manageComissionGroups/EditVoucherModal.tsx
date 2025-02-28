import React from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { MobileDataVoucher } from "@/app/types/common";

interface EditVoucherModalProps {
  open: boolean;
  handleClose: () => void;
  voucher: MobileDataVoucher;
  handleEditVoucher: (updatedVoucher: MobileDataVoucher) => void;
  handleDeleteVoucher: (voucherId: string) => void;
  editError?: string;
  editSuccess?: string;
  loading?: boolean;
}

const EditVoucherModal: React.FC<EditVoucherModalProps> = ({
  open,
  handleClose,
  voucher,
  handleEditVoucher,
  handleDeleteVoucher,
  editError,
  editSuccess,
  loading,
}) => {
  const [currentVoucher, setCurrentVoucher] =
    React.useState<MobileDataVoucher>(voucher);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    setCurrentVoucher(voucher);
    setConfirmDelete(false);
  }, [voucher]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionVoucher = {
      ...currentVoucher,
      total_comm: currentVoucher.total_comm / 100,
      retailer_comm: currentVoucher.retailer_comm / 100,
      sales_agent_comm: currentVoucher.sales_agent_comm / 100,
    };
    handleEditVoucher(submissionVoucher);
  };

  const getCommissionDisplayValue = (value: number | undefined | null) => {
    if (value === undefined || value === null) return 0;
    return Math.round(value * 100);
  };

  React.useEffect(() => {
    if (voucher) {
      setCurrentVoucher({
        ...voucher,
        total_comm: getCommissionDisplayValue(voucher.total_comm),
        retailer_comm: getCommissionDisplayValue(voucher.retailer_comm),
        sales_agent_comm: getCommissionDisplayValue(voucher.sales_agent_comm),
      });
    }
  }, [voucher]);

  const handleVoucherChange = (field: string, value: number) => {
    setCurrentVoucher((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleConfirmDelete = () => {
    if (!currentVoucher.id) return;
    handleDeleteVoucher(currentVoucher.id.toString());
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          p: 4,
        }}
        className="bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <h2 className="mb-3 text-center text-3xl font-semibold text-gray-800 dark:text-white">
          Edit Voucher
        </h2>
        <p className="mb-10 text-center text-xl text-gray-600 dark:text-gray-300">
          {voucher.name}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-5 flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">
                Supplier Commission (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={currentVoucher.total_comm}
                onChange={(e) =>
                  handleVoucherChange("total_comm", parseFloat(e.target.value))
                }
                className="w-2/3 rounded-lg border px-4 py-2 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">
                Retailer Commission (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={currentVoucher.retailer_comm}
                onChange={(e) =>
                  handleVoucherChange(
                    "retailer_comm",
                    parseFloat(e.target.value),
                  )
                }
                className="w-2/3 rounded-lg border px-4 py-2 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">
                Sales Agent Commission (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={currentVoucher.sales_agent_comm}
                onChange={(e) =>
                  handleVoucherChange(
                    "sales_agent_comm",
                    parseFloat(e.target.value),
                  )
                }
                className="w-2/3 rounded-lg border px-4 py-2 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
            </div>
          ) : editError ? (
            <p className="text-center text-red-500">{editError}</p>
          ) : editSuccess ? (
            <>
              <p className="mb-4 text-center font-bold text-green-500">
                {editSuccess}
              </p>
              <button
                onClick={handleClose}
                className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800"
              >
                Done
              </button>
            </>
          ) : confirmDelete ? (
            <>
              <p className="mb-4 text-center text-red-500">
                Are you sure you want to delete this voucher?
              </p>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="mb-3 w-full rounded-lg bg-red-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-red-700"
                disabled={loading}
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                className="mb-3 w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800"
                disabled={loading}
                style={{ marginBottom: -10 }}
              >
                Update Voucher
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                style={{ marginBottom: -10 }}
                className="mb-3 w-full rounded-lg bg-red-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-red-700"
              >
                Delete Voucher
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700"
              >
                Cancel
              </button>
            </>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default EditVoucherModal;
