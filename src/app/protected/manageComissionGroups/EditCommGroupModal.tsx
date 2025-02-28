import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Switch } from "@mui/material";
import { editCommGroupNameAction, deleteCommGroupAction } from "./actions";

interface EditCommGroupModalProps {
  open: boolean;
  handleClose: () => void;
  commGroupId: string;
  commGroupName: string;
  onCommGroupEdited?: () => void;
}

const EditCommGroupModal: React.FC<EditCommGroupModalProps> = ({
  open,
  handleClose,
  commGroupId,
  commGroupName,
  onCommGroupEdited,
}) => {
  const [name, setName] = useState(commGroupName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleEditCommGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Commission group name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await editCommGroupNameAction(commGroupId, name);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Commission group updated successfully");
        if (onCommGroupEdited) {
          onCommGroupEdited();
        }
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error updating commission group:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCommGroup = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await deleteCommGroupAction(commGroupId);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Commission group deleted successfully");
        if (onCommGroupEdited) {
          onCommGroupEdited();
        }
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error deleting commission group:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirmDelete) {
      setConfirmDelete(false);
    } else {
      handleClose();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirmDelete) {
      handleDeleteCommGroup();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-commission-group-modal"
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
          Update Commission Group
        </h2>
        {success !== "Commission group deleted successfully" && (
          <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
            Edit the commission group name below.
          </p>
        )}

        <form onSubmit={handleEditCommGroup} className="space-y-6">
          {success === "Commission group deleted successfully" ? (
            <></>
          ) : (
            <>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              />
            </>
          )}

          {loading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <p className="mb-4 text-center text-red-500">{error}</p>
          ) : success ? (
            <>
              <p className="mb-4 text-center font-bold text-green-500">
                {success}
              </p>
              <button
                onClick={handleClose}
                className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Done
              </button>
            </>
          ) : (
            <>
              {confirmDelete ? (
                <p className="mb-4 text-center text-red-500">
                  Are you sure you want to delete this commission group?
                </p>
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Update Group
                </button>
              )}

              <>
                <button
                  style={{ marginTop: 15 }}
                  onClick={handleDeleteClick}
                  className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  {confirmDelete ? "Confirm" : "Delete Group"}
                </button>

                <button
                  style={{ marginTop: 15 }}
                  onClick={handleCancelClick}
                  className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            </>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default EditCommGroupModal;
