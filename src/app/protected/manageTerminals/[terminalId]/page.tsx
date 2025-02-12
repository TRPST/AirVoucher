"use client";
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { saveVoucherToDatabase } from "../../../ott_actions";
import axios from "axios";
import crypto from "crypto";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  TextField,
  Grid, // <-- Add this
} from "@mui/material";

import WestIcon from "@mui/icons-material/West";

const TerminalDashboard = () => {
  const { terminalId } = useParams();
  const router = useRouter();

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // OTT Provider
  const [showOTTModal, setShowOTTModal] = useState(false);
  const [balance, setBalance] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const amounts = [10, 20, 50, 100];
  const [voucherResponse, setVoucherResponse] = useState(null);
  const [refreshBalance, setRefreshBalance] = useState(false);

  // sell vouchers
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [showSaleModal, setShowSaleModal] = useState(false);

  const [confirmationAction, setConfirmationAction] = useState<
    (() => void) | null
  >(null);

  const providers = [
    { name: "MTN", image: "/images/mtn.png" },
    { name: "Vodacom", image: "/images/vodacom.png" },
    { name: "Cell C", image: "/images/cellc.png" },
    { name: "Telkom", image: "/images/telkom.jpeg" },
    { name: "OTT", image: "/images/ott_logo.png" },
  ];

  // Navigate back to Terminal Management
  const navigateToTerminalManagement = () => {
    router.push("/protected/manageTerminals");
  };

  // Handle provider selection
  const selectProvider = (provider) => {
    setSelectedProvider(provider);
    setSelectedService(null);
    setVouchers([]);

    if (provider === "OTT") {
      setShowOTTModal(true);
    }
  };

  // Handle service selection (Airtime, Data, SMS)
  const selectService = async (service) => {
    setSelectedService(service);
    await fetchVouchers(service);
  };

  // Function to open sale modal when a voucher is clicked
  const handleVoucherClick = (voucher) => {
    setSelectedVoucher(voucher);
    setShowSaleModal(true);
    setMobileNumber(""); // Reset mobile number input
    setTransactionStatus(null); // Reset status
  };

  // Function to close the modal
  const closeSaleModal = () => {
    setShowSaleModal(false);
    setSelectedVoucher(null);
  };

  // Function to handle voucher sale
  const sellVoucher = async () => {
    if (!mobileNumber.match(/^0[6-8][0-9]{8}$/)) {
      setTransactionStatus({
        success: false,
        message: "Invalid mobile number.",
      });
      return;
    }

    setLoading(true);
    setTransactionStatus(null);

    try {
      const response = await axios.post("/api/data/sales", {
        reference: `SALE-${Date.now()}`,
        amount: selectedVoucher.amount,
        mobileNumber,
        productName: selectedVoucher.name,
        vendorName: selectedProvider,
      });

      if (response.status === 201) {
        setTransactionStatus({
          success: true,
          message: "Voucher sold successfully!",
        });
      } else {
        setTransactionStatus({
          success: false,
          message: "Sale failed. Try again.",
        });
      }
    } catch (error) {
      setTransactionStatus({
        success: false,
        message: error.response?.data?.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };
  // Fetch Vouchers based on service type
  const fetchVouchers = async (service) => {
    setLoading(true);
    setError(null);
    setVouchers([]);

    const url =
      service === "Airtime"
        ? "https://api.qa.bltelecoms.net/v2/trade/mobile/airtime/products"
        : "https://api.qa.bltelecoms.net/v2/trade/mobile/bundle/products";

    const username = "bld";
    const password = "ornuk3i9vseei125s8qea71kub";
    const apiKey = "b97ac3ea-da33-11ef-9cd2-0242ac120002";

    const authHeader = "Basic " + btoa(`${username}:${password}`);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: authHeader,
          apikey: apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vouchers. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Fetched ${service} Data:`, data);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No vouchers found.");
      }

      if (!selectedProvider) {
        throw new Error("Please select a provider.");
      }

      // **Filtering Logic**
      const filteredVouchers = data.filter(
        (v) => v.vendorId?.toLowerCase() === selectedProvider.toLowerCase(),
      );

      if (filteredVouchers.length === 0) {
        throw new Error(`No vouchers available for ${selectedProvider}.`);
      }

      setVouchers(filteredVouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const BASE_URL = "/api/ott"; // Updated proxy URL for OTT API
  const username = "AIRVOUCHER";
  const password = "v95Hp_#kc+";
  const apiKey = "b39abd74-534c-44dc-a8ba-62a89dc8d31c";

  const generateHash = (params) => {
    const sortedKeys = Object.keys(params).sort();
    const concatenatedString = [
      apiKey,
      ...sortedKeys.map((key) => params[key]),
    ].join("");
    return crypto.createHash("sha256").update(concatenatedString).digest("hex");
  };

  const getAuthHeaders = () => {
    const token = Buffer.from(`${username}:${password}`).toString("base64");
    return { Authorization: `Basic ${token}` };
  };

  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode: string | number) => {
    const errorMessages: { [key: string]: string } = {
      1: "System Error",
      2: "Error Getting Voucher PIN Code",
      3: "Cannot Find a Matching Product for This Value",
      4: "Cannot Find the VAT Chargeable",
      5: "Calculation Error",
      6: "You Do Not Have Sufficient Funds",
      7: "Error Saving Data (Debit/Credit)",
      8: "An Unknown System Error Occurred",
      9: "An Unknown System Error Occurred",
    };
    return errorMessages[errorCode] || "An Unknown Error Occurred";
  };
  // Helper function to generate a unique reference
  const generateUniqueReference = () =>
    `ref-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setVoucherDetails({ ...voucherDetails, [name]: value });
  };

  // Reset voucher form
  const resetForm = () => {
    setVoucherDetails({
      branch: "",
      cashier: "",
      mobileForSMS: "",
      till: "",
      value: "",
    });
    setVoucherResponse(null);
    setUniqueReference("");
  };

  // **Fetch Balance when OTT modal opens or refresh is triggered**
  useEffect(() => {
    if (showOTTModal) {
      fetchBalance();
    }
  }, [showOTTModal, refreshBalance]);

  const fetchBalance = async () => {
    setLoading(true); // Set loading state
    const uniqueReference = `ref-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

    const params = { uniqueReference };
    const hash = generateHash(params);

    try {
      const res = await axios.post(
        `${BASE_URL}/reseller/v1/GetBalance`,
        new URLSearchParams({ uniqueReference, hash }),
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      console.log("OTT Balance Response:", res.data); // Debugging Log
      setBalance(res.data.balance); // ✅ Set balance correctly
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error fetching balance"); // Show error in UI
    } finally {
      setLoading(false);
    }
  };

  const issueVoucher = async (amount) => {
    setLoading(true);

    if (!amount) {
      setVoucherResponse({
        success: false,
        message: "Please select a valid voucher amount.",
      });
      setLoading(false);
      return;
    }

    const newUniqueReference = generateUniqueReference();

    const params = {
      branch: "DEFAULT_BRANCH",
      cashier: "SYSTEM",
      mobileForSMS: "",
      till: "WEB",
      uniqueReference: newUniqueReference,
      value: amount, // ✅ Pass selected amount
      vendorCode: "11",
    };

    const hash = generateHash(params);

    try {
      const res = await axios.post(
        `${BASE_URL}/reseller/v1/GetVoucher`,
        new URLSearchParams({ ...params, hash }),
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      console.log("Issue Voucher Response:", res.data); // Debugging Log

      if (res.data.success === "true") {
        const voucherData = JSON.parse(res.data.voucher);
        setVoucherResponse({
          success: true,
          voucher: voucherData,
        });
        setRefreshBalance((prev) => !prev); // ✅ Trigger balance refresh after issuing OTT voucher
      } else {
        const errorMessage = getErrorMessage(res.data.errorCode);
        setVoucherResponse({
          success: false,
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error issuing voucher:", error);
      setVoucherResponse({
        success: false,
        message: "An error occurred while issuing the voucher.",
      });
    } finally {
      setLoading(false);
    }
  };

  // API Call: Check Voucher
  const checkVoucher = async () => {
    setLoading("check");

    const params = { uniqueReference: manageReference };
    const hash = generateHash(params);

    try {
      const res = await axios.post(
        `${BASE_URL}/reseller/v1/CheckVoucher`,
        new URLSearchParams({ uniqueReference: manageReference, hash }),
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (res.data.success === "true") {
        setCheckResponse({
          success: true,
          voucher: JSON.parse(res.data.voucher),
        });
      } else {
        setCheckResponse({
          success: false,
          message: res.data.message || "Voucher not found.",
        });
      }
    } catch (error) {
      console.error("Error checking voucher:", error);
      setCheckResponse({
        success: false,
        message:
          (axios.isAxiosError(error) && error.response?.data?.message) ||
          "An error occurred",
      });
    } finally {
      setLoading(null);
    }
  };

  // API Call: Confirm Voucher
  const confirmVoucher = async () => {
    setLoading("confirm");

    const params = { uniqueReference: manageReference };
    const hash = generateHash(params);

    try {
      const res = await axios.post(
        `${BASE_URL}/reseller/v1/ConfirmVoucher`,
        new URLSearchParams({ uniqueReference: manageReference, hash }),
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      setConfirmResponse({
        success: res.data.success === "true",
        message: res.data.message || "Unknown status.",
      });
    } catch (error) {
      console.error("Error confirming voucher:", error);
      setConfirmResponse({
        success: false,
        message:
          (axios.isAxiosError(error) && error.response?.data?.message) ||
          "An error occurred",
      });
    } finally {
      setLoading(null);
    }
  };

  // API Call: Reject Voucher
  const rejectVoucher = async () => {
    setLoading("reject");

    const params = { uniqueReference: manageReference };
    const hash = generateHash(params);

    try {
      const res = await axios.post(
        `${BASE_URL}/reseller/v1/RejectVoucher`,
        new URLSearchParams({ uniqueReference: manageReference, hash }),
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      setRejectResponse({
        success: res.data.success === "true",
        message: res.data.message || "Unknown status.",
      });
    } catch (error) {
      console.error("Error rejecting voucher:", error);
      setRejectResponse({
        success: false,
        message:
          (axios.isAxiosError(error) && error.response?.data?.message) ||
          "An error occurred",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <IconButton color="primary" onClick={navigateToTerminalManagement}>
          <WestIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          Terminal Dashboard - {terminalId}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          // onClick={() =>
          //   router.push(
          //     `/protected/manageTerminals/${terminalId}/sales_analytics`,
          //   )
          // }
        >
          Sales Analytics
        </Button>
      </div>

      {/* Service Providers */}
      <Typography variant="h5">Select a Provider</Typography>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {providers.map((provider) => (
          <Button
            key={provider.name}
            variant={
              selectedProvider === provider.name ? "contained" : "outlined"
            }
            onClick={() => selectProvider(provider.name)}
            fullWidth
          >
            <img
              src={provider.image}
              alt={provider.name}
              className="mr-2 h-12 w-auto"
            />
            {/* {provider.name} */}
          </Button>
        ))}
      </div>

      {selectedProvider && selectedProvider !== "OTT" && (
        <div className="mt-6">
          <Typography variant="h5">
            Select a Service for {selectedProvider}
          </Typography>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {["Airtime", "Data", "SMS"].map((service) => (
              <Button
                key={service}
                variant={selectedService === service ? "contained" : "outlined"}
                color="secondary"
                onClick={() => selectService(service)}
                fullWidth
              >
                {service}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Show Loading Spinner */}
      {loading && (
        <div className="mt-4 flex justify-center">
          <CircularProgress />
        </div>
      )}

      {/* Show Error Message */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
          <Typography>{error}</Typography>
        </div>
      )}

      {/* Display Vouchers */}
      {selectedService && vouchers.length > 0 && (
        <div className="mt-6">
          <Typography variant="h5">Available Vouchers</Typography>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {vouchers.map((voucher) => (
              <Card
                key={voucher.id}
                sx={{ minWidth: 200, textAlign: "center", cursor: "pointer" }}
                onClick={() => handleVoucherClick(voucher)}
              >
                <CardContent>
                  <Typography variant="h6">{voucher.name}</Typography>
                  <Typography>ID {voucher.id}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    R{(voucher.amount / 100).toFixed(2)}
                  </Typography>
                  <Typography>
                    {voucher.vendorId === "11" ? "OTT" : "Mobile"}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {/* Voucher Sale Modal */}
      <Dialog
        open={showSaleModal}
        onClose={closeSaleModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Sell Voucher</DialogTitle>
        <DialogContent>
          {selectedVoucher && (
            <>
              <Typography variant="h6">
                Product: {selectedVoucher.name}
              </Typography>
              <Typography variant="body1">
                Amount: R{(selectedVoucher.amount / 100).toFixed(2)}
              </Typography>

              <TextField
                fullWidth
                label="Enter Mobile Number"
                variant="outlined"
                margin="normal"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="0740123456"
              />

              {transactionStatus && (
                <Typography color={transactionStatus.success ? "green" : "red"}>
                  {transactionStatus.message}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSaleModal}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={sellVoucher}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Confirm Sale"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* OTT Modal */}
      <Dialog
        open={showOTTModal}
        onClose={() => setShowOTTModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>OTT Voucher</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Balance: R{balance}
              </Typography>
              <Grid
                container
                spacing={2}
                sx={{ mt: 2, justifyContent: "center" }}
              >
                {amounts.map((amount) => (
                  <Grid item xs={6} sm={3} key={amount}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 2,
                      }}
                      onClick={() =>
                        setConfirmationAction(() => () => issueVoucher(amount))
                      }
                    >
                      <img
                        src="/images/ott_logo.png"
                        alt="OTT Logo"
                        style={{ height: 40, width: "auto", marginBottom: 5 }}
                      />
                      <Typography variant="h6">R{amount}</Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <TextField
                fullWidth
                label="Enter Custom Amount"
                variant="outlined"
                sx={{ mt: 2 }}
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  setCustomAmount(""); // ✅ Reset input before setting confirmation
                  setConfirmationAction(
                    () => () => issueVoucher(parseFloat(customAmount) || 0),
                  );
                }}
              >
                Confirm Custom Amount
              </Button>

              {voucherResponse && (
                <div>
                  <Typography variant="h6">Voucher Details:</Typography>
                  <Typography>
                    Voucher ID: {voucherResponse.voucher?.voucherID || "N/A"}
                  </Typography>
                  <Typography>
                    PIN: {voucherResponse.voucher?.pin || "N/A"}
                  </Typography>
                  <Typography>
                    Serial Number:{" "}
                    {voucherResponse.voucher?.serialNumber || "N/A"}
                  </Typography>
                  <Typography>
                    Sale ID: {voucherResponse.voucher?.saleID || "N/A"}
                  </Typography>
                  <Typography>
                    Amount: R{voucherResponse.voucher?.amount || "N/A"}
                  </Typography>
                </div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOTTModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Prompt */}
      <Dialog
        open={Boolean(confirmationAction)}
        onClose={() => setConfirmationAction(null)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to proceed?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationAction(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (confirmationAction) confirmationAction();
              setConfirmationAction(null);
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TerminalDashboard;
