"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TableCell from "./TableCell";
import AddRetailerModal from "./AddRetailerModal";
import { Retailer } from "@/app/types/common";
import {
  deleteRetailerAction,
  editRetailerAction,
  getRetailersAction,
  signUpRetailerAction,
} from "./actions";
import EditRetailerModal from "./EditRetailerModal";

const RetailersList = () => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [addRetailerModalOpen, setAddRetailerModalOpen] = useState(false);
  const generateUniqueRetailerID = () => `RE${String(Date.now()).slice(-4)}`; // Function to generate unique Retailer ID
  const [newRetailer, setNewRetailer] = useState<Retailer>({
    id: generateUniqueRetailerID(),
    name: "",
    email: "",
    password: "",
    contact_person: "",
    contact_number: "",
    location: "",
    active: true,
    terminal_access: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingRetailers, setFetchingRetailers] = useState(false);

  const [editRetailerModalOpen, setEditRetailerModalOpen] = useState(false);
  const [updatedRetailer, setUpdatedRetailer] = useState<Retailer | null>(null);

  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [confirmDeleteRetailer, setConfirmDeleteRetailer] = useState(false);

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

  useEffect(() => {
    fetchRetailers(true);
  }, []);

  useEffect(() => {
    if (success !== "") fetchRetailers(false);
    if (editSuccess !== "") fetchRetailers(false);
    //fetchRetailers();
  }, [success, editSuccess]);

  const handleAddRetailer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newRetailer.name.trim() === "" ||
      newRetailer.contact_person.trim() === "" ||
      newRetailer.contact_number.trim() === "" ||
      newRetailer.location.trim() === ""
    ) {
      setError("All fields are required.");
      return;
    }
    try {
      setLoading(true);
      const result = await signUpRetailerAction(newRetailer);
      console.log("Result: ", result);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Retailer created successfully!");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRetailer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedRetailer) return;
    if (
      updatedRetailer.name.trim() === "" ||
      updatedRetailer.contact_person.trim() === "" ||
      updatedRetailer.contact_number.trim() === "" ||
      updatedRetailer.location.trim() === ""
    ) {
      setEditError("All fields are required.");
      return;
    }
    try {
      setEditLoading(true);
      const result = await editRetailerAction(updatedRetailer);
      console.log("Result: ", result);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess("Retailer updated successfully!");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  //function to handle delete retailer
  const handleDeleteRetailer = async (id: string) => {
    try {
      setEditLoading(true);
      const result = await deleteRetailerAction(id);
      console.log("Result: ", result);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess("Retailer deleted successfully!");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [newRetailer]);

  useEffect(() => {
    setEditError("");
    setEditSuccess("");
  }, [updatedRetailer]);

  const handleOpen = () => {
    setAddRetailerModalOpen(true);
  };

  const handleEditOpen = (retailer: Retailer) => {
    setUpdatedRetailer(retailer);
    setEditRetailerModalOpen(true);
  };

  const handleClose = () => {
    setAddRetailerModalOpen(false);
    setNewRetailer({
      id: generateUniqueRetailerID(),
      name: "",
      email: "",
      password: "",
      contact_person: "",
      contact_number: "",
      location: "",
      active: true,
      terminal_access: true,
    });

    setError("");
    //if (success != "") fetchRetailers();
    setSuccess("");
  };

  const handleEditClose = () => {
    setEditRetailerModalOpen(false);
    setUpdatedRetailer({
      id: generateUniqueRetailerID(),
      name: "",
      email: "",
      password: "",
      contact_person: "",
      contact_number: "",
      location: "",
      active: true,
      terminal_access: true,
    });

    setEditError("");
    //if (editSuccess != "") fetchRetailers();
    setEditSuccess("");
    setConfirmDeleteRetailer(false);
  };

  const generateSecurePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setNewRetailer((prev) => ({ ...prev, password }));
  };

  const tableHeaders = [
    "Retailer ID",
    "Retailer Name",
    "Location",
    "Contact Person",
    "Contact Number",
    "Active",
    "Action",
  ];

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

        {fetchingRetailers ? (
          <div className="mt-10 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : (
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
                    <TableCell>{retailer.location}</TableCell>
                    <TableCell>{retailer.contact_person}</TableCell>
                    <TableCell>{retailer.contact_number}</TableCell>
                    <td className="border border-gray-300 px-4 py-2 text-center text-gray-800 dark:border-gray-600 dark:text-white">
                      <label className="flex items-center space-x-3">
                        <span>{retailer.active ? "Active" : "Inactive"}</span>
                        <span className="toggle-switch"></span>
                      </label>
                    </td>
                    <TableCell>
                      <p
                        style={{ cursor: "pointer", fontWeight: "bold" }}
                        onClick={() => handleEditOpen(retailer)}
                      >
                        Edit
                      </p>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddRetailerModal
        open={addRetailerModalOpen}
        handleClose={handleClose}
        handleAddRetailer={handleAddRetailer}
        newRetailer={newRetailer}
        setNewRetailer={setNewRetailer}
        error={error}
        success={success}
        loading={loading}
        setLoading={setLoading}
        generateUniqueRetailerID={generateUniqueRetailerID}
        generateSecurePassword={generateSecurePassword}
      />
      {updatedRetailer && (
        <EditRetailerModal
          open={editRetailerModalOpen}
          handleClose={handleEditClose}
          handleEditRetailer={handleEditRetailer}
          handleDeleteRetailer={(id: string) => handleDeleteRetailer(id)}
          confirmDeleteRetailer={confirmDeleteRetailer}
          setConfirmDeleteRetailer={setConfirmDeleteRetailer}
          updatedRetailer={updatedRetailer}
          setUpdatedRetailer={setUpdatedRetailer}
          editError={editError}
          editSuccess={editSuccess}
          editLoading={editLoading}
          setEditLoading={setEditLoading}
          generateUniqueRetailerID={generateUniqueRetailerID}
          generateSecurePassword={generateSecurePassword}
        />
      )}
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
