import React, { useState } from "react";
import { Retailer } from "@/app/types/common";
import TerminalsModal from "./TerminalsModal";
import { Button } from "@/components/ui/button";

interface RetailersTableProps {
  retailers?: Retailer[];
}

const RetailersTable: React.FC<RetailersTableProps> = ({ retailers }) => {
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenTerminals = (retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setIsModalOpen(true);
  };

  const handleCloseTerminals = () => {
    setIsModalOpen(false);
    setSelectedRetailer(null);
  };

  return (
    <div className="min-w-full">
      <table className="w-full table-auto border-collapse bg-white shadow-md dark:bg-gray-800">
        <thead>
          <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
              Retailer ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
              Retailer Name
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
              Assigned Admin
            </th>
            {/* <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
              Terminal Access
            </th> */}
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
              Active
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
              Terminals
            </th>
          </tr>
        </thead>
        <tbody>
          {retailers?.map((retailer) => (
            <tr
              key={retailer.id}
              className="bg-white transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:text-white">
                {retailer.id}
              </td>
              <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:text-white">
                {retailer.name}
              </td>
              <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:text-white">
                {retailer.location}
              </td>
              <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:text-white">
                {retailer.contact_person}
              </td>
              <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:text-white">
                {retailer.contact_number}
              </td>
              <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:text-white">
                {retailer.admin_name || (
                  <span className="text-red-500">N/A</span>
                )}
              </td>
              {/* <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:text-white">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    retailer.terminal_access
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {retailer.terminal_access ? "Yes" : "No"}
                </span>
              </td> */}
              <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:text-white">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    retailer.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {retailer.active ? "Yes" : "No"}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:text-white">
                <Button
                  onClick={() => handleOpenTerminals(retailer)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleOpenTerminals(retailer)
                  }
                  className="w-full rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-800"
                  tabIndex={0}
                  aria-label={`View terminals for ${retailer.name}`}
                  type="button"
                >
                  View Terminals
                </Button>
              </td>
            </tr>
          ))}
          {(!retailers || retailers.length === 0) && (
            <tr>
              <td
                colSpan={8}
                className="border border-gray-300 px-4 py-4 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400"
              >
                No retailers assigned to this group
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedRetailer && (
        <TerminalsModal
          isOpen={isModalOpen}
          onClose={handleCloseTerminals}
          retailer={selectedRetailer}
        />
      )}
    </div>
  );
};

export default RetailersTable;
