"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import axios from "axios";
import crypto from "crypto";
import { saveVoucherToDatabase } from "../../../../ott_actions";

const OTTVoucherManagement = () => {
  const BASE_URL = "/api"; // Use the rewrite proxy
  const username = "AIRVOUCHER";
  const password = "v95Hp_#kc+";
  const apiKey = "b39abd74-534c-44dc-a8ba-62a89dc8d31c";

  const [voucherDetails, setVoucherDetails] = useState({
    branch: "",
    cashier: "",
    mobileForSMS: "",
    till: "",
    value: "",
  });
  const [uniqueReference, setUniqueReference] = useState("");
  const [balanceResponse, setBalanceResponse] = useState<string | null>(null);
  const [voucherResponse, setVoucherResponse] = useState<any>(null);
  const [checkResponse, setCheckResponse] = useState<any>(null);
  const [confirmResponse, setConfirmResponse] = useState<any>(null);
  const [rejectResponse, setRejectResponse] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [manageReference, setManageReference] = useState("");

  // Helper function to generate a unique reference
  const generateUniqueReference = () =>
    `ref-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

  // Helper function to generate the hash
  const generateHash = (params: { [key: string]: string }) => {
    const sortedKeys = Object.keys(params).sort();
    const concatenatedString = [
      apiKey,
      ...sortedKeys.map((key) => params[key]),
    ].join("");
    return crypto.createHash("sha256").update(concatenatedString).digest("hex");
  };

  // Helper function to get auth headers
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

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setVoucherDetails({ ...voucherDetails, [name]: value });
  };

  // API Call: GetBalance
  const fetchBalance = async () => {
    setLoading("balance");
    const uniqueReference = generateUniqueReference();

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
      setBalanceResponse(res.data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalanceResponse("Error fetching balance");
    } finally {
      setLoading(null);
    }
  };

  const issueVoucher = async () => {
    setLoading("voucher");
    const { branch, cashier, mobileForSMS, till, value } = voucherDetails;
    const newUniqueReference = generateUniqueReference();
    setUniqueReference(newUniqueReference);

    if (!branch || !value) {
      setVoucherResponse({
        success: false,
        message: "Branch and value are required.",
      });
      setLoading(null);
      return;
    }

    const params = {
      branch,
      cashier: cashier || "",
      mobileForSMS: mobileForSMS || "",
      till: till || "",
      uniqueReference: newUniqueReference,
      value,
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
          timeout: 10000, // 10 seconds timeout
        },
      );

      if (res.data.success === "true") {
        const voucherData = JSON.parse(res.data.voucher);

        // Save voucher to Supabase
        const saveResponse = await saveVoucherToDatabase({
          voucher_id: voucherData.voucherID,
          sale_id: voucherData.saleID,
          pin: voucherData.pin,
          amount: parseFloat(voucherData.amount), // Convert to number
        });

        if (saveResponse.success) {
          console.log("Voucher saved to database:", saveResponse.data);
        } else {
          console.error("Failed to save voucher:", saveResponse.message);
        }

        setVoucherResponse({
          success: true,
          voucher: voucherData,
        });
      } else {
        const errorMessage = getErrorMessage(res.data.errorCode);
        setVoucherResponse({
          success: false,
          errorCode: res.data.errorCode,
          message: errorMessage,
        });
      }
    } catch (error) {
      setVoucherResponse({
        success: false,
        message:
          (axios.isAxiosError(error) && error.response?.data?.message) ||
          "An error occurred",
      });
    } finally {
      setLoading(null);
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
      <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        OTT Voucher Management
      </h2>

      {/* Balance Section */}
      <div className="mb-6">
        <h3 className="mb-4 text-xl font-semibold">Check Balance</h3>
        <button
          onClick={fetchBalance}
          className={`rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${
            loading === "balance" ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={loading === "balance"}
        >
          {loading === "balance" ? "Loading..." : "Fetch Balance"}
        </button>
        {balanceResponse && (
          <div className="mt-4 rounded bg-gray-100 p-4">
            <h4 className="font-semibold">Balance Response:</h4>
            <p>{balanceResponse}</p>
          </div>
        )}
      </div>

      {/* Issue Voucher Section */}
      <div className="mb-6">
        <h3 className="mb-4 text-xl font-semibold">Issue Voucher</h3>
        <input
          type="text"
          name="branch"
          value={voucherDetails.branch}
          onChange={handleInputChange}
          placeholder="Branch Code"
          className="mb-4 w-full rounded border p-2"
        />
        <input
          type="text"
          name="value"
          value={voucherDetails.value}
          onChange={handleInputChange}
          placeholder="Voucher Value"
          className="mb-4 w-full rounded border p-2"
        />
        <button
          onClick={issueVoucher}
          className={`rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 ${
            loading === "voucher" ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={loading === "voucher"}
        >
          {loading === "voucher" ? "Processing..." : "Issue Voucher"}
        </button>
        {uniqueReference && (
          <p className="mt-4">
            <strong>Unique Reference:</strong> {uniqueReference}
          </p>
        )}
        {voucherResponse && (
          <div className="mt-4 rounded bg-gray-100 p-4">
            <h4 className="font-semibold">Voucher Response:</h4>
            {voucherResponse.success ? (
              <>
                <p>
                  <strong>Voucher ID:</strong>{" "}
                  {voucherResponse.voucher?.voucherID}
                </p>
                <p>
                  <strong>Sale ID:</strong> {voucherResponse.voucher?.saleID}
                </p>
                <p>
                  <strong>PIN:</strong>{" "}
                  <span className="font-bold text-blue-700">
                    {voucherResponse.voucher?.pin}
                  </span>
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  <span className="font-bold text-green-700">
                    {voucherResponse.voucher?.amount}
                  </span>
                </p>
              </>
            ) : (
              <p>{voucherResponse.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Manage Voucher Section */}
      <div>
        <h3 className="mb-4 text-xl font-semibold">Manage Voucher</h3>
        <input
          type="text"
          value={manageReference}
          onChange={(e) => setManageReference(e.target.value)}
          placeholder="Enter Voucher Reference"
          className="mb-4 w-full rounded border p-2"
        />
        <div className="flex space-x-4">
          <button
            onClick={checkVoucher}
            className={`rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 ${
              loading === "check" ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading === "check"}
          >
            {loading === "check" ? "Checking..." : "Check Voucher"}
          </button>
          <button
            onClick={confirmVoucher}
            className={`rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${
              loading === "confirm" ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading === "confirm"}
          >
            {loading === "confirm" ? "Confirming..." : "Confirm Voucher"}
          </button>
          <button
            onClick={rejectVoucher}
            className={`rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 ${
              loading === "reject" ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading === "reject"}
          >
            {loading === "reject" ? "Rejecting..." : "Reject Voucher"}
          </button>
        </div>
        {checkResponse && (
          <div className="mt-4 rounded bg-gray-100 p-4">
            <h4 className="font-semibold">Check Voucher Response:</h4>
            {checkResponse.success ? (
              <>
                <p>
                  <strong>Voucher ID:</strong>{" "}
                  {checkResponse.voucher?.voucherID}
                </p>
                <p>
                  <strong>Sale ID:</strong> {checkResponse.voucher?.saleID}
                </p>
                <p>
                  <strong>PIN:</strong>{" "}
                  <span className="font-bold text-blue-700">
                    {checkResponse.voucher?.pin}
                  </span>
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  <span className="font-bold text-green-700">
                    {checkResponse.voucher?.amount}
                  </span>
                </p>
              </>
            ) : (
              <p>{checkResponse.message}</p>
            )}
          </div>
        )}
        {confirmResponse && (
          <div className="mt-4 rounded bg-gray-100 p-4">
            <h4 className="font-semibold">Confirm Voucher Response:</h4>
            <p>{confirmResponse.message}</p>
          </div>
        )}
        {rejectResponse && (
          <div className="mt-4 rounded bg-gray-100 p-4">
            <h4 className="font-semibold">Reject Voucher Response:</h4>
            <p>{rejectResponse.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTTVoucherManagement;
