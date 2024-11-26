import React from "react";
import Modal from "@mui/material/Modal";
import { Box, Typography } from "@mui/material";

interface AddRetailerModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddRetailer: (e: React.FormEvent) => void;
  error: string;
  success: boolean;
  retailerID: string;
  name: string;
  email: string;
  password: string;
  location: string;
  contactNo: string;
  terminalID: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setLocation: (value: string) => void;
  setContactNo: (value: string) => void;
  setTerminalID: (value: string) => void;
  generateUniqueRetailerID: () => string;
  generateSecurePassword: () => void;
}

const AddRetailerModal: React.FC<AddRetailerModalProps> = ({
  open,
  handleClose,
  handleAddRetailer,
  error,
  success,
  retailerID,
  name,
  email,
  password,
  location,
  contactNo,
  setName,
  setEmail,
  setPassword,
  setLocation,
  setContactNo,
  generateUniqueRetailerID,
  generateSecurePassword,
}) => {
  //console.log("Closer? :", handleClose);
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
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        className=" bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
          Add New Retailer
        </h2>
        <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
          Fill in the retailer&apos;s details to add them to the platform.
        </p>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        {success && (
          <p className="mb-4 text-center text-green-500">
            Retailer added successfully!
          </p>
        )}
        <form onSubmit={handleAddRetailer} className="space-y-6">
          <div>
            <label
              htmlFor="retailerID"
              className="mb-2 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Retailer ID (auto-generated)
            </label>
            <input
              type="text"
              id="retailerID"
              value={retailerID || generateUniqueRetailerID()} // Show generated ID
              readOnly
              className="w-full rounded-lg border bg-gray-100 px-4 py-2 dark:bg-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="retailerName"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Retailer Name
            </label>
            <input
              type="text"
              id="retailerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter retailer's name"
            />
          </div>
          <div>
            <label
              htmlFor="retailerName"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Retailer Email
            </label>
            <input
              type="text"
              id="retailerName"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter retailer's name"
            />
          </div>
          <div>
            <label
              htmlFor="retailerName"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Contact Number
            </label>
            <input
              type="text"
              id="retailerName"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter retailer's name"
            />
          </div>
          <div>
            <label
              htmlFor="retailerName"
              className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
            >
              Password
            </label>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => generateSecurePassword()}
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
              placeholder="Enter retailer's location"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700"
          >
            Add Retailer
          </button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddRetailerModal;
