"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useState } from "react";

const RetailersAuthorizations = () => {
  const [authorizations, setAuthorizations] = useState([
    {
      retailer: "Retailer 1",
      authorized: true,
      requestStatus: "Pending",
      terminalAccess: true,
      id: "ARV001T",
    },
    {
      retailer: "Retailer 2",
      authorized: false,
      requestStatus: "Approved",
      terminalAccess: false,
      id: "ARV002T",
    },
  ]);

  // Function to toggle authorization status
  const toggleAuthorization = (index: number) => {
    const updatedAuthorizations = [...authorizations];
    updatedAuthorizations[index].authorized =
      !updatedAuthorizations[index].authorized;
    setAuthorizations(updatedAuthorizations);
  };

  // Function to approve or reject service activations
  const handleRequestStatus = (index: number, status: string) => {
    const updatedAuthorizations = [...authorizations];
    updatedAuthorizations[index].requestStatus = status;
    setAuthorizations(updatedAuthorizations);
  };

  // Function to toggle terminal access
  const toggleTerminalAccess = (index: number) => {
    const updatedAuthorizations = [...authorizations];
    updatedAuthorizations[index].terminalAccess =
      !updatedAuthorizations[index].terminalAccess;
    setAuthorizations(updatedAuthorizations);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
          Retailer Authorizations
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Monitor and manage system-wide access controls for each retailer. You
          can approve or reject supplier service activations requested by
          sub-admins and control terminal access.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse whitespace-nowrap rounded-lg bg-white shadow-md dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Retailer Name
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Unique ID
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Authorized
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Request Status
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Terminal Access
                </th>
                <th className="whitespace-nowrap border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {authorizations.map((authorization, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  } transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {authorization.retailer}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {authorization.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {authorization.authorized ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {authorization.requestStatus}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {authorization.terminalAccess ? "Enabled" : "Disabled"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleAuthorization(index)}
                        className={`rounded-lg px-3 py-1 font-semibold text-white ${
                          authorization.authorized
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        } transition-colors duration-300`}
                      >
                        {authorization.authorized ? "Revoke" : "Authorize"}
                      </button>
                      <button
                        onClick={() => handleRequestStatus(index, "Approved")}
                        className="rounded-lg bg-blue-600 px-3 py-1 font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequestStatus(index, "Rejected")}
                        className="rounded-lg bg-yellow-600 px-3 py-1 font-semibold text-white transition-colors duration-300 hover:bg-yellow-700"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => toggleTerminalAccess(index)}
                        className={`rounded-lg px-3 py-1 font-semibold ${
                          authorization.terminalAccess
                            ? "bg-gray-600 text-white hover:bg-gray-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        } transition-colors duration-300`}
                      >
                        {authorization.terminalAccess
                          ? "Deactivate Terminal"
                          : "Activate Terminal"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RetailersAuthorizations;
