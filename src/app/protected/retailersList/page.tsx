"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Box, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import TableCell from "./TableCell";
import AddRetailerModal from "./AddRetailerModal";

const RetailersList = () => {
  const [retailers, setRetailers] = useState([
    {
      id: "ARV1T", // Example ID
      name: "Retailer 1",
      type: "Electronics",
      location: "New York",
      contactPerson: "John Doe",
      contactNumber: "123-456-7890",
      swipingTerminalStatus: "Active",
      status: "Active",
    },
    {
      id: "ARV2T", // Example ID
      name: "Retailer 2",
      type: "Grocery",
      location: "Los Angeles",
      contactPerson: "Jane Smith",
      contactNumber: "987-654-3210",
      swipingTerminalStatus: "Inactive",
      status: "Inactive",
    },
    // Add more sample data or fetch from an API
  ]);

  const [retailerID, setRetailerID] = useState(""); // Added state for Retailer ID
  const [retailerName, setRetailerName] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [terminalID, setTerminalID] = useState("");
  const [services, setServices] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggleRetailerStatus = (index: number) => {
    const updatedRetailers = [...retailers];
    updatedRetailers[index].status =
      updatedRetailers[index].status === "Active" ? "Inactive" : "Active";
    setRetailers(updatedRetailers);
  };

  const tableHeaders = [
    "Retailer ID",
    "Retailer Name",
    "Type",
    "Location",
    "Contact Person",
    "Contact Number",
    "Swiping Terminal",
    "Status",
    "Activate/Deactivate",
  ];

  const [addRetailerModalOpen, setAddRetailerModalOpen] = useState(false);

  const handleAddRetailer = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      retailerName.trim() === "" ||
      contactNumber.trim() === "" ||
      location.trim() === "" ||
      terminalID.trim() === ""
    ) {
      setError("All fields are required.");
      setSuccess(false);
      return;
    }

    const newRetailer = {
      retailerID: retailerID || generateUniqueRetailerID(), // Use existing ID or generate a new one
      retailerName,
      location,
      contactNumber,
      terminalID,
      services,
    };

    console.log("Retailer added:", newRetailer);

    setError("");
    setSuccess(true);
    setRetailerName("");
    setLocation("");
    setContactNumber("");
    setTerminalID("");
    setServices("");
    setRetailerID(""); // Reset retailer ID
  };

  const generateUniqueRetailerID = () => `RE${String(Date.now()).slice(-4)}`; // Function to generate unique Retailer ID

  const handleOpen = () => {
    console.log("Opening modal");
    !addRetailerModalOpen ? setAddRetailerModalOpen(true) : null;
  };
  const handleClose = () => {
    console.log("Closing modal");
    setAddRetailerModalOpen(false);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-row items-center justify-between">
          <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
            Retailers List
          </h2>
          <p
            className="cursor-pointer font-bold text-gray-800 dark:text-white"
            onClick={handleOpen}
          >
            Add Retailer
          </p>
        </div>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Below is the list of retailers and their current status. You can
          manage their details and monitor their activity here.
        </p>
        <div className="overflow-x-auto">
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
              {retailers.map((retailer, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  } transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <TableCell>{retailer.id}</TableCell>
                  <TableCell>{retailer.name}</TableCell>
                  <TableCell>{retailer.type}</TableCell>
                  <TableCell>{retailer.location}</TableCell>
                  <TableCell>{retailer.contactPerson}</TableCell>
                  <TableCell>{retailer.contactNumber}</TableCell>
                  <TableCell>{retailer.swipingTerminalStatus}</TableCell>
                  <TableCell>{retailer.status}</TableCell>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-800 dark:border-gray-600 dark:text-white">
                    <label className="flex items-center space-x-3">
                      <span>
                        {retailer.status === "Active" ? "Active" : "Inactive"}
                      </span>
                      <input
                        type="checkbox"
                        checked={retailer.status === "Active"}
                        onChange={() => toggleRetailerStatus(index)}
                        className="toggle-checkbox"
                      />
                      <span className="toggle-switch"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddRetailerModal
        open={addRetailerModalOpen}
        handleClose={handleClose}
        handleAddRetailer={handleAddRetailer}
        error={error}
        success={success}
        retailerID={retailerID}
        retailerName={retailerName}
        location={location}
        contactNumber={contactNumber}
        terminalID={terminalID}
        services={services}
        setRetailerName={setRetailerName}
        setLocation={setLocation}
        setContactNumber={setContactNumber}
        setTerminalID={setTerminalID}
        setServices={setServices}
        generateUniqueRetailerID={generateUniqueRetailerID}
      />
    </DefaultLayout>
  );
};

export default RetailersList;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
