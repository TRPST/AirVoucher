import React from "react";
import Modal from "@mui/material/Modal";
import {
  Box,
  Switch,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { User } from "@/app/types/common";
import { getAdminsAction } from "../manageAdmins/actions";

interface AddRetailerModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddRetailer: (e: React.FormEvent) => void;
  newRetailer: {
    name: string;
    location: string;
    contact_number: string;
    active: boolean;
    terminal_access: boolean;
    contact_person: string;
    email: string;
    password: string;
    assigned_admin: string;
  };
  setNewRetailer: (value: any) => void;
  error: string;
  success: string;
  loading: boolean;
  setLoading: (value: boolean) => void;
  generateUniqueRetailerID: () => string;
  generateSecurePassword: () => void;
}

const AddRetailerModal: React.FC<AddRetailerModalProps> = ({
  open,
  handleClose,
  handleAddRetailer,
  newRetailer,
  setNewRetailer,
  error,
  success,
  loading,
  setLoading,
  generateUniqueRetailerID,
  generateSecurePassword,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNewRetailer((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewRetailer((prev: any) => ({ ...prev, [name]: checked }));
  };

  const [admins, setAdmins] = React.useState<User[]>([]);

  const fetchAdmins = async (doLoad: boolean) => {
    if (doLoad) setLoading(true);
    const { users, error } = await getAdminsAction();
    //console.log("Users: ", users);
    if (error) {
      console.error(error);
    } else {
      if (users) {
        setAdmins(users);
      }
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchAdmins(true);
  }, []);

  // const handleRetailerSelect = (event: SelectChangeEvent<string>) => {
  //   const selectedRetailer = event.target.value as string;
  //   const retailer = retailers.find((r) => r.id === selectedRetailer);
  //   if (retailer) {
  //     setUpdatedAdmin((prev: any) => ({
  //       ...prev,
  //       assigned_retailers: [...prev.assigned_retailers, retailer],
  //     }));
  //     setAssignedRetailersUpdated(true);
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
          Add New Retailer
        </h2>
        <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
          Fill in the retailer&apos;s details to add them to the platform.
        </p>

        <form onSubmit={handleAddRetailer} className="space-y-6">
          <div style={{ marginTop: 10 }}>
            <label
              htmlFor="assignedAdmin"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Assigned Admin
            </label>
            <FormControl fullWidth>
              <Select
                labelId="retailer-select-label"
                value={newRetailer.assigned_admin} // Bind the value to a state variable
                onChange={(e) =>
                  setNewRetailer((prev: any) => ({
                    ...prev,
                    assigned_admin: e.target.value,
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
                  Select an admin
                </MenuItem>
                {admins.map((admin) => (
                  <MenuItem key={admin.id} value={admin.id}>
                    {admin.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <label
              htmlFor="retailerName"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Retailer Store Name
            </label>
            <input
              type="text"
              id="retailerName"
              name="name"
              value={newRetailer.name}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter retailer's store name"
            />
          </div>
          <div>
            <label
              htmlFor="retailerEmail"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Retailer Email
            </label>
            <input
              type="text"
              id="retailerEmail"
              name="email"
              value={newRetailer.email}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter retailer's email"
            />
          </div>
          <div>
            <label
              htmlFor="contactPerson"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Contact Person Name
            </label>
            <input
              type="text"
              id="contact_person"
              name="contact_person"
              value={newRetailer.contact_person}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter retailer's owner's name"
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
              value={newRetailer.contact_number}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter retailer's contact no"
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
                value={newRetailer.password}
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
          <div>
            <label
              htmlFor="location"
              className="mb-2 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={newRetailer.location}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter retailer's location"
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <div className="flex w-full items-center justify-between">
              Active
              <div style={{ marginRight: -7 }}>
                <Switch
                  name="active"
                  checked={newRetailer.active}
                  onChange={handleSwitchChange}
                />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 0 }}>
            <div className="flex w-full flex-row items-center justify-between">
              Terminal Access
              <div style={{ marginRight: -7 }}>
                <Switch
                  name="terminal_access"
                  checked={newRetailer.terminal_access}
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
                Retailer added successfully!
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
                Create Retailer
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

export default AddRetailerModal;
