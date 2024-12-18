import React from "react";
import Modal from "@mui/material/Modal";
import { Box, Switch, Typography } from "@mui/material";
import { User } from "@/app/types/common";

interface AddAdminModalProps {
  open: boolean;
  handleClose: () => void;
  handleCreateAdmin: (e: React.FormEvent) => void;
  newAdmin: User;
  setNewAdmin: (value: any) => void;
  error: string;
  success: string;
  loading: boolean;
  setLoading: (value: boolean) => void;
  generateUniqueAdminID: () => string;
  generateSecurePassword: () => void;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  open,
  handleClose,
  handleCreateAdmin,
  newAdmin,
  setNewAdmin,
  error,
  success,
  loading,
  setLoading,
  generateUniqueAdminID,
  generateSecurePassword,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNewAdmin((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewAdmin((prev: any) => ({ ...prev, [name]: checked }));
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
              Add New Admin
            </h2>
            <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
              Fill in the admin&apos;s details to add them to the platform.
            </p>

            <form
              onSubmit={handleCreateAdmin}
              className="flex flex-col space-y-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={newAdmin.contact_number}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, contact_number: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Password"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    setNewAdmin({
                      ...newAdmin,
                      password: generateSecurePassword(),
                    })
                  }
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
                >
                  Generate
                </button>
              </div>
              <div style={{ marginTop: 10 }}>
                <div className="flex w-full items-center justify-between">
                  Active
                  <div className="ml-4">
                    <Switch
                      checked={newAdmin.active}
                      onChange={(e) => {
                        setNewAdmin({
                          ...newAdmin,
                          active: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 0 }}>
                <div className="flex w-full flex-row items-center justify-between">
                  Terminal Access
                  <div className="ml-4">
                    <Switch
                      checked={newAdmin.terminal_access}
                      onChange={(e) => {
                        setNewAdmin({
                          ...newAdmin,
                          terminal_access: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 0 }}>
                <div className="flex w-full flex-row items-center justify-between">
                  Super Admin
                  <div className="ml-4">
                    <Switch
                      checked={newAdmin.role === "superAdmin"}
                      onChange={(e) => {
                        setNewAdmin({
                          ...newAdmin,
                          role: e.target.checked ? "superAdmin" : "admin",
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

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
                  onClick={handleCreateAdmin}
                  className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Create Admin
                </button>
              )}
            </form>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddAdminModal;
