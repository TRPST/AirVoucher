"use client";

import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { getTerminalsAction } from "./actions";
import { getAdminsAction } from "../manageAdmins/actions";
import { User, Retailer, Terminal } from "@/app/types/common";
import { getRetailersAction } from "../retailersList/actions";
import AddTerminalModal from "./AddTerminalModal";
import EditTerminalModal from "./EditTerminalModal";

const TerminalManagement = () => {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [newTerminal, setNewTerminal] = useState<Terminal>({
    id: "",
    assigned_retailer: "",
    assigned_cashier: "",
    cashiers_name: "",
    retailers_name: "",
    active: true,
    created_at: new Date(),
  });
  const [updatedTerminal, setUpdatedTerminal] = useState<Terminal>();
  const [addTerminalModalOpen, setAddTerminalModalOpen] = useState(false);
  const [editTerminalModalOpen, setEditTerminalModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");
  const [newCashier, setNewCashier] = useState<User>();

  const [fetchingTerminals, setFetchingTerminals] = useState(false);
  const [success, setSuccess] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
        setTerminals(terminals);
      }
    }
    setFetchingTerminals(false);
  };

  useEffect(() => {
    fetchTerminals(true);
  }, []);

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

  //handleAddTerminal
  const handleAddTerminal = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(newTerminal);
    setAddTerminalModalOpen(false);
    setNewTerminal({
      id: "",
      assigned_retailer: "",
      assigned_cashier: "",
      cashiers_name: "",
      retailers_name: "",
      active: true,
      created_at: new Date(),
    });
    setSuccess("Terminal added successfully");
  };

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

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <div>
          <div className="mb-6 flex flex-row items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Terminals List
            </h2>
            {/* <Button variant="outlined" onClick={handleOpen}>
            Add Retailer
          </Button> */}
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
                  Retailer ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Cashier's Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Active
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold dark:border-gray-600">
                  Activate/Deactivate
                </th>
              </tr>
            </thead>
            <tbody>
              {terminals.map((terminal, index) => (
                <tr
                  key={terminal.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  } transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600`}
                >
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {terminal.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {terminal.assigned_retailer}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {terminal.cashiers_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-white">
                    {terminal.active ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-800 dark:border-gray-600 dark:text-white">
                    <label className="flex items-center justify-center space-x-3">
                      <span>{terminal.active}</span>
                      <input
                        type="checkbox"
                        checked={terminal.active}
                        onChange={() => toggleTerminalStatus(index)}
                        className="toggle-checkbox"
                      />
                      <span className="toggle-switch"></span>
                    </label>
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
          newCashier={newCashier as User}
          setNewCashier={setNewCashier}
          retailers={retailers}
          error={error}
          success={success}
          loading={loading}
          setLoading={setLoading}
          generateSecurePassword={generateSecurePassword}
        />
      )}
      {/* {updatedTerminal && (
        <EditTerminalModal
          open={editTerminalModalOpen}
          handleClose={handleEditClose}
          handleEditTerminal={handleEditTerminal}
          handleDeleteTerminal={(id: string) => handleDeleteTerminal(id)}
          confirmDeleteTerminal={confirmDeleteTerminal}
          setConfirmDeleteTerminal={setConfirmDeleteTerminal}
          updatedTerminal={updatedTerminal}
          setUpdatedTerminal={setUpdatedTerminal}
          editError={editError}
          editSuccess={editSuccess}
          editLoading={editLoading}
          setEditLoading={setEditLoading}
        />
      )} */}
    </DefaultLayout>
  );
};

export default TerminalManagement;
