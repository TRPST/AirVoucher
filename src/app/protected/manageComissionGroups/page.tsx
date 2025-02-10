"use client";

import {
  deleteCommGroupAction,
  editCommGroupAction,
  getCommGroupsAction,
  createCommGroup,
} from "./actions";
import { CommGroup, User } from "@/app/types/common";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import TableCell from "../../../components/Tables/TableCell";
import { Button } from "@mui/material";
import AddCommGroupModal from "./AddCommGroupModal";
import EditCommGroupModal from "./EditCommGroupModal";
import { getUserAction } from "@/app/actions";
import CommissionTable from "./CommissionsTable";
import AddSupplierModal from "./AddSupplierModal";

const CommissionManagement = () => {
  const [commGroups, setCommGroups] = useState<CommGroup[]>([]);
  const [newCommGroup, setNewCommGroup] = useState<CommGroup>({
    name: "",
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
    const { users, error } = await getCommGroupsAction();
    console.log("Users: ", users);
    if (error) {
      console.error(error);
    } else {
      if (users) {
        setCommGroups(users);
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
      console.log("Result: ", result);
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
      console.log("Result: ", result);
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
      const result = await editCommGroupAction(updatedCommGroupRetailers);
      console.log("Result: ", result);
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
      console.log("Result: ", result);
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
    setUpdatedCommGroup({
      name: "",
    });

    setEditError("");
    setEditSuccess("");
    setConfirmDeleteCommGroup(false);
  };

  const tableHeaders =
    userRole === "superAdmin"
      ? ["Name", "Suppliers", ""]
      : ["Name", "Suppliers"];

  const generateUniqueCommGroupID = () => `AD${String(Date.now()).slice(-4)}`;

  const dummyData = [
    {
      name: "Gold",
      suppliers: [
        {
          name: "Glocell",
          vouchers: [
            {
              name: "MTN",
              total_commission: 5,
              retailer_commission: 4,
              agent_commission: 2,
            },
            {
              name: "CellC",
              total_commission: 6,
              retailer_commission: 4,
              agent_commission: 3,
            },
            {
              name: "Vodacom",
              total_commission: 4,
              retailer_commission: 4,
              agent_commission: 1,
            },
          ],
        },
        {
          name: "OTT",
          vouchers: [
            {
              name: "OTT",
              total_commission: 5,
              retailer_commission: 4,
              agent_commission: 2,
            },
            {
              name: "Voucher 2",
              total_commission: 6,
              retailer_commission: 4,
              agent_commission: 3,
            },
            {
              name: "Voucher 3",
              total_commission: 4,
              retailer_commission: 4,
              agent_commission: 1,
            },
          ],
        },
        {
          name: "BlueLabel 3",
          vouchers: [
            {
              name: "Voucher 1",
              total_commission: 2,
              retailer_commission: 2,
              agent_commission: 2,
            },
            {
              name: "Voucher 2",
              total_commission: 3,
              retailer_commission: 3,
              agent_commission: 3,
            },
            {
              name: "Voucher 3",
              total_commission: 1,
              retailer_commission: 1,
              agent_commission: 1,
            },
            {
              name: "Voucher 4",
              total_commission: 5,
              retailer_commission: 5,
              agent_commission: 5,
            },
          ],
        },
      ],
    },
    {
      name: "Silver",
      suppliers: [
        {
          name: "Supplier 1",
          vouchers: [
            {
              name: "Voucher 1",
              total_commission: 5,
              retailer_commission: 4,
              agent_commission: 2,
            },
            {
              name: "Voucher 2",
              total_commission: 6,
              retailer_commission: 4,
              agent_commission: 3,
            },
            {
              name: "Voucher 3",
              total_commission: 4,
              retailer_commission: 4,
              agent_commission: 1,
            },
          ],
        },
        {
          name: "Supplier 2",
          vouchers: [
            {
              name: "Voucher 1",
              total_commission: 5,
              retailer_commission: 4,
              agent_commission: 2,
            },
            {
              name: "Voucher 2",
              total_commission: 6,
              retailer_commission: 4,
              agent_commission: 3,
            },
            {
              name: "Voucher 3",
              total_commission: 4,
              retailer_commission: 4,
              agent_commission: 1,
            },
          ],
        },
        {
          name: "Supplier 3",
          vouchers: [
            {
              name: "Voucher 1",
              total_commission: 2,
              retailer_commission: 2,
              agent_commission: 2,
            },
            {
              name: "Voucher 2",
              total_commission: 3,
              retailer_commission: 3,
              agent_commission: 3,
            },
            {
              name: "Voucher 3",
              total_commission: 1,
              retailer_commission: 1,
              agent_commission: 1,
            },
            {
              name: "Voucher 4",
              total_commission: 5,
              retailer_commission: 5,
              agent_commission: 5,
            },
          ],
        },
      ],
    },
  ];

  const [commissionGroups, setCommissionGroups] = useState(dummyData);
  const [addSupplierModalOpen, setAddSupplierModalOpen] = useState(false);

  const handleAddSupplier = (groupId, newSupplier) => {
    console.log("Adding supplier: ", newSupplier);
    const updatedGroups = commissionGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            suppliers: [...group.suppliers, newSupplier],
          }
        : group,
    );
    setCommissionGroups(updatedGroups);
  };

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Manage Commission Groups
          </h2>
          {/* <Button variant="outlined" onClick={() => setAddCommGroupModalOpen(true)}>
            Add CommGroup
          </Button> */}
          {userRole === "superAdmin" && (
            <button
              onClick={() => setAddCommGroupModalOpen(true)}
              className="rounded border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700"
            >
              Create Commision Group
            </button>
          )}
        </div>

        {/* <div>
          {loading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : commGroups.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No commission groups available. Please create one.
            </p>
          ) : (
            <>
              <p className="font-bold text-gray-800 dark:text-white">
                Commission Groups
              </p>

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {tableHeaders.map((header) => (
                        <th
                          key={header}
                          className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600"
                          style={{ width: "15%" }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {commGroups.map((commGroup, index) => (
                      <tr
                        key={index}
                        className=" bg-white transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <TableCell>{commGroup.name}</TableCell>
                        <TableCell>
                          <p
                            className="cursor-pointer underline"
                            onClick={() => handleEditOpen(commGroup)}
                          >
                            Edit
                          </p>
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div> */}

        <div>
          {commissionGroups.map((group) => (
            <div key={group.id}>
              <CommissionTable
                data={[group]}
                setAddSupplierModalOpen={() => setAddSupplierModalOpen(true)}
              />

              <AddSupplierModal
                isOpen={addSupplierModalOpen}
                onClose={() => setAddSupplierModalOpen(false)}
                onAddSupplier={(supplier) =>
                  handleAddSupplier(group.id, supplier)
                }
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
      {updatedCommGroup && (
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
      )}
    </>
  );
};

export default CommissionManagement;
