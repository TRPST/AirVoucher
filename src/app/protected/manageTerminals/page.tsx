"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

interface Terminal {
  id: string;
  retailerId: string;
  terminalName: string;
  status: "Active" | "Inactive";
}

const TerminalManagement = () => {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [newTerminal, setNewTerminal] = useState<Omit<Terminal, "id">>({
    retailerId: "",
    terminalName: "",
    status: "Active",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewTerminal({ ...newTerminal, [name]: value as any });
  };

  const addTerminal = () => {
    const newTerminalData = {
      id: `TER${terminals.length + 1}`, // Generate unique ID
      ...newTerminal,
    };
    setTerminals([...terminals, newTerminalData]);
    setNewTerminal({
      retailerId: "",
      terminalName: "",
      status: "Active",
    });
  };

  const toggleTerminalStatus = (index: number) => {
    const updatedTerminals = [...terminals];
    updatedTerminals[index].status =
      updatedTerminals[index].status === "Active" ? "Inactive" : "Active";
    setTerminals(updatedTerminals);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
          Terminal Management
        </h2>

        <div className="mb-6">
          <h3 className="mb-4 text-xl font-semibold">Register New Terminal</h3>
          <input
            type="text"
            name="retailerId"
            value={newTerminal.retailerId}
            onChange={handleInputChange}
            placeholder="Retailer ID"
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            name="terminalName"
            value={newTerminal.terminalName}
            onChange={handleInputChange}
            placeholder="Terminal Name"
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <select
            name="status"
            value={newTerminal.status}
            onChange={handleInputChange}
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            onClick={addTerminal}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Register Terminal
          </button>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold">Terminal List</h3>
          <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Terminal ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Retailer ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Terminal Name
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
              {terminals.map((terminal, index) => (
                <tr
                  key={terminal.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  } transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600`}
                >
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {terminal.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {terminal.retailerId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {terminal.terminalName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {terminal.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-800 dark:border-gray-600 dark:text-white">
                    <label className="flex items-center justify-center space-x-3">
                      <span>{terminal.status}</span>
                      <input
                        type="checkbox"
                        checked={terminal.status === "Active"}
                        onChange={() => toggleTerminalStatus(index)}
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

export default TerminalManagement;
