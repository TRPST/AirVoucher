// EditTerminalModal.tsx
import React from "react";
import Modal from "@mui/material/Modal";
import { Box, Switch } from "@mui/material";
import { Terminal } from "@/app/types/common";

interface EditTerminalModalProps {
  open: boolean;
  handleClose: () => void;
  handleEditTerminal: (e: React.FormEvent) => void;
  handleDeleteTerminal: (id: string) => void;
  confirmDeleteTerminal: boolean;
  updatedTerminal: Terminal;
  setUpdatedTerminal: (value: any) => void;
  setConfirmDeleteTerminal: (value: boolean) => void;
  editError: string;
  editSuccess: string;
  editLoading: boolean;
  setEditLoading: (value: boolean) => void;
}

const EditTerminalModal: React.FC<EditTerminalModalProps> = ({
  open,
  handleClose,
  handleEditTerminal,
  handleDeleteTerminal,
  confirmDeleteTerminal,
  updatedTerminal,
  setUpdatedTerminal,
  setConfirmDeleteTerminal,
  editError,
  editSuccess,
  editLoading,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUpdatedTerminal((prev: Terminal) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUpdatedTerminal((prev: Terminal) => ({ ...prev, [name]: checked }));
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirmDeleteTerminal) {
      handleDeleteTerminal(updatedTerminal.id);
    } else {
      setConfirmDeleteTerminal(true);
    }
  };

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirmDeleteTerminal) {
      setConfirmDeleteTerminal(false);
    } else {
      handleClose();
    }
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
          Update Terminal
        </h2>
        <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
          Update the terminal details below.
        </p>

        <form onSubmit={handleEditTerminal} className="space-y-6">
          <div>
            <label className="mb-3 block font-semibold text-gray-700 dark:text-gray-300">
              Terminal ID
            </label>
            <input
              type="text"
              value={updatedTerminal.id}
              disabled
              className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-gray-600"
            />
          </div>

          <div>
            <label className="mb-3 block font-semibold text-gray-700 dark:text-gray-300">
              Assigned Retailer
            </label>
            <input
              type="text"
              value={updatedTerminal.retailer_name}
              disabled
              className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-gray-600"
            />
          </div>

          <div>
            <label className="mb-3 block font-semibold text-gray-700 dark:text-gray-300">
              Cashier Name
            </label>
            <input
              type="text"
              name="cashier_name"
              value={updatedTerminal.cashier_name}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="flex w-full items-center justify-between">
              Active
              <div style={{ marginRight: -7 }}>
                <Switch
                  name="active"
                  checked={updatedTerminal.active}
                  onChange={handleSwitchChange}
                />
              </div>
            </div>
          </div>

          {editLoading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : editError ? (
            <p className="mb-4 text-center text-red-500">{editError}</p>
          ) : editSuccess ? (
            <>
              <p className="mb-4 text-center text-green-500">{editSuccess}</p>
              <button
                onClick={handleClose}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Done
              </button>
            </>
          ) : (
            <>
              {confirmDeleteTerminal ? (
                <p className="mb-4 text-center text-red-500">
                  Are you sure you want to delete this terminal?
                </p>
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Update Terminal
                </button>
              )}

              <button
                style={{ marginTop: 15 }}
                onClick={handleDeleteClick}
                className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                {confirmDeleteTerminal ? "Confirm Delete" : "Delete Terminal"}
              </button>

              <button
                style={{ marginTop: 15 }}
                onClick={handleCancelClick}
                className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
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

export default EditTerminalModal;
