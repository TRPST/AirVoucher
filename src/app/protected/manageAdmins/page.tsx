"use client";

import { getAdminsAction } from "@/app/actions";
import { Admin } from "@/app/types/common";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [retailers, setRetailers] = useState<string[]>([
    "Retailer1",
    "Retailer2",
    "Retailer3",
  ]);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      const { users, error } = await getAdminsAction();
      if (error) {
        console.error(error);
      } else {
        if (users) {
          setAdmins(users);
        }
      }
    };

    fetchAdmins();
  }, []);

  const toggleActiveStatus = (id: string) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === id ? { ...admin, active: !admin.active } : admin,
      ),
    );
  };

  const toggleTerminalAccess = (id: string) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === id
          ? { ...admin, terminalAccess: !admin.terminalAccess }
          : admin,
      ),
    );
  };

  const handleAssignRetailer = (adminId: string, retailer: string) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === adminId && !admin.assignedRetailers?.includes(retailer)
          ? {
              ...admin,
              assignedRetailers: [...(admin.assignedRetailers || []), retailer],
            }
          : admin,
      ),
    );
  };

  const handleDeassignRetailer = (adminId: string, retailer: string) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === adminId
          ? {
              ...admin,
              assignedRetailers: admin.assignedRetailers?.filter(
                (r) => r !== retailer,
              ),
            }
          : admin,
      ),
    );
  };

  const handleRemoveAdmin = (id: string) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto py-8">
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
          Manage Sub-Admins
        </h2>

        <div>
          <h3 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
            Sub-Admins List
          </h3>
          {admins.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No sub-admins available. Please create one.
            </p>
          ) : (
            admins.map((admin) => (
              <div
                key={admin.id}
                className="mb-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {admin.name} (ID: {admin.id})
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {admin.email}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => toggleActiveStatus(admin.id)}
                      className={`rounded-lg px-4 py-2 ${
                        admin.active ? "bg-red-500" : "bg-green-500"
                      } text-white`}
                    >
                      {admin.active ? "Deactivate" : "Activate"}
                    </button>
                    {/* <button
                      onClick={() => toggleTerminalAccess(admin.id)}
                      className={`rounded-lg px-4 py-2 ${
                        admin.terminalAccess ? "bg-yellow-500" : "bg-blue-500"
                      } text-white`}
                    >
                      {admin.terminalAccess
                        ? "Deactivate Terminal"
                        : "Activate Terminal"}
                    </button> */}
                    <button
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="rounded-lg bg-gray-500 px-4 py-2 text-white transition duration-300 hover:bg-gray-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <h5 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                  Assigned Retailers
                </h5>
                <div className="flex flex-wrap space-x-2">
                  {admin.assignedRetailers?.map((retailer) => (
                    <div
                      key={retailer}
                      className="rounded-lg bg-gray-200 px-4 py-1 text-gray-900 dark:bg-gray-700 dark:text-white"
                    >
                      {retailer}
                      <button
                        onClick={() =>
                          handleDeassignRetailer(admin.id, retailer)
                        }
                        className="ml-2 text-red-500"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>

                <h5 className="mb-2 mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                  Assign Retailer
                </h5>
                <select
                  onChange={(e) =>
                    handleAssignRetailer(admin.id, e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                  value=""
                >
                  <option value="" disabled>
                    Select retailer
                  </option>
                  {retailers
                    .filter((r) => !admin.assignedRetailers?.includes(r))
                    .map((retailer) => (
                      <option key={retailer} value={retailer}>
                        {retailer}
                      </option>
                    ))}
                </select>
              </div>
            ))
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ManageAdmins;
