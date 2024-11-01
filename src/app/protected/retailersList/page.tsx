"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useState } from "react";

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

  const toggleRetailerStatus = (index: number) => {
    const updatedRetailers = [...retailers];
    updatedRetailers[index].status =
      updatedRetailers[index].status === "Active" ? "Inactive" : "Active";
    setRetailers(updatedRetailers);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
          Retailers List
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Below is the list of retailers and their current status. You can
          manage their details and monitor their activity here.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Retailer ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Retailer Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Type
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Location
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Contact Person
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Contact Number
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Swiping Terminal
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Activate/Deactivate
                </th>
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
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {retailer.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {retailer.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {retailer.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {retailer.location}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {retailer.contactPerson}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {retailer.contactNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {retailer.swipingTerminalStatus}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {retailer.status}
                  </td>
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
    </DefaultLayout>
  );
};

export default RetailersList;
