"use client";

import { Admin } from "@/app/types/common";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import { signUpAction, signUpAdminAction } from "@/app/actions";
import { Spinner } from "@nextui-org/spinner";
//import {Spinner } from "mui-spinner";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [retailers, setRetailers] = useState<string[]>([
    "Retailer1",
    "Retailer2",
    "Retailer3",
  ]);
  const [newAdmin, setNewAdmin] = useState<Admin>({
    id: "",
    name: "",
    email: "",
    password: "",
    active: true,
    role: "admin",
    terminal_access: false,
    assigned_retailers: [],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSuccess("");
    setError("");
  }, [
    newAdmin.name,
    newAdmin.email,
    newAdmin.password,
    newAdmin.active,
    newAdmin.role,
    newAdmin.terminal_access,
  ]);

  const generateUniqueID = () => `AD${String(Date.now()).slice(-4)}`;

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdmin.name || !newAdmin.email) {
      setError("Both name and email are required.");
      setSuccess("");
      return;
    }

    const admin: Admin = {
      id: generateUniqueID(),
      name: newAdmin.name,
      email: newAdmin.email,
      password: newAdmin.password,
      active: true,
      role: newAdmin.role,
      terminal_access: false,
      assigned_retailers: [],
    };

    try {
      setLoading(true);
      const result = await signUpAdminAction(admin);
      console.log("Result: ", result);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Admin created successfully!");
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

  return (
    <DefaultLayout>
      <div className="flex justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
            Add New Admin
          </h2>
          <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
            Fill in the retailer&apos;s details to add them to the platform.
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
              <p className="mb-4 text-center text-red-500">{error}</p>
            ) : success ? (
              <p className="mb-4 text-center text-green-500">
                Admin added successfully!
              </p>
            ) : (
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Create Admin
              </button>
            )}
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ManageAdmins;
