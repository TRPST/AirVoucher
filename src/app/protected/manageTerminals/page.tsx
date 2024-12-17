"use client";

import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { getTerminalsAction, signUpTerminalAction } from "./actions";
import { getAdminsAction } from "../manageAdmins/actions";
import { User, Retailer, Terminal } from "@/app/types/common";
import { getRetailersAction } from "../retailersList/actions";
import AddTerminalModal from "./AddTerminalModal";
import EditTerminalModal from "./EditTerminalModal";
import RetailerModal from "./RetailerModal";
import CashierModal from "./CashierModal";
import { useRouter, usePathname } from "next/navigation";
import { getUserAction } from "@/app/actions";

const TerminalManagement = () => {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [newTerminal, setNewTerminal] = useState({
    id: "",
    assigned_retailer: "",
    cashier_name: "",
    cashier_email: "",
    contact_number: "",
    password: "",
    retailer_name: "",
    active: true,
    created_at: new Date(),
  });
  const [updatedTerminal, setUpdatedTerminal] = useState<Terminal>();
  const [addTerminalModalOpen, setAddTerminalModalOpen] = useState(false);
  const [editTerminalModalOpen, setEditTerminalModalOpen] = useState(false);
  const [retailerModalOpen, setRetailerModalOpen] = useState(false);
  const [cashierModalOpen, setCashierModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");
  const [newCashier, setNewCashier] = useState<User>();

  const [selectedRetailer, setSelectedRetailer] = useState<string | null>(null);
  const [selectedCashier, setSelectedCashier] = useState<string | null>(null);

  const [fetchingTerminals, setFetchingTerminals] = useState(false);
  const [success, setSuccess] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [confirmDeleteTerminal, setConfirmDeleteTerminal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const router = useRouter();
  const currentPath = usePathname();

  const handleDashboardClick = (terminalId: string) => {
    router.push(`${currentPath}/${terminalId}`);
  };

  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserAction();
      console.log("User: ", user.id);
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  const fetchTerminals = async (doLoad: Boolean) => {
    if (doLoad) setFetchingTerminals(true);

    const result = await getTerminalsAction();
    const terminals = result?.terminals || [];
    const error = (result as { terminals: any[]; error?: string })?.error;
    //console.log("Terminals: ", retailers);
    if (error) {
      console.error(error);
    } else {
      if (terminals) {
        if (user?.role === "cashier") {
          const cashierTerminals = terminals.filter(
            (terminal) => terminal.assigned_cashier === user.id,
          );
          console.log("cashierTerminals: ", cashierTerminals);

          setTerminals(cashierTerminals);
        }
        //setTerminals(terminals);
      }
    }
    setNewTerminal({
      ...newTerminal,
      id: `TER${terminals.length + 1}`,
    });

    setFetchingTerminals(false);
  };

  useEffect(() => {
    fetchTerminals(true);
  }, [user]);

  useEffect(() => {
    if (success !== "") fetchTerminals(false);
    if (editSuccess !== "") fetchTerminals(false);
    //fetchTerminals();
  }, [success, editSuccess]);

  const fetchRetailers = async (doLoad: boolean) => {
    if (doLoad) setLoading(true);
    const response = await getRetailersAction();

    console.log("Retailers: ", response);

    if (response?.retailers) {
      setRetailers(response.retailers);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRetailers(false);
  }, [terminals]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewTerminal({ ...newTerminal, [name]: value as any });
  };

  const addTerminal = () => {
    setAddTerminalModalOpen(true);
  };

  const toggleTerminalStatus = (index: number) => {
    const updatedTerminals = [...terminals];
    updatedTerminals[index].active = !updatedTerminals[index].active;
    setTerminals(updatedTerminals);
  };

  const handleAddTerminal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerminal) return;
    if (newTerminal.cashier_name.trim() === "") {
      setError("Cashier's name is required.");
      return;
    }

    if (newTerminal.cashier_email.trim() === "") {
      setError("Cashier's email is required.");
      return;
    }

    if (newTerminal.contact_number.trim() === "") {
      setError("Contact number is required.");
      return;
    }

    if (newTerminal.password.trim() === "") {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);
      const result = await signUpTerminalAction(newTerminal);
      console.log("Result: ", result);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Terminal created successfully!");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTerminal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedTerminal) return;
    if (
      updatedTerminal.name.trim() === "" ||
      updatedTerminal.contact_person.trim() === "" ||
      updatedTerminal.contact_number.trim() === "" ||
      updatedTerminal.location.trim() === ""
    ) {
      setEditError("All fields are required.");
      return;
    }
    try {
      setEditLoading(true);
      const result = await editTerminalAction(updatedTerminal);
      console.log("Result: ", result);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess("Terminal updated successfully!");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  //function to handle delete retailer
  const handleDeleteTerminal = async (id: string) => {
    try {
      setEditLoading(true);
      const result = await deleteTerminalAction(id);
      console.log("Result: ", result);
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess("Terminal deleted successfully!");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditOpen = (terminal: Terminal) => {
    setUpdatedTerminal(terminal);
    setEditTerminalModalOpen(true);
  };

  const handleEditClose = () => {
    setEditTerminalModalOpen(false);
    setUpdatedTerminal(undefined);
    setConfirmDeleteTerminal(false);
  };

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [newTerminal]);

  useEffect(() => {
    setEditError("");
    setEditSuccess("");
  }, [updatedTerminal]);

  const handleClose = () => {
    setAddTerminalModalOpen(false);
  };

  const handleOpen = () => {
    setAddTerminalModalOpen(true);
  };

  const generateSecurePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setNewCashier((prev) =>
      prev ? { ...prev, password } : { ...newCashier!, password },
    );
  };

  const handleRetailerModal = (retailerId: string) => {
    setSelectedRetailer(retailerId);
    setRetailerModalOpen(true);
  };

  const handleRetailerClose = () => {
    setSelectedRetailer(null);
    setRetailerModalOpen(false);
  };

  const handleCashierModal = (cashierId: string) => {
    setSelectedCashier(cashierId);
    setCashierModalOpen(true);
  };

  const handleCashierClose = () => {
    setSelectedCashier(null);
    setCashierModalOpen(false);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <div>
          <div className="mb-6 flex flex-row items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Terminals List
            </h2>
            <button
              onClick={handleOpen}
              className="rounded border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700"
            >
              Add Terminal
            </button>
          </div>

          <table className="min-w-full border-collapse rounded-lg bg-white shadow-md dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Terminal ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Retailer
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Cashier
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Active
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Action
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {terminals.map((terminal, index) => (
                <tr
                  key={terminal.id}
                  className={`"bg-white transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700`}
                >
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {terminal.id}
                  </td>
                  <td className="cursor-pointer border border-gray-300 px-4 py-2 text-gray-800 underline dark:border-gray-600 dark:text-white">
                    <p
                      onClick={() =>
                        handleRetailerModal(terminal.assigned_retailer)
                      }
                    >
                      {terminal.assigned_retailer}
                    </p>
                  </td>
                  <td className="cursor-pointer border border-gray-300 px-4 py-2 text-gray-800 underline dark:border-gray-600 dark:text-white">
                    <p
                      onClick={() =>
                        handleCashierModal(terminal.assigned_cashier)
                      }
                    >
                      {terminal.cashier_name}
                    </p>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {terminal.active ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    <p
                      className="cursor-pointer underline"
                      onClick={() => handleEditOpen(terminal)}
                    >
                      Edit
                    </p>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    <p
                      className="cursor-pointer underline"
                      onClick={() => handleDashboardClick(terminal.id)}
                    >
                      Dashboard
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {newTerminal && (
        <AddTerminalModal
          open={addTerminalModalOpen}
          handleClose={handleClose}
          handleAddTerminal={handleAddTerminal}
          newTerminal={newTerminal}
          setNewTerminal={setNewTerminal}
          setNewCashier={setNewCashier}
          retailers={retailers}
          error={error}
          success={success}
          loading={loading}
          setLoading={setLoading}
          generateSecurePassword={generateSecurePassword}
        />
      )}
      {selectedRetailer && (
        <RetailerModal
          open={retailerModalOpen}
          handleRetailerClose={handleRetailerClose}
          selectedRetailer={selectedRetailer}
        />
      )}
      {selectedCashier && (
        <CashierModal
          open={cashierModalOpen}
          handleCashierClose={handleCashierClose}
          selectedCashier={selectedCashier}
        />
      )}
      {updatedTerminal && (
        <EditTerminalModal
          open={editTerminalModalOpen}
          handleClose={handleEditClose}
          handleEditTerminal={handleEditTerminal}
          handleDeleteTerminal={handleDeleteTerminal}
          confirmDeleteTerminal={confirmDeleteTerminal}
          setConfirmDeleteTerminal={setConfirmDeleteTerminal}
          updatedTerminal={updatedTerminal}
          setUpdatedTerminal={setUpdatedTerminal}
          editError={editError}
          editSuccess={editSuccess}
          editLoading={editLoading}
          setEditLoading={setEditLoading}
        />
      )}
    </DefaultLayout>
  );
};

export default TerminalManagement;
