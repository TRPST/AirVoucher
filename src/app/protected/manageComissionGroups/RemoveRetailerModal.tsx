import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { removeRetailerFromCommGroupAction } from "./actions";

interface RemoveRetailerModalProps {
  open: boolean;
  handleClose: () => void;
  retailerId: string;
  retailerName: string;
  commGroupName: string;
  onRetailerRemoved?: () => void;
}

const RemoveRetailerModal: React.FC<RemoveRetailerModalProps> = ({
  open,
  handleClose,
  retailerId,
  retailerName,
  commGroupName,
  onRetailerRemoved,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRemoveRetailer = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await removeRetailerFromCommGroupAction(retailerId);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Retailer removed successfully");
        if (onRetailerRemoved) {
          onRetailerRemoved();
        }
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error removing retailer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : handleClose}
      aria-labelledby="remove-retailer-modal-title"
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
          p: 4,
        }}
        className="bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
          Remove Retailer
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <p className="mb-4 text-center text-red-500">{error}</p>
            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : success ? (
          <div className="space-y-6">
            <p className="mb-4 text-center font-bold text-green-500">
              {success}
            </p>
            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              Are you sure you want to remove <strong>{retailerName}</strong>{" "}
              from <strong>{commGroupName}</strong>?
            </p>
            <button
              onClick={handleRemoveRetailer}
              className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Remove Retailer
            </button>
            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default RemoveRetailerModal;
