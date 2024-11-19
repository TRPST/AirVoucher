"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useState } from "react";

const ManageSubAdmins = () => {
  const [subAdmins, setSubAdmins] = useState<
    {
      id: string;
      name: string;
      email: string;
      active: boolean;
      terminalAccess: boolean;
      assignedRetailers: string[];
    }[]
  >([]);
  const [retailers, setRetailers] = useState<string[]>([
    "Retailer1",
    "Retailer2",
    "Retailer3",
  ]);
  const [newSubAdmin, setNewSubAdmin] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const generateUniqueID = () => `AD${String(Date.now()).slice(-4)}`;

  const handleCreateSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSubAdmin.name || !newSubAdmin.email) {
      setError("Both name and email are required.");
      setSuccess("");
      return;
    }

    const newAdmin = {
      id: generateUniqueID(),
      name: newSubAdmin.name,
      email: newSubAdmin.email,
      active: true,
      terminalAccess: false,
      assignedRetailers: [],
    };

    setSubAdmins([...subAdmins, newAdmin]);
    setNewSubAdmin({ name: "", email: "" });
    setError("");
    setSuccess("Sub-admin created successfully!");
  };

  const toggleActiveStatus = (id: string) => {
    setSubAdmins(
      subAdmins.map((admin) =>
        admin.id === id ? { ...admin, active: !admin.active } : admin,
      ),
    );
  };

  const toggleTerminalAccess = (id: string) => {
    setSubAdmins(
      subAdmins.map((admin) =>
        admin.id === id
          ? { ...admin, terminalAccess: !admin.terminalAccess }
          : admin,
      ),
    );
  };

  const handleAssignRetailer = (subAdminId: string, retailer: string) => {
    setSubAdmins(
      subAdmins.map((admin) =>
        admin.id === subAdminId && !admin.assignedRetailers.includes(retailer)
          ? {
              ...admin,
              assignedRetailers: [...admin.assignedRetailers, retailer],
            }
          : admin,
      ),
    );
  };

  const handleDeassignRetailer = (subAdminId: string, retailer: string) => {
    setSubAdmins(
      subAdmins.map((admin) =>
        admin.id === subAdminId
          ? {
              ...admin,
              assignedRetailers: admin.assignedRetailers.filter(
                (r) => r !== retailer,
              ),
            }
          : admin,
      ),
    );
  };

  const handleRemoveSubAdmin = (id: string) => {
    setSubAdmins(subAdmins.filter((admin) => admin.id !== id));
  };

  return (
    <DefaultLayout>
      <div className="flex justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
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
          <form
            onSubmit={handleCreateSubAdmin}
            className="flex flex-col space-y-4"
          >
            <input
              type="text"
              placeholder="Name"
              value={newSubAdmin.name}
              onChange={(e) =>
                setNewSubAdmin({ ...newSubAdmin, name: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={newSubAdmin.email}
              onChange={(e) =>
                setNewSubAdmin({ ...newSubAdmin, email: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Create Admin
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ManageSubAdmins;
