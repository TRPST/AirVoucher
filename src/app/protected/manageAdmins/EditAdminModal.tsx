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
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { Admin, Retailer } from "@/app/types/common";
import EastIcon from "@mui/icons-material/East";
import {
  getRetailersAction,
  getRetailersByAdminIdAction,
} from "../retailersList/actions";
import TableCell from "../../../components/Tables/TableCell";
import DeleteIcon from "@mui/icons-material/Delete";
import { assignAdminToRetailer, removeAdminFromRetailer } from "./actions";

interface EditAdminModalProps {
  open: boolean;
  handleClose: () => void;
  handleEditAdmin: (e: React.FormEvent) => void;
  handleEditAdminRetailers: (value: Admin) => void;
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
  handleEditAdminRetailers,
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
    console.log("Fetching retailers");
    if (doLoad) setFetchingRetailers(true);

    const result = await getRetailersAction();
    const retailers = result?.retailers || [];
    //console.log("Retailers: ", retailers);
    if (retailers) {
      setRetailers(retailers);
    }
    setFetchingRetailers(false);
  };

  React.useEffect(() => {
    fetchRetailers(true);
  }, [updatedAdmin]);

  // React.useEffect(() => {
  //   const fetchRetailers = async () => {
  //     console.log("Fetching retailers for admin: ", updatedAdmin.id);
  //     const result = await getRetailersByAdminIdAction(updatedAdmin.id);

  //     console.log("Retailers for admin: ", result);

  //     if (!result) {
  //       console.error("Error fetching retailers: result is undefined");
  //       return;
  //     }

  //     const retailers = result?.retailers || [];
  //     console.log("Retailers for admin: ", retailers);

  //     // if (error) {
  //     //   console.error("Error fetching retailers:", error);
  //     //   return;
  //     // }

  //     setRetailers(retailers || []);
  //   };

  //   fetchRetailers();
  // }, [updatedAdmin.id]);

  const [assignedRetailersUpdated, setAssignedRetailersUpdated] =
    React.useState(false);

  const handleRetailerSelect = async (event: SelectChangeEvent<string>) => {
    const selectedRetailerId = event.target.value as string;
    const retailer = retailers.find((r) => r.id === selectedRetailerId);

    if (retailer) {
      const { error } = await assignAdminToRetailer(
        selectedRetailerId,
        updatedAdmin.id,
      );

      if (error) {
        console.error("Error assigning admin to retailer:", error);
        return;
      }

      setUpdatedAdmin((prev: any) => ({
        ...prev,
        assigned_retailers: [...prev.assigned_retailers, retailer],
      }));

      // Update the retailers state list
      const updatedRetailers = retailers.map((r) =>
        r.id === selectedRetailerId
          ? { ...r, assigned_admin: `"${updatedAdmin.id}"` }
          : r,
      );
      setRetailers(updatedRetailers);

      setAssignedRetailersUpdated(true);
    }
  };

  const handleRemoveRetailer = async (retailerId: string) => {
    const { error } = await removeAdminFromRetailer(retailerId);

    if (error) {
      console.error("Error removing admin from retailer:", error);
      return;
    }

    setUpdatedAdmin((prevAdmin: Admin) => ({
      ...prevAdmin,
      assigned_retailers: prevAdmin.assigned_retailers?.filter(
        (retailer) => retailer !== retailerId,
      ),
    }));

    // Update the retailers state list
    const updatedRetailers = retailers.map((r) =>
      r.id === retailerId ? { ...r, assigned_admin: "" } : r,
    );
    setRetailers(updatedRetailers);

    setAssignedRetailersUpdated(true);
  };

  const handleCloseRetailersList = () => {
    setRetailersList(false);
    setAssignedRetailersUpdated(false);
  };

  const handleCloseEditModal = () => {
    setRetailersList(false);

    handleClose();
  };

  const tableHeaders = ["Name", "Location", "Remove"];

  return (
    <Modal
      open={open}
      onClose={handleCloseEditModal}
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
          maxHeight: "90vh", // Limit height to 90% of the viewport height
          overflowY: "auto", // Make contents scrollable
          bgcolor: "background.paper",
          border: "2px solid #000",
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
                        border: "2px solid grey", // Hover border color
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "2px solid grey", // Focused border color
                      },
                      "& .MuiSelect-select": {
                        color: "grey", // Change this to your desired color for the selected option
                        padding: "0", // Remove extra padding
                        paddingLeft: "0px", // Optional: Adjust left padding
                      },
                      "& .MuiSelect-icon": {
                        color: "grey", // Change the color of the arrow to white
                      },
                    }}
                  >
                    <MenuItem value="" disabled sx={{ display: "none" }}>
                      Add a retailer
                    </MenuItem>
                    {retailers
                      .filter(
                        (retailer) =>
                          retailer.assigned_admin != `"${updatedAdmin.id}"`,
                      )
                      .map((retailer: Retailer) => (
                        <MenuItem key={retailer.id} value={retailer.id}>
                          {retailer.name} - {retailer.location}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              {updatedAdmin.assigned_retailers &&
              updatedAdmin.assigned_retailers.length > 0 ? (
                <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {tableHeaders.map((header) => (
                        <th
                          key={header}
                          className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {retailers
                      .filter(
                        (retailer) =>
                          retailer.assigned_admin === `"${updatedAdmin.id}"`,
                      )
                      .map((retailer: Retailer) => (
                        <tr
                          key={retailer.id}
                          className=" bg-white transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                            {retailer.name}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                            {retailer.location}
                          </td>
                          <td className="flex items-center justify-center border border-gray-300 px-4 py-2 dark:border-gray-600">
                            <IconButton
                              style={{ cursor: "pointer" }}
                              onClick={() => handleRemoveRetailer(retailer.id)}
                            >
                              <DeleteIcon sx={{ color: "grey" }} />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
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
                onClick={retailersList ? handleCloseRetailersList : handleClose}
                className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Done
              </button>
            </>
          ) : retailersList ? (
            <>
              {assignedRetailersUpdated && (
                <button
                  style={{ marginTop: 15 }}
                  onClick={() => handleEditAdminRetailers(updatedAdmin)}
                  className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Update
                </button>
              )}
              <button
                style={{ marginTop: 15 }}
                onClick={() => setRetailersList(false)}
                className="w-full rounded-lg bg-gray-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                {assignedRetailersUpdated ? "Cancel" : "Back"}
              </button>
            </>
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
