import React, { useState, useMemo } from "react";
import CommissionsTable from "./CommissionsTable";
import RetailersTable from "./RetailersTable";
import { MobileDataVoucher, Retailer } from "@/app/types/common";
import AddRetailersModal from "./AddRetailersModal";
import EditIcon from "@mui/icons-material/Edit";
import EditCommGroupModal from "./EditCommGroupModal";
import { removeRetailerFromCommGroupAction } from "./actions";

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
  setSelectedCommGroupId: (commGroupId: string) => void;
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
  onCommGroupEdited?: () => void;
}

const CommissionGroupTable: React.FC<CommissionGroupTableProps> = ({
  data,
  setAddSupplierModalOpen,
  setSelectedCommGroupId,
  handleDeleteVoucher,
  handleEditVoucher,
  editLoading,
  editError,
  editSuccess,
  onRetailerAssigned,
  onCommGroupEdited,
}) => {
  // Sort the data with newest groups (assuming higher IDs are newer) at the top
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      // Try to parse IDs as numbers if possible
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);

      // If both IDs can be parsed as numbers, compare them numerically
      if (!isNaN(idA) && !isNaN(idB)) {
        return idB - idA; // Descending order (newest first)
      }

      // Fallback to string comparison if IDs are not numeric
      return b.id.localeCompare(a.id);
    });
  }, [data]);

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

  const [editCommGroupModalOpen, setEditCommGroupModalOpen] = useState(false);
  const [selectedEditCommGroup, setSelectedEditCommGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [removeRetailerLoading, setRemoveRetailerLoading] = useState(false);
  const [removeRetailerError, setRemoveRetailerError] = useState("");
  const [removeRetailerSuccess, setRemoveRetailerSuccess] = useState("");

  const handleViewChange = (
    groupId: string,
    view: "vouchers" | "retailers",
  ) => {
    setActiveViews((prev) => ({
      ...prev,
      [groupId]: view,
    }));
  };

  const handleEditCommGroup = (groupId: string, groupName: string) => {
    setSelectedEditCommGroup({ id: groupId, name: groupName });
    setEditCommGroupModalOpen(true);
  };

  const handleRemoveRetailer = async (retailerId: string) => {
    try {
      setRemoveRetailerLoading(true);
      setRemoveRetailerError("");
      setRemoveRetailerSuccess("");

      const result = await removeRetailerFromCommGroupAction(retailerId);

      if (result.error) {
        setRemoveRetailerError(result.error);
      } else {
        setRemoveRetailerSuccess(
          result.success || "Retailer removed successfully",
        );
        if (onRetailerAssigned) {
          onRetailerAssigned(); // Refresh the data
        }
      }
    } catch (error) {
      setRemoveRetailerError("An unexpected error occurred");
      console.error("Error removing retailer:", error);
    } finally {
      setRemoveRetailerLoading(false);
    }
  };

  return (
    <div className="container mx-auto mb-10 py-8 pl-4">
      {removeRetailerError && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {removeRetailerError}
        </div>
      )}
      {removeRetailerSuccess && (
        <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
          {removeRetailerSuccess}
        </div>
      )}

      {sortedData.map((group) => (
        <div key={group.id} className="mb-20">
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center">
                <button
                  onClick={() => handleEditCommGroup(group.id, group.name)}
                  className="mr-2 rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                  aria-label="Edit commission group"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleEditCommGroup(group.id, group.name);
                    }
                  }}
                >
                  <EditIcon className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold dark:text-white sm:text-2xl">
                  {group.name}
                </h2>
              </div>
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
                  setSelectedCommGroupId(group.id);
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
                <RetailersTable
                  retailers={group.retailers}
                  onRemoveRetailer={onRetailerAssigned}
                  commGroupName={group.name}
                />
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
          }}
          commGroupId={selectedCommGroup.id}
          commGroupName={selectedCommGroup.name}
          onRetailerAssigned={onRetailerAssigned}
        />
      )}

      {selectedEditCommGroup && (
        <EditCommGroupModal
          open={editCommGroupModalOpen}
          handleClose={() => {
            setEditCommGroupModalOpen(false);
            setSelectedEditCommGroup(null);
          }}
          commGroupId={selectedEditCommGroup.id}
          commGroupName={selectedEditCommGroup.name}
          onCommGroupEdited={onCommGroupEdited}
        />
      )}
    </div>
  );
};

export default CommissionGroupTable;
