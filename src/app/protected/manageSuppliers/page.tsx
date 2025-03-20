"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import SupplierTable from "./components/suppliers/SupplierTable";
import { Supplier } from "../../types/supplier";
import { getSuppliersAction } from "../manageComissionGroups/actions";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    type: "",
    location: "",
    contactPerson: "",
    contactNumber: "",
    status: "active",
  });

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const { suppliers: fetchedSuppliers, error } = await getSuppliersAction();

      if (error) {
        console.error("Error fetching suppliers:", error);
        setSuppliers([]);
      } else {
        setSuppliers(fetchedSuppliers || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching suppliers:", error);
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change for new supplier form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  // Add new supplier
  const addSupplier = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate adding to the local state
      const newSupplierData: Supplier = {
        id: `SUP${suppliers.length + 1}`,
        name: newSupplier.name,
        status: newSupplier.status as "active" | "inactive",
        voucherCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSuppliers([...suppliers, newSupplierData]);

      // Reset form
      setNewSupplier({
        name: "",
        type: "",
        location: "",
        contactPerson: "",
        contactNumber: "",
        status: "active",
      });
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        Supplier Management
      </h2>

      {/* Supplier List with Enhanced Features */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold">Supplier List</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <SupplierTable suppliers={suppliers} onRefresh={fetchSuppliers} />
        )}
      </div>
    </div>
  );
};

export default SupplierManagement;
