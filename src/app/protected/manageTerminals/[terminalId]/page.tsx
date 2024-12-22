// "use client";

// import React from "react";
// import { useParams } from "next/navigation";

// const TerminalDashboard = () => {
//   const { terminalId } = useParams();

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold">Terminal Dashboard</h1>
//       <p className="text-gray-700">Terminal ID: {terminalId}</p>
//     </div>
//   );
// };

// export default TerminalDashboard;

"use client";

import React from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

const TerminalDashboard = () => {
  const { terminalId } = useParams(); // Terminal ID from URL
  const router = useRouter();
  const currentPath = usePathname();
  // Navigate to a specific service features page
  const navigateToFeatures = (service: string) => {
    router.push(`${currentPath}/${service}`);
  };

  // Navigate to the Sales Analytics page
  const navigateToSalesAnalytics = () => {
    router.push(`/sales-analytics?terminalId=${terminalId}`);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header with Sales Analytics Button */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Terminal Dashboard - {terminalId}
        </h1>
        <button
          onClick={navigateToSalesAnalytics}
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
            className="mx-auto h-24 w-24 object-contain"
          />
          <p className="mt-2 text-lg font-semibold text-blue-600">
            OTT Services
          </p>
        </div>

        {/* Glocell Service */}
        <div
          className="cursor-pointer rounded-lg border p-4 text-center shadow transition-transform hover:scale-105 hover:shadow-lg"
          onClick={() => navigateToFeatures("serviceA")}
        >
          <img
            src="/images/glocell.png"
            alt="Glocell Service"
            className="mx-auto h-24 w-24 object-contain"
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
            className="mx-auto h-24 w-24 object-contain"
          />
          <p className="mt-2 text-lg font-semibold text-blue-600">
            Airtime Services
          </p>
        </div>
      </div>
    </div>
  );
};

export default TerminalDashboard;
