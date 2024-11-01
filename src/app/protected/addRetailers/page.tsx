"use client"; // Add this at the top to make it a Client Component

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { redirect } from "next/navigation";

import React, { useState, useEffect } from "react";
import { createClient } from "utils/supabase/server";
import { checkUserSignedIn } from "@/app/actions";

const AddRetailer = () => {
  const [retailerID, setRetailerID] = useState(""); // Added state for Retailer ID
  const [retailerName, setRetailerName] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [terminalID, setTerminalID] = useState("");
  const [services, setServices] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const generateUniqueRetailerID = () => `RE${String(Date.now()).slice(-4)}`; // Function to generate unique Retailer ID

  useEffect(() => {
    const checkAuth = async () => {
      await checkUserSignedIn();
    };

    checkAuth();
  }, []);

  const handleAddRetailer = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      retailerName.trim() === "" ||
      contactNumber.trim() === "" ||
      location.trim() === "" ||
      terminalID.trim() === ""
    ) {
      setError("All fields are required.");
      setSuccess(false);
      return;
    }

    const newRetailer = {
      retailerID: retailerID || generateUniqueRetailerID(), // Use existing ID or generate a new one
      retailerName,
      location,
      contactNumber,
      terminalID,
      services,
    };

    console.log("Retailer added:", newRetailer);

    setError("");
    setSuccess(true);
    setRetailerName("");
    setLocation("");
    setContactNumber("");
    setTerminalID("");
    setServices("");
    setRetailerID(""); // Reset retailer ID
  };

  return (
    <DefaultLayout>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
            Add New Retailer
          </h2>
          <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
            Fill in the retailer's details to add them to the platform.
          </p>
          {error && <p className="mb-4 text-center text-red-500">{error}</p>}
          {success && (
            <p className="mb-4 text-center text-green-500">
              Retailer added successfully!
            </p>
          )}
          <form onSubmit={handleAddRetailer} className="space-y-6">
            <div>
              <label
                htmlFor="retailerID"
                className="mb-2 block font-semibold text-gray-700 dark:text-gray-300"
              >
                Retailer ID (auto-generated)
              </label>
              <input
                type="text"
                id="retailerID"
                value={retailerID || generateUniqueRetailerID()} // Show generated ID
                readOnly
                className="w-full rounded-lg border bg-gray-100 px-4 py-2 dark:bg-gray-700"
              />
            </div>
            <div>
              <label
                htmlFor="retailerName"
                className="mb-3 block font-semibold text-gray-700 dark:text-gray-300"
              >
                Retailer Name
              </label>
              <input
                type="text"
                id="retailerName"
                value={retailerName}
                onChange={(e) => setRetailerName(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
                placeholder="Enter retailer's name"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="mb-2 block font-semibold text-gray-700 dark:text-gray-300"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
                placeholder="Enter retailer's location"
              />
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="mb-2 block font-semibold text-gray-700 dark:text-gray-300"
              >
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
                placeholder="Enter contact number"
              />
            </div>
            <div>
              <label
                htmlFor="terminalID"
                className="mb-2 block font-semibold text-gray-700 dark:text-gray-300"
              >
                Terminal ID
              </label>
              <input
                type="text"
                id="terminalID"
                value={terminalID}
                onChange={(e) => setTerminalID(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
                placeholder="Enter terminal ID"
              />
            </div>
            <div>
              <label
                htmlFor="services"
                className="mb-2 block font-semibold text-gray-700 dark:text-gray-300"
              >
                Services Offered
              </label>
              <textarea
                id="services"
                value={services}
                onChange={(e) => setServices(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 dark:bg-gray-700"
                placeholder="Enter details of services offered"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700"
            >
              Add Retailer
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddRetailer;
