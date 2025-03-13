import React from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { Retailer } from "@/app/types/common";
import useTerminalList from "./useTerminalList";
import Link from "next/link";

interface TerminalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  retailer: Retailer;
}

const TerminalsModal: React.FC<TerminalsModalProps> = ({
  isOpen,
  onClose,
  retailer,
}) => {
  const { terminals, isLoading, error } = useTerminalList(retailer.id);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="terminals-modal-title"
      aria-describedby="terminals-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          outline: "none",
          borderRadius: "8px",
        }}
        className="bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="terminals-modal-title"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Terminals - {retailer.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div id="terminals-modal-description">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : terminals.length === 0 ? (
            <div className="text-center text-gray-500">
              No terminals found for this retailer
            </div>
          ) : (
            <div className="space-y-4">
              {terminals.map((terminal) => (
                <div
                  key={terminal.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Terminal ID: {terminal.id}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Cashier: {terminal.cashier_name || "Unassigned"}
                      </p>
                      <Link
                        href={`/protected/manageTerminals/${terminal.id}`}
                        className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Dashboard →
                      </Link>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        terminal.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {terminal.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default TerminalsModal;
