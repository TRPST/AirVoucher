"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { IconButton } from "@mui/material";
import WestIcon from "@mui/icons-material/West";

const TerminalDashboard = () => {
  const { terminalId } = useParams(); // Terminal ID from URL
  const router = useRouter();

  // Navigate back to Terminal Management
  const navigateToTerminalManagement = () => {
    router.push("/protected/manageTerminals");
  };

  // Navigate to a specific service features page
  const navigateToFeatures = (service) => {
    router.push(`/protected/manageTerminals/${terminalId}/${service}`);
  };

  // Navigate to the Sales Analytics page
  const navigateToSalesAnalytics = () => {
    router.push(`/protected/manageTerminals/`);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        {/* Header with Sales Analytics Button */}
        <div className="mb-6 flex items-center justify-between">
          <IconButton
            color="primary"
            className="text-grey dark:text-grey hover:text-black dark:hover:text-white"
            sx={{
              fontSize: 30,
              color: "grey",
            }}
            onClick={() => {
              navigateToTerminalManagement();
            }}
          >
            <WestIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <h1 className="text-3xl font-bold">
            Terminal Dashboard - {terminalId}
          </h1>
          <button
            onClick={() => navigateToFeatures("sales_analytics")}
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
          >
            Sales Analytics
          </button>
        </div>

        {/* Service Placeholders */}
        <div className="grid grid-cols-3 gap-6">
          {/* OTT Service */}
          <div
            className="cursor-pointer rounded-lg border p-4 text-center shadow transition-transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigateToFeatures("ott_services")}
          >
            <img
              src="/images/ott_logo.png"
              alt="OTT Service"
              className="mx-auto h-20 w-auto"
            />
            <p className="mt-2 text-lg font-semibold text-blue-600">
              OTT Services
            </p>
          </div>

          {/* Glocell Service */}
          <div
            className="cursor-pointer rounded-lg border p-4 text-center shadow transition-transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigateToFeatures("glocell_mobile_airtime_api")}
          >
            <img
              src="/images/glocell.png"
              alt="Glocell Service"
              className="mx-auto h-20 w-auto"
            />
            <p className="mt-2 text-lg font-semibold text-blue-600">
              Glocell Services
            </p>
          </div>

          {/* Airtime Service */}
          <div
            className="cursor-pointer rounded-lg border p-4 text-center shadow transition-transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigateToFeatures("serviceB")}
          >
            <img
              src="/images/airtime.jpg"
              alt="Airtime Service"
              className="mx-auto h-20 w-auto"
            />
            <p className="mt-2 text-lg font-semibold text-blue-600">
              Airtime Services
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TerminalDashboard;
