import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Retailer } from "@/app/types/common";
import { getRetailersAction } from "../retailersList/actions";
import { assignCommGroupToRetailer } from "./actions";

interface AddRetailersModalProps {
  open: boolean;
  handleClose: () => void;
  commGroupId: string;
  commGroupName: string;
  onRetailerAssigned?: () => void;
}

const AddRetailersModal: React.FC<AddRetailersModalProps> = ({
  open,
  handleClose,
  commGroupId,
  commGroupName,
  onRetailerAssigned,
}) => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedRetailerId, setSelectedRetailerId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRetailers = async () => {
      const result = await getRetailersAction();
      if (result?.retailers) {
        // No need to filter here anymore, we'll handle display in the MenuItem
        setRetailers(result.retailers);
      }
    };

    if (open) {
      fetchRetailers();
    }
  }, [open]);

  const handleAssignRetailer = async () => {
    if (!selectedRetailerId) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const result = await assignCommGroupToRetailer(
      selectedRetailerId,
      commGroupId,
    );

    if (result.error) {
      setError(result.error);
    } else {
      if (onRetailerAssigned) {
        onRetailerAssigned();
      }
      setSuccess("Retailer assigned successfully");
    }

    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
        className="bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800">
            <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800 dark:text-white">
              Add Retailer to {commGroupName}
            </h2>
            <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
              Select a retailer to add to this commission group.
            </p>

            <div className="flex flex-col space-y-4">
              <FormControl fullWidth>
                <InputLabel
                  id="retailer-select-label"
                  className="dark:text-white"
                  sx={{
                    color: "inherit",
                    "&.Mui-focused": {
                      color: "inherit",
                    },
                  }}
                >
                  Select Retailer
                </InputLabel>
                <Select
                  labelId="retailer-select-label"
                  id="retailer-select"
                  value={selectedRetailerId}
                  label="Select Retailer"
                  onChange={(e) => setSelectedRetailerId(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 dark:text-white"
                  sx={{
                    "& .MuiSelect-select": {
                      color: "inherit",
                    },
                    "& .MuiInputLabel-root": {
                      color: "inherit",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "gray",
                    },
                    "& .MuiSelect-icon": {
                      color: "inherit",
                    },

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "gray",
                    },
                  }}
                >
                  {retailers.map((retailer) => {
                    const isAssigned =
                      String(retailer.comm_group_id) === commGroupId;
                    const isInAnotherGroup =
                      retailer.comm_group_id && !isAssigned;

                    return (
                      <MenuItem
                        key={retailer.id}
                        value={retailer.id}
                        disabled={Boolean(isAssigned || isInAnotherGroup)}
                        sx={{
                          opacity: isAssigned || isInAnotherGroup ? 0.5 : 1,
                          "&.Mui-disabled": {
                            color: "gray",
                          },
                          "&:after": isAssigned
                            ? {
                                content: '"(Already in this group)"',
                                marginLeft: "8px",
                                fontSize: "0.8em",
                                color: "gray",
                              }
                            : isInAnotherGroup
                              ? {
                                  content: '"(In another group)"',
                                  marginLeft: "8px",
                                  fontSize: "0.8em",
                                  color: "gray",
                                }
                              : {},
                        }}
                      >
                        {retailer.name} - {retailer.location}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {loading ? (
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
              ) : error ? (
                <>
                  <p className="mb-4 text-center font-bold text-red-500">
                    {error}
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : success ? (
                <>
                  <p className="mb-4 text-center font-bold text-green-500">
                    {success}
                  </p>
                  <button
                    onClick={() => {
                      handleClose();
                      setSelectedRetailerId("");
                    }}
                    className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Done
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAssignRetailer}
                  disabled={!selectedRetailerId}
                  className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Assign Retailer
                </button>
              )}
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddRetailersModal;
