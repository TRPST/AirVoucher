import React from "react";
import Modal from "@mui/material/Modal";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { Admin, Retailer } from "@/app/types/common";
import EastIcon from "@mui/icons-material/East";
import { getRetailersAction } from "../retailersList/actions";

interface EditAdminModalProps {
  open: boolean;
  handleClose: () => void;
  handleEditAdmin: (e: React.FormEvent) => void;
  handleDeleteAdmin: (id: string) => void;
  confirmDeleteAdmin: boolean;
  updatedAdmin: Admin;
  setUpdatedAdmin: (value: any) => void;
  setConfirmDeleteAdmin: (value: boolean) => void;
  editError: string;
  editSuccess: string;
  editLoading: boolean;
  setEditLoading: (value: boolean) => void;
  generateUniqueAdminID: () => string;
  generateSecurePassword: () => void;
}

const EditAdminModal: React.FC<EditAdminModalProps> = ({
  open,
  handleClose,
  handleEditAdmin,
  handleDeleteAdmin,
  confirmDeleteAdmin,
  updatedAdmin,
  setUpdatedAdmin,
  editError,
  editSuccess,
  editLoading,
  setEditLoading,
  setConfirmDeleteAdmin,
  generateUniqueAdminID,
  generateSecurePassword,
}) => {
  const theme = useTheme();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUpdatedAdmin((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUpdatedAdmin((prev: any) => ({ ...prev, [name]: checked }));
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirmDeleteAdmin) {
      handleDeleteAdmin(updatedAdmin.id);
    } else {
      setConfirmDeleteAdmin(true);
    }
  };

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirmDeleteAdmin) {
      setConfirmDeleteAdmin(false);
    } else {
      handleClose();
    }
  };

  const [retailersList, setRetailersList] = React.useState(false);
  const [retailers, setRetailers] = React.useState<Retailer[]>([]);
  const [fetchingRetailers, setFetchingRetailers] = React.useState(false);

  const fetchRetailers = async (doLoad: Boolean) => {
    if (doLoad) setFetchingRetailers(true);

    const { retailers, error } = await getRetailersAction();
    //console.log("Retailers: ", retailers);
    if (error) {
      console.error(error);
    } else {
      if (retailers) {
        setRetailers(retailers);
      }
    }
    setFetchingRetailers(false);
  };

  React.useEffect(() => {
    fetchRetailers(true);
  }, []);

  const handleRetailerSelect = (event: SelectChangeEvent<string>) => {
    const selectedRetailer = event.target.value as string;
    const retailer = retailers.find((r) => r.id === selectedRetailer);
    if (retailer) {
      setUpdatedAdmin((prev: any) => ({
        ...prev,
        assigned_retailers: [...prev.assigned_retailers, retailer],
      }));
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
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
          Update Admin
        </h2>
        {editSuccess != "Admin deleted successfully" && !retailersList && (
          <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
            Fill in the admin&apos;s details to update them on the platform.
          </p>
        )}

        <form onSubmit={handleEditAdmin} className="space-y-6">
          {editSuccess === "Admin deleted successfully" ? (
            <></>
          ) : retailersList ? (
            <>
              <div style={{ marginTop: 10 }}>
                <FormControl fullWidth>
                  <Select
                    labelId="retailer-select-label"
                    value={""} // Bind the value to a state variable
                    onChange={handleRetailerSelect}
                    displayEmpty // Ensures the placeholder is visible when no value is selected
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    style={{ color: "white" }}
                    sx={{
                      height: "40px",
                      alignItems: "center",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid grey", // Default border color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "2px solid white", // Hover border color
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "2px solid white", // Focused border color
                      },
                      "& .MuiSelect-select": {
                        color: "white", // Change this to your desired color for the selected option
                        padding: "0", // Remove extra padding
                        paddingLeft: "0px", // Optional: Adjust left padding
                      },
                      "& .MuiSelect-icon": {
                        color: "white", // Change the color of the arrow to white
                      },
                    }}
                  >
                    <MenuItem value="" disabled sx={{ display: "none" }}>
                      Select a retailer
                    </MenuItem>
                    {retailers.map((retailer) => (
                      <MenuItem key={retailer.id} value={retailer.id}>
                        {retailer.name} - {retailer.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {updatedAdmin.assigned_retailers &&
              updatedAdmin.assigned_retailers.length > 0 ? (
                updatedAdmin.assigned_retailers?.map((retailer: Retailer) => (
                  <div key={retailer.id}>
                    <Typography variant="body2">
                      {retailer.name} - {retailer.email}
                    </Typography>
                  </div>
                ))
              ) : (
                <p className="mb-4 text-center text-gray-400">
                  No retailers assigned to this admin
                </p>
              )}
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Name"
                value={updatedAdmin.name}
                onChange={(e) =>
                  setUpdatedAdmin({ ...updatedAdmin, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                value={updatedAdmin.email}
                onChange={(e) =>
                  setUpdatedAdmin({ ...updatedAdmin, email: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              />

              <div style={{ marginTop: 10 }}>
                <div className="flex w-full items-center justify-between">
                  Active
                  <div className="ml-4">
                    <Switch
                      checked={updatedAdmin.active}
                      onChange={(e) => {
                        setUpdatedAdmin({
                          ...updatedAdmin,
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
                      checked={updatedAdmin.terminal_access}
                      onChange={(e) => {
                        setUpdatedAdmin({
                          ...updatedAdmin,
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
                      checked={updatedAdmin.role === "superAdmin"}
                      onChange={(e) => {
                        setUpdatedAdmin({
                          ...updatedAdmin,
                          role: e.target.checked ? "superAdmin" : "admin",
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 5 }}>
                <div className="flex w-full flex-row items-center justify-between">
                  Assigned Retailers
                  <IconButton
                    color="primary"
                    className="text-grey dark:text-grey hover:text-black dark:hover:text-white"
                    sx={{
                      fontSize: 30,
                      color: "grey",
                    }}
                    onClick={() => {
                      setRetailersList(true);
                    }}
                  >
                    <EastIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </div>
              </div>
            </>
          )}
          {editLoading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : editError ? (
            <p className="mb-4 text-center text-red-500">{editError}</p>
          ) : editSuccess ? (
            <>
              <p className="mb-4 text-center font-bold text-green-500">
                {editSuccess}
              </p>
              <button
                onClick={handleClose}
                className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Done
              </button>
            </>
          ) : retailersList ? (
            <button
              style={{ marginTop: 15 }}
              onClick={() => setRetailersList(false)}
              className="w-full rounded-lg bg-gray-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Back
            </button>
          ) : (
            <>
              {confirmDeleteAdmin ? (
                <p className="mb-4 text-center text-red-500">
                  Are you sure you want to delete this admin?
                </p>
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Update Admin
                </button>
              )}

              <>
                <button
                  style={{ marginTop: 15 }}
                  onClick={handleDeleteClick}
                  className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  {confirmDeleteAdmin ? "Confirm Delete" : "Delete Admin"}
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

export default EditAdminModal;
