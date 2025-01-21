import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

import React from "react";

const RetailersStatus = () => {
  const retailers = [
    { name: "Retailer 1", status: "Active" },
    { name: "Retailer 2", status: "Inactive" },
    // Sample data, or fetch real data here
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <h2 className="mb-4 text-2xl font-bold">Retailers Status</h2>
        <ul>
          {retailers.map((retailer, index) => (
            <li key={index} className="mb-2">
              {retailer.name}: {retailer.status}
            </li>
          ))}
        </ul>
      </div>
    </DefaultLayout>
  );
};

export default RetailersStatus;
