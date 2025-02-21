import React, { useState } from "react";
import CommissionsTable from "./CommissionsTable";
import RetailersTable from "./RetailersTable";
import { MobileDataVoucher, Retailer } from "@/app/types/common";
import AddRetailersModal from "./AddRetailersModal";

interface CommissionGroupTableProps {
  data: Array<{
    id: string;
    name: string;
    vouchers: MobileDataVoucher[];
    retailers?: Retailer[];
  }>;
  setAddSupplierModalOpen: (
    open: boolean,
    commGroupId?: string,
    commGroupName?: string,
  ) => void;
  handleDeleteVoucher?: (voucherId: string) => void;
  handleEditVoucher?: (
    groupId: string,
    voucherIndex: number,
    updatedVoucher: MobileDataVoucher,
    isJustOpening?: boolean,
  ) => void;
  editLoading?: boolean;
  editError?: string;
  editSuccess?: string;
  onRetailerAssigned?: () => void;
}

const CommissionGroupTable: React.FC<CommissionGroupTableProps> = ({
  data,
  setAddSupplierModalOpen,
  handleDeleteVoucher,
  handleEditVoucher,
  editLoading,
  editError,
  editSuccess,
  onRetailerAssigned,
}) => {
  const [activeViews, setActiveViews] = React.useState<
    Record<string, "vouchers" | "retailers">
  >(
    data.reduce(
      (acc, group) => ({
        ...acc,
        [group.id]: "vouchers",
      }),
      {},
    ),
  );

  const [addRetailersModalOpen, setAddRetailersModalOpen] = useState(false);
  const [selectedCommGroup, setSelectedCommGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleViewChange = (
    groupId: string,
    view: "vouchers" | "retailers",
  ) => {
    setActiveViews((prev) => ({
      ...prev,
      [groupId]: view,
    }));
  };

  return (
    <div className="container mx-auto mb-10 px-4 py-8">
      {data.map((group) => (
        <div key={group.id} className="mb-20">
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <h2 className="text-xl font-bold dark:text-white sm:text-2xl">
                {group.name}
              </h2>
              <button
                className={`ml-5 w-full rounded border border-blue-700 px-3 py-2 font-semibold shadow transition duration-300 sm:w-auto ${
                  activeViews[group.id] === "vouchers"
                    ? "bg-blue-700 text-white"
                    : "text-blue-500 hover:bg-blue-800 hover:text-white"
                }`}
                onClick={() => handleViewChange(group.id, "vouchers")}
              >
                Vouchers
              </button>
              <button
                className={`ml-5 w-full rounded border border-blue-700 px-3 py-2 font-semibold shadow transition duration-300 sm:w-auto ${
                  activeViews[group.id] === "retailers"
                    ? "bg-blue-700 text-white"
                    : "text-blue-500 hover:bg-blue-800 hover:text-white"
                }`}
                onClick={() => handleViewChange(group.id, "retailers")}
              >
                Retailers
              </button>
            </div>
            <button
              className="w-full rounded border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700 sm:w-auto"
              onClick={() => {
                if (activeViews[group.id] === "retailers") {
                  setSelectedCommGroup({ id: group.id, name: group.name });
                  setAddRetailersModalOpen(true);
                } else {
                  setAddSupplierModalOpen(true, group.id, group.name);
                }
              }}
            >
              {activeViews[group.id] === "vouchers"
                ? "Add Vouchers"
                : "Add Retailers"}
            </button>
          </div>

          <div className="relative w-full">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              {activeViews[group.id] === "vouchers" ? (
                <CommissionsTable
                  group={group}
                  handleDeleteVoucher={handleDeleteVoucher}
                  handleEditVoucher={handleEditVoucher}
                  editLoading={editLoading}
                  editError={editError}
                  editSuccess={editSuccess}
                />
              ) : (
                <RetailersTable retailers={group.retailers} />
              )}
            </div>
          </div>
        </div>
      ))}

      {selectedCommGroup && (
        <AddRetailersModal
          open={addRetailersModalOpen}
          handleClose={() => {
            setAddRetailersModalOpen(false);
            setSelectedCommGroup(null);
            if (onRetailerAssigned) {
              onRetailerAssigned();
            }
          }}
          commGroupId={selectedCommGroup.id}
          commGroupName={selectedCommGroup.name}
        />
      )}
    </div>
  );
};

export default CommissionGroupTable;
