"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Supplier {
  id: string;
  name: string;
  type: string;
  location: string;
  contactPerson: string;
  contactNumber: string;
  status: "Active" | "Inactive";
}

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id">>({
    name: "",
    type: "",
    location: "",
    contactPerson: "",
    contactNumber: "",
    status: "Active",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value as any });
  };

  const addSupplier = () => {
    const newSupplierData = {
      id: `SUP${suppliers.length + 1}`, // Generate unique ID
      ...newSupplier,
    };
    setSuppliers([...suppliers, newSupplierData]);
    setNewSupplier({
      name: "",
      type: "",
      location: "",
      contactPerson: "",
      contactNumber: "",
      status: "Active",
    });
  };

  const toggleSupplierStatus = (index: number) => {
    const updatedSuppliers = [...suppliers];
    updatedSuppliers[index].status =
      updatedSuppliers[index].status === "Active" ? "Inactive" : "Active";
    setSuppliers(updatedSuppliers);
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
          Supplier Management
        </h2>

        <div className="mb-6">
          <h3 className="mb-4 text-xl font-semibold">Add New Supplier</h3>
          <input
            type="text"
            name="name"
            value={newSupplier.name}
            onChange={handleInputChange}
            placeholder="Supplier Name"
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            name="type"
            value={newSupplier.type}
            onChange={handleInputChange}
            placeholder="Supplier Type"
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            name="location"
            value={newSupplier.location}
            onChange={handleInputChange}
            placeholder="Location"
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            name="contactPerson"
            value={newSupplier.contactPerson}
            onChange={handleInputChange}
            placeholder="Contact Person"
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            name="contactNumber"
            value={newSupplier.contactNumber}
            onChange={handleInputChange}
            placeholder="Contact Number"
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <select
            name="status"
            value={newSupplier.status}
            onChange={handleInputChange}
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            onClick={addSupplier}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add Supplier
          </button>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold">Supplier List</h3>
          <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Supplier ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Name
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
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Activate/Deactivate
                </th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, index) => (
                <tr
                  key={supplier.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  } transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600`}
                >
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {supplier.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {supplier.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {supplier.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {supplier.location}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {supplier.contactPerson}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {supplier.contactNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {supplier.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-800 dark:border-gray-600 dark:text-white">
                    <label className="flex items-center justify-center space-x-3">
                      <span>{supplier.status}</span>
                      <input
                        type="checkbox"
                        checked={supplier.status === "Active"}
                        onChange={() => toggleSupplierStatus(index)}
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
    </>
  );
};

export default SupplierManagement;
