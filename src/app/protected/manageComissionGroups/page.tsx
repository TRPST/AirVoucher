"use client";

import {
  deleteCommGroupAction,
  editCommGroupAction,
  getCommGroupsAction,
  createCommGroup,
  editVoucherAction,
  deleteVoucherAction,
} from "./actions";
import { CommGroup, User, MobileDataVoucher } from "@/app/types/common";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import TableCell from "../../../components/Tables/TableCell";
import { Button } from "@mui/material";
import AddCommGroupModal from "./AddCommGroupModal";
//import EditCommGroupModal from "./EditCommGroupModal";
import { getUserAction } from "@/app/actions";
import CommissionTable from "./CommissionsTable";
import AddSupplierModal from "./AddSupplierModal";

const generateSecurePassword = () => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const CommissionManagement = () => {
  const [commGroups, setCommGroups] = useState<CommGroup[]>([]);
  const [newCommGroup, setNewCommGroup] = useState<CommGroup>({
    name: "",
    email: "",
    contact_number: "",
    active: true,
    terminal_access: false,
    role: "admin",
    assigned_retailers: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [confirmDeleteCommGroup, setConfirmDeleteCommGroup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [addCommGroupModalOpen, setAddCommGroupModalOpen] = useState(false);
  const [editCommGroupModalOpen, setEditCommGroupModalOpen] = useState(false);
  const [editCommGroup, setEditCommGroup] = useState<CommGroup | null>(null);
  const [updatedCommGroup, setUpdatedCommGroup] = useState<CommGroup | null>(
    null,
  );

  const [userRole, setUserRole] = useState<string>("");

  const [addSupplierModalOpen, setAddSupplierModalOpen] = useState(false);
  const [selectedCommGroupId, setSelectedCommGroupId] = useState<string | null>(
    null,
  );
  const [selectedCommGroupName, setSelectedCommGroupName] =
    useState<string>("");

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = await getUserAction();
      //console.log("User: ", user);
      if (user) {
        setUserRole(user?.role || "");
      }
    };
    fetchUserRole();
  }, []);

  const fetchCommGroups = async (doLoad: boolean) => {
    if (doLoad) setLoading(true);
    const { commissionGroups, error } = await getCommGroupsAction();
    //console.log("Commission Groups: ", commissionGroups);
    if (error) {
      console.error(error);
    } else {
      if (commissionGroups) {
        setCommGroups(commissionGroups as CommGroup[]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCommGroups(true);
  }, []);

  useEffect(() => {
    if (success !== "") fetchCommGroups(false);
    if (editSuccess !== "") fetchCommGroups(false);
  }, [success, editSuccess]);

  useEffect(() => {
    setSuccess("");
    setError("");

    setEditSuccess("");
    setEditError("");
  }, [newCommGroup, updatedCommGroup]);

  const handleCreateCommGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCommGroup?.name) {
      setError("Commision group name is required.");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      const result = await createCommGroup(newCommGroup);
      //console.log("Result: ", result);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (commGroup: CommGroup) => {
    setUpdatedCommGroup(commGroup);
    setEditCommGroupModalOpen(true);
  };

  const handleClose = () => {
    setAddCommGroupModalOpen(false);
    setNewCommGroup({
      name: "",
      email: "",
      contact_number: "",
      active: true,
      terminal_access: false,
      role: "admin",
      assigned_retailers: [],
    });
    setError("");
    setSuccess("");
  };

  const handleEditCommGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedCommGroup) return;
    if (updatedCommGroup.name.trim() === "") {
      setEditError("All fields are required.");
      return;
    }
    try {
      setEditLoading(true);
      const result = await editCommGroupAction(updatedCommGroup);
      //console.log("Result: ", result);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess(result.success || "");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCommGroupRetailers = async (
    updatedCommGroupRetailers: User,
  ) => {
    if (!updatedCommGroupRetailers) return;
    try {
      setEditLoading(true);
      const result = await editCommGroupAction(
        updatedCommGroupRetailers as CommGroup,
      );
      //console.log("Result: ", result);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess(result.success || "");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  //function to handle delete retailer
  const handleDeleteCommGroup = async (id: string) => {
    try {
      setEditLoading(true);
      const result = await deleteCommGroupAction(id);
      //console.log("Result: ", result);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess(result.success || "");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditClose = () => {
    setEditCommGroupModalOpen(false);
    setUpdatedCommGroup(null);

    setEditError("");
    setEditSuccess("");
    setConfirmDeleteCommGroup(false);
  };

  const generateUniqueCommGroupID = () => `AD${String(Date.now()).slice(-4)}`;

  const handleAddVouchers = () => {
    fetchCommGroups(true);
  };

  const handleEditVoucher = async (
    groupId: string,
    voucherIndex: number,
    updatedVoucher: MobileDataVoucher,
    isJustOpening?: boolean,
  ) => {
    if (isJustOpening) {
      setEditError("");
      setEditSuccess("");
      return;
    }

    try {
      setEditLoading(true);
      const result = await editVoucherAction(updatedVoucher);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess(result.success || "");
        fetchCommGroups(false);
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteVoucher = async (voucherId: string) => {
    try {
      setEditLoading(true);
      setEditError("");
      setEditSuccess("");

      if (!voucherId) {
        setEditError("Voucher ID not found");
        return;
      }

      const result = await deleteVoucherAction(voucherId);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess(result.success || "");
        // Close the modal and refresh the data
        fetchCommGroups(false);
      }
    } catch (error) {
      console.error("Error: ", error);
      setEditError("Failed to delete voucher");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-4 flex flex-col space-y-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white sm:text-3xl">
            Manage Commission Groups
          </h2>
          {userRole === "superAdmin" && (
            <button
              onClick={() => setAddCommGroupModalOpen(true)}
              className="w-full rounded border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700 sm:w-auto"
            >
              Create Commission Group
            </button>
          )}
        </div>

        <div className=" ">
          {commGroups.map((group) => (
            <div key={group.id}>
              <CommissionTable
                data={group.id ? [group as Required<CommGroup>] : []}
                setAddSupplierModalOpen={(open, commGroupId, commGroupName) => {
                  setSelectedCommGroupId(commGroupId || null);
                  setSelectedCommGroupName(commGroupName || "");
                  setAddSupplierModalOpen(open);
                }}
                handleDeleteVoucher={handleDeleteVoucher}
                handleEditVoucher={handleEditVoucher}
                editLoading={editLoading}
                editError={editError}
                editSuccess={editSuccess}
              />

              <AddSupplierModal
                isOpen={addSupplierModalOpen}
                onClose={() => setAddSupplierModalOpen(false)}
                commGroupId={selectedCommGroupId || ""}
                commGroupName={selectedCommGroupName}
                onAddVouchers={handleAddVouchers}
              />
            </div>
          ))}
        </div>
      </div>

      <AddCommGroupModal
        open={addCommGroupModalOpen}
        handleClose={handleClose}
        handleCreateCommGroup={handleCreateCommGroup}
        newCommGroup={newCommGroup}
        setNewCommGroup={setNewCommGroup}
        error={error}
        success={success}
        loading={loading}
        setLoading={setLoading}
      />
      {/* {updatedCommGroup && (
        <EditCommGroupModal
          open={editCommGroupModalOpen}
          handleClose={handleEditClose}
          handleEditCommGroup={handleEditCommGroup}
          handleEditCommGroupRetailers={handleEditCommGroupRetailers}
          handleDeleteCommGroup={(id: string) => handleDeleteCommGroup(id)}
          confirmDeleteCommGroup={confirmDeleteCommGroup}
          setConfirmDeleteCommGroup={setConfirmDeleteCommGroup}
          updatedCommGroup={updatedCommGroup}
          setUpdatedCommGroup={setUpdatedCommGroup}
          editError={editError}
          editSuccess={editSuccess}
          editLoading={editLoading}
          setEditLoading={setEditLoading}
          generateUniqueCommGroupID={generateUniqueCommGroupID}
          generateSecurePassword={generateSecurePassword}
        />
      )} */}
    </>
  );
};

export default CommissionManagement;
