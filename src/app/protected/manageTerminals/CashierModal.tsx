import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { User } from "@/app/types/common";
import { getCashierByIdAction } from "./actions";

interface CashierModalProps {
  open: boolean;
  handleCashierClose: () => void;
  selectedCashier: string;
}

const CashierModal: React.FC<CashierModalProps> = ({
  open,
  handleCashierClose,
  selectedCashier,
}) => {
  const [cashier, setCashier] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCashier = async () => {
      if (selectedCashier) {
        setLoading(true);
        const { cashier, error } = await getCashierByIdAction(selectedCashier);
        if (!error && cashier) {
          setCashier(cashier);
        }
        setLoading(false);
      }
    };
    fetchCashier();
  }, [selectedCashier]);

  return (
    <Modal
      open={open}
      onClose={handleCashierClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 550,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
        className="bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
          Cashier Details
        </h2>
        <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
          View cashier information
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="mb-3 block font-semibold text-gray-700 dark:text-gray-300">
                ID
              </label>
              <input
                type="text"
                value={cashier?.id || ""}
                disabled
                className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-black dark:bg-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block font-semibold text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={cashier?.name || ""}
                disabled
                className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-black dark:bg-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block font-semibold text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="text"
                value={cashier?.email || ""}
                disabled
                className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-black dark:bg-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block font-semibold text-gray-700 dark:text-gray-300">
                Contact Number
              </label>
              <input
                type="text"
                value={cashier?.contact_number || ""}
                disabled
                className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-black dark:bg-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block font-semibold text-gray-700 dark:text-gray-300">
                Role
              </label>
              <input
                type="text"
                value={cashier?.role || ""}
                disabled
                className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-black dark:bg-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block font-semibold text-gray-700 dark:text-gray-300">
                Active Status
              </label>
              <input
                type="text"
                value={cashier?.active ? "Active" : "Inactive"}
                disabled
                className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-black dark:bg-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block font-semibold text-gray-700 dark:text-gray-300">
                Terminal Access
              </label>
              <input
                type="text"
                value={cashier?.terminal_access ? "Enabled" : "Disabled"}
                disabled
                className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-black dark:bg-gray-600 dark:text-white"
              />
            </div>

            <button
              onClick={handleCashierClose}
              className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default CashierModal;
