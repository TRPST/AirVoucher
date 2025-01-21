"use client";

import {
  deleteAdminAction,
  editAdminAction,
  getAdminsAction,
  signUpAdminAction,
} from "./actions";
import { User } from "@/app/types/common";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import TableCell from "../../../components/Tables/TableCell";
import { Button } from "@mui/material";
import AddAdminModal from "./AddAdminModal";
import EditAdminModal from "./EditAdminModal";
import { getUserAction } from "@/app/actions";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  // const [retailers, setAdmins] = useState<string[]>([
  //   "Admin1",
  //   "Admin2",
  //   "Admin3",
  // ]);
  const [newAdmin, setNewAdmin] = useState<User>({
    id: "",
    name: "",
    email: "",
    contact_number: "",
    password: "",
    active: true,
    role: "admin",
    terminal_access: false,
    assigned_retailers: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [confirmDeleteAdmin, setConfirmDeleteAdmin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const [editAdminModalOpen, setEditAdminModalOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState<User | null>(null);
  const [updatedAdmin, setUpdatedAdmin] = useState<User | null>(null);

  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = await getUserAction();
      //console.log("User: ", user);
      if (user) {
        setUserRole(user?.role || "");
      }
    };
    fetchUserRole();
  }, []);

  const fetchAdmins = async (doLoad: boolean) => {
    if (doLoad) setLoading(true);
    const { users, error } = await getAdminsAction();
    console.log("Users: ", users);
    if (error) {
      console.error(error);
    } else {
      if (users) {
        setAdmins(users);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins(true);
  }, []);

  useEffect(() => {
    if (success !== "") fetchAdmins(false);
    if (editSuccess !== "") fetchAdmins(false);
  }, [success, editSuccess]);

  useEffect(() => {
    setSuccess("");
    setError("");

    setEditSuccess("");
    setEditError("");
  }, [newAdmin, updatedAdmin]);

  const generateUniqueID = () => `AD${String(Date.now()).slice(-4)}`;

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdmin.name || !newAdmin.email) {
      setError("Both name and email are required.");
      setSuccess("");
      return;
    }

    const admin: User = {
      id: generateUniqueID(),
      name: newAdmin.name,
      email: newAdmin.email,
      contact_number: newAdmin.contact_number,
      password: newAdmin.password,
      active: newAdmin.active,
      role: newAdmin.role,
      terminal_access: newAdmin.terminal_access,
      assigned_retailers: newAdmin.assigned_retailers,
    };

    try {
      setLoading(true);
      const result = await signUpAdminAction(admin);
      console.log("Result: ", result);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSecurePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const handleEditOpen = (admin: User) => {
    setUpdatedAdmin(admin);
    setEditAdminModalOpen(true);
  };

  const handleClose = () => {
    setAddAdminModalOpen(false);
    setNewAdmin({
      id: "",
      name: "",
      email: "",
      contact_number: "",
      password: "",
      active: true,
      role: "admin",
      terminal_access: false,
      assigned_retailers: [],
    });

    setError("");
    setSuccess("");
  };

  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedAdmin) return;
    if (
      updatedAdmin.name.trim() === "" ||
      updatedAdmin.contact_number?.trim() === "" ||
      updatedAdmin.email.trim() === ""
    ) {
      setEditError("All fields are required.");
      return;
    }
    try {
      setEditLoading(true);
      const result = await editAdminAction(updatedAdmin);
      console.log("Result: ", result);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess(result.success || "");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditAdminRetailers = async (updatedAdminRetailers: User) => {
    if (!updatedAdminRetailers) return;
    try {
      setEditLoading(true);
      const result = await editAdminAction(updatedAdminRetailers);
      console.log("Result: ", result);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess(result.success || "");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  //function to handle delete retailer
  const handleDeleteAdmin = async (id: string) => {
    try {
      setEditLoading(true);
      const result = await deleteAdminAction(id);
      console.log("Result: ", result);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess(result.success || "");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditClose = () => {
    setEditAdminModalOpen(false);
    setUpdatedAdmin({
      id: "",
      name: "",
      email: "",
      contact_number: "",
      password: "",
      active: true,
      role: "admin",
      terminal_access: false,
      assigned_retailers: [],
    });

    setEditError("");
    setEditSuccess("");
    setConfirmDeleteAdmin(false);
  };

  const tableHeaders =
    userRole === "superAdmin"
      ? [
          "Name",
          "Email",
          "Contact Number",
          "Terminal Access",
          "Active",
          "Retailers",
          "",
        ]
      : [
          "Name",
          "Email",
          "Contact Number",
          "Terminal Access",
          "Active",
          "Retailers",
        ];

  const generateUniqueAdminID = () => `AD${String(Date.now()).slice(-4)}`;

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Manage Admins
          </h2>
          {/* <Button variant="outlined" onClick={() => setAddAdminModalOpen(true)}>
            Add Admin
          </Button> */}
          {userRole === "superAdmin" && (
            <button
              onClick={() => setAddAdminModalOpen(true)}
              className="rounded border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700"
            >
              Add Admin
            </button>
          )}
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : admins.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No sub-admins available. Please create one.
            </p>
          ) : (
            <>
              <p className="font-bold text-gray-800 dark:text-white">
                Super Admins
              </p>
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {tableHeaders.map((header) => (
                        <th
                          key={header}
                          className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600"
                          style={{ width: "15%" }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {admins
                      .filter((admin) => admin.role === "superAdmin")
                      .map((admin, index) => (
                        <tr
                          key={index}
                          className=" bg-white transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <TableCell>{admin.name}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>{admin.contact_number}</TableCell>
                          <TableCell>
                            {admin.terminal_access ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>{admin.active ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            {admin.assigned_retailers?.length}
                          </TableCell>
                          {userRole === "superAdmin" && (
                            <TableCell>
                              <p
                                className="cursor-pointer underline"
                                onClick={() => handleEditOpen(admin)}
                              >
                                Edit
                              </p>
                            </TableCell>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-10 overflow-x-auto">
                <p className="cursor-pointer font-bold text-gray-800 dark:text-white">
                  Sub Admins
                </p>
                <table className="mt-5 min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {tableHeaders.map((header) => (
                        <th
                          key={header}
                          className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600"
                          style={{ width: "15%" }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {admins
                      .filter((admin) => admin.role === "admin")
                      .map((admin, index) => (
                        <tr
                          key={index}
                          className=" bg-white transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <TableCell>{admin.name}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>{admin.contact_number}</TableCell>
                          <TableCell>
                            {admin.terminal_access ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>{admin.active ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            {admin.assigned_retailers?.length}
                          </TableCell>
                          {userRole === "superAdmin" && (
                            <TableCell>
                              <p
                                className="cursor-pointer underline"
                                onClick={() => handleEditOpen(admin)}
                              >
                                Edit
                              </p>
                            </TableCell>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <AddAdminModal
        open={addAdminModalOpen}
        handleClose={handleClose}
        handleCreateAdmin={handleCreateAdmin}
        newAdmin={newAdmin}
        setNewAdmin={setNewAdmin}
        error={error}
        success={success}
        loading={loading}
        setLoading={setLoading}
        generateUniqueAdminID={generateUniqueAdminID}
        generateSecurePassword={generateSecurePassword}
      />
      {updatedAdmin && (
        <EditAdminModal
          open={editAdminModalOpen}
          handleClose={handleEditClose}
          handleEditAdmin={handleEditAdmin}
          handleEditAdminRetailers={handleEditAdminRetailers}
          handleDeleteAdmin={(id: string) => handleDeleteAdmin(id)}
          confirmDeleteAdmin={confirmDeleteAdmin}
          setConfirmDeleteAdmin={setConfirmDeleteAdmin}
          updatedAdmin={updatedAdmin}
          setUpdatedAdmin={setUpdatedAdmin}
          editError={editError}
          editSuccess={editSuccess}
          editLoading={editLoading}
          setEditLoading={setEditLoading}
          generateUniqueAdminID={generateUniqueAdminID}
          generateSecurePassword={generateSecurePassword}
        />
      )}
    </>
  );
};

export default ManageAdmins;
