import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import {
  Box,
  Switch,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { User, Retailer, Terminal } from "@/app/types/common";
import { getAdminsAction } from "../manageAdmins/actions";
import { getRetailersAction } from "../retailersList/actions";

interface AddTerminalModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddTerminal: (e: React.FormEvent) => void;
  newTerminal: any;
  setNewTerminal: (value: any) => void;
  //newTerminal: User;
  setNewCashier: (value: any) => void;
  error: string;
  success: string;
  loading: boolean;
  setLoading: (value: boolean) => void;
  generateSecurePassword: () => void;
}

const AddTerminalModal: React.FC<AddTerminalModalProps> = ({
  open,
  handleClose,
  handleAddTerminal,
  newTerminal,
  setNewTerminal,
  setNewCashier,
  error,
  success,
  loading,
  setLoading,
  generateSecurePassword,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNewTerminal((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewTerminal((prev: any) => ({ ...prev, [name]: checked }));
  };

  const [retailers, setRetailers] = useState<Retailer[]>([]);

  const fetchRetailers = async (doLoad: boolean) => {
    if (doLoad) setLoading(true);
    const response = await getRetailersAction();

    console.log("Retailers: ", response);

    if (response?.retailers) {
      setRetailers(response.retailers);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRetailers(true);
  }, []);

  // const handleTerminalSelect = (event: SelectChangeEvent<string>) => {
  //   const selectedTerminal = event.target.value as string;
  //   const retailer = retailers.find((r) => r.id === selectedTerminal);
  //   if (retailer) {
  //     setUpdatedAdmin((prev: any) => ({
  //       ...prev,
  //       assigned_retailers: [...prev.assigned_retailers, retailer],
  //     }));
  //     setAssignedTerminalsUpdated(true);
  //   }
  // };

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
          Add New Terminal
        </h2>
        <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
          Fill in the terminal&apos;s details to add it to the platform.
        </p>

        <form onSubmit={handleAddTerminal} className="space-y-6">
          <div style={{ marginTop: 10 }}>
            <label
              htmlFor="assignedAdmin"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Assigned Retailer
            </label>
            <FormControl fullWidth>
              <Select
                labelId="retailer-select-label"
                value={newTerminal.assigned_retailer} // Bind the value to a state variable
                onChange={(e) =>
                  setNewTerminal((prev: any) => ({
                    ...prev,
                    assigned_retailer: e.target.value,
                  }))
                }
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
                  Select a retailer
                </MenuItem>
                {retailers.map((retailer) => (
                  <MenuItem key={retailer.id} value={retailer.id}>
                    {retailer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <label
              htmlFor="contactPerson"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Cashier&apos;s Name
            </label>
            <input
              type="text"
              id="cashier_name"
              name="cashier_name"
              value={newTerminal?.cashier_name}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter cashier's name"
            />
          </div>

          <div>
            <label
              htmlFor="retailerEmail"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Cashier&apos;s Email
            </label>
            <input
              type="text"
              id="cashier_email"
              name="cashier_email"
              value={newTerminal?.cashier_email}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter cashier's email"
            />
          </div>
          <div>
            <label
              htmlFor="contactNumber"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Contact Number
            </label>
            <input
              type="text"
              id="contact_number"
              name="contact_number"
              value={newTerminal?.contact_number}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter cashier's contact no"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Password
            </label>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="password"
                name="password"
                placeholder="Password"
                value={newTerminal?.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={generateSecurePassword}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
              >
                Generate
              </button>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div className="flex w-full items-center justify-between">
              Active
              <div style={{ marginRight: -7 }}>
                <Switch
                  name="active"
                  checked={newTerminal.active}
                  onChange={handleSwitchChange}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <p className="mb-4 text-center text-red-500">{error}</p>
          ) : success ? (
            <>
              <p className="mb-4 text-center text-green-500">
                Terminal added successfully!
              </p>
              <button
                onClick={handleClose}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Create Terminal
              </button>
              <button
                onClick={handleClose}
                style={{ marginTop: 15 }}
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

export default AddTerminalModal;
