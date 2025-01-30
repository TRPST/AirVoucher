import React from "react";
import Modal from "@mui/material/Modal";
import { Box, Switch, Typography } from "@mui/material";
import { CommGroup, User } from "@/app/types/common";

interface AddCommGroupModalProps {
  open: boolean;
  handleClose: () => void;
  handleCreateCommGroup: (e: React.FormEvent) => void;
  newCommGroup: CommGroup;
  setNewCommGroup: (value: any) => void;
  error: string;
  success: string;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const AddCommGroupModal: React.FC<AddCommGroupModalProps> = ({
  open,
  handleClose,
  handleCreateCommGroup,
  newCommGroup,
  setNewCommGroup,
  error,
  success,
  loading,
  setLoading,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNewCommGroup((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewCommGroup((prev: any) => ({ ...prev, [name]: checked }));
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
          width: 500,
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
              Create Commission Group
            </h2>
            <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
              Fill in the commission group&apos;s details to add it to the
              platform.
            </p>

            <form
              onSubmit={handleCreateCommGroup}
              className="flex flex-col space-y-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={newCommGroup.name}
                onChange={(e) =>
                  setNewCommGroup({ ...newCommGroup, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              />

              {loading ? (
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
              ) : error ? (
                <>
                  <p className="mb-4 text-center font-bold text-red-500">
                    {error}
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
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
                <button
                  onClick={handleCreateCommGroup}
                  className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Create Commission Group
                </button>
              )}
            </form>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddCommGroupModal;
