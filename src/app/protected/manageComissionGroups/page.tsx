"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

interface CommissionGroup {
  id: string;
  name: string;
  fixedCommission: number;
  percentageCommission: number;
  supplierPriorities: string[];
}

const CommissionManagement = () => {
  const [commissionGroups, setCommissionGroups] = useState<CommissionGroup[]>(
    [],
  );
  const [newGroup, setNewGroup] = useState({
    name: "",
    fixedCommission: 0,
    percentageCommission: 0,
    supplierPriorities: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  const handleSupplierPriorityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setNewGroup((prev) => ({
      ...prev,
      supplierPriorities: prev.supplierPriorities.includes(value)
        ? prev.supplierPriorities.filter((s) => s !== value)
        : [...prev.supplierPriorities, value],
    }));
  };

  const addCommissionGroup = () => {
    const newCommissionGroup = {
      id: `CMG${commissionGroups.length + 1}`,
      ...newGroup,
    };
    setCommissionGroups([...commissionGroups, newCommissionGroup]);
    setNewGroup({
      name: "",
      fixedCommission: 0,
      percentageCommission: 0,
      supplierPriorities: [],
    });
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
          Commission Management
        </h2>

        <div className="mb-6">
          <h3 className="mb-4 text-xl font-semibold">
            Create Commission Group
          </h3>
          <input
            type="text"
            name="name"
            value={newGroup.name}
            onChange={handleInputChange}
            placeholder="Commission Group Name"
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="number"
            name="fixedCommission"
            value={newGroup.fixedCommission}
            onChange={handleInputChange}
            placeholder="Fixed Commission"
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="number"
            name="percentageCommission"
            value={newGroup.percentageCommission}
            onChange={handleInputChange}
            placeholder="Percentage Commission"
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <div className="mb-4">
            <h4 className="font-semibold">Supplier Priorities</h4>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value="Supplier A"
                onChange={handleSupplierPriorityChange}
                className="mr-2"
              />
              Supplier A
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value="Supplier B"
                onChange={handleSupplierPriorityChange}
                className="mr-2"
              />
              Supplier B
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value="Supplier C"
                onChange={handleSupplierPriorityChange}
                className="mr-2"
              />
              Supplier C
            </label>
          </div>
          <button
            onClick={addCommissionGroup}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add Commission Group
          </button>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold">Commission Groups</h3>
          <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Group ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Fixed Commission
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Percentage Commission
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Supplier Priorities
                </th>
              </tr>
            </thead>
            <tbody>
              {commissionGroups.map((group) => (
                <tr
                  key={group.id}
                  className="bg-gray-50 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {group.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {group.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {group.fixedCommission}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {group.percentageCommission}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {group.supplierPriorities.join(", ")}
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

export default CommissionManagement;
