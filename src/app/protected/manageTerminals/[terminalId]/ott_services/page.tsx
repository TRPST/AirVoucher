"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import axios from "axios";
import crypto from "crypto";
import { saveVoucherToDatabase } from "../../../../ott_actions";
import { useRouter } from "next/navigation";


const OTTVoucherManagement = () => {
  const { terminalId } = useParams(); // Extract terminal ID from the route
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
  const router = useRouter();

  // Navigate back to Terminal Management
  const navigateToTerminalManagement = () => {
    router.push("/protected/manageTerminals");
  };
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
          terminal_id: terminalId, // Add terminal ID
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
    <DefaultLayout>
      <div className="container mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={navigateToTerminalManagement}
          className="mb-6 w-full rounded-lg bg-gray-700 px-4 py-2 text-white shadow-lg hover:bg-gray-800 md:w-auto"
        >
          Back to Terminal Management
        </button>

        {/* Page Header */}
        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          OTT Voucher Management - Terminal {terminalId}
        </h2>

        {/* Sections */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Balance Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-700">
              Check Balance
            </h3>
            <button
              onClick={fetchBalance}
              className={`w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 ${
                loading === "balance" && "cursor-not-allowed opacity-50"
              }`}
              disabled={loading === "balance"}
            >
              {loading === "balance" ? "Loading..." : "Fetch Balance"}
            </button>
            {balanceResponse && (
              <div className="mt-4 rounded-lg bg-gray-100 p-4">
                <h4 className="font-semibold text-gray-700">Balance:</h4>
                <p className="text-gray-600">{balanceResponse}</p>
              </div>
            )}
          </div>

          {/* Issue Voucher Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-700">
              Issue Voucher
            </h3>
            <input
              type="text"
              name="branch"
              value={voucherDetails.branch}
              onChange={handleInputChange}
              placeholder="Branch Code"
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="number"
              name="value"
              value={voucherDetails.value}
              onChange={handleInputChange}
              placeholder="Voucher Value"
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex gap-4">
              <button
                onClick={issueVoucher}
                className={`w-full rounded-lg bg-green-500 py-2 text-white hover:bg-green-600 ${
                  loading === "voucher" && "cursor-not-allowed opacity-50"
                }`}
                disabled={loading === "voucher"}
              >
                {loading === "voucher" ? "Processing..." : "Issue Voucher"}
              </button>
              <button
                onClick={resetForm}
                className="w-full rounded-lg bg-gray-500 py-2 text-white hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
            {uniqueReference && (
              <p className="mt-4 text-sm text-gray-600">
                <strong>Reference:</strong> {uniqueReference}
              </p>
            )}
            {voucherResponse && (
              <div className="mt-4 rounded-lg bg-gray-100 p-4">
                <h4 className="font-semibold text-gray-700">
                  Voucher Response:
                </h4>
                {voucherResponse.success ? (
                  <>
                    <p>
                      <strong>ID:</strong> {voucherResponse.voucher?.voucherID}
                    </p>
                    <p>
                      <strong>Sale ID:</strong>{" "}
                      {voucherResponse.voucher?.saleID}
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
                  <p className="text-red-600">{voucherResponse.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Manage Voucher Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-700">
              Manage Voucher
            </h3>
            <input
              type="text"
              value={manageReference}
              onChange={(e) => setManageReference(e.target.value)}
              placeholder="Voucher Reference"
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex flex-col gap-4">
              <button
                onClick={checkVoucher}
                className={`rounded-lg bg-yellow-500 py-2 text-white hover:bg-yellow-600 ${
                  loading === "check" && "cursor-not-allowed opacity-50"
                }`}
                disabled={loading === "check"}
              >
                {loading === "check" ? "Checking..." : "Check Voucher"}
              </button>
              <button
                onClick={confirmVoucher}
                className={`rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 ${
                  loading === "confirm" && "cursor-not-allowed opacity-50"
                }`}
                disabled={loading === "confirm"}
              >
                {loading === "confirm" ? "Confirming..." : "Confirm Voucher"}
              </button>
              <button
                onClick={rejectVoucher}
                className={`rounded-lg bg-red-500 py-2 text-white hover:bg-red-600 ${
                  loading === "reject" && "cursor-not-allowed opacity-50"
                }`}
                disabled={loading === "reject"}
              >
                {loading === "reject" ? "Rejecting..." : "Reject Voucher"}
              </button>
            </div>
            {checkResponse && (
              <div className="mt-4 rounded-lg bg-gray-100 p-4">
                <h4 className="font-semibold text-gray-700">
                  Check Voucher Response:
                </h4>
                {checkResponse.success ? (
                  <>
                    <p>
                      <strong>ID:</strong> {checkResponse.voucher?.voucherID}
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
                  <p className="text-red-600">{checkResponse.message}</p>
                )}
              </div>
            )}
            {confirmResponse && (
              <div className="mt-4 rounded-lg bg-gray-100 p-4">
                <h4 className="font-semibold text-gray-700">
                  Confirm Voucher Response:
                </h4>
                <p>{confirmResponse.message}</p>
              </div>
            )}
            {rejectResponse && (
              <div className="mt-4 rounded-lg bg-gray-100 p-4">
                <h4 className="font-semibold text-gray-700">
                  Reject Voucher Response:
                </h4>
                <p>{rejectResponse.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OTTVoucherManagement;