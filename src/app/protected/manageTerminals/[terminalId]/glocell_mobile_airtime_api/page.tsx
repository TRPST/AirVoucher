"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import axios from "axios";

const MobileAirtimeManagement = () => {
  const BASE_URL = "https://api.qa.bltelecoms.net/v2/trade";
  const API_KEY = "your-api-key"; // Replace with actual API key
  const BASIC_AUTH = "your-basic-auth"; // Replace with actual Basic Auth token

  const { terminalId } = useParams(); // Extract terminal ID from the route
  const [loading, setLoading] = useState<string | null>(null);
  const [hashResponse, setHashResponse] = useState<string | null>(null);
  const [vendResponse, setVendResponse] = useState<any>(null);
  const [productResponse, setProductResponse] = useState<any>([]);
  const [prevendResponse, setPrevendResponse] = useState<any>(null);
  const [saleResponse, setSaleResponse] = useState<any>(null);

  const [vendDetails, setVendDetails] = useState({
    mobileNumber: "",
    vendorId: "",
    amount: "",
  });

  const [prevendDetails, setPrevendDetails] = useState({
    mobileNumber: "",
    vendorId: "",
    amount: "",
  });

  const [saleDetails, setSaleDetails] = useState({
    mobileNumber: "",
    requestId: "",
  });

  const router = useRouter();

  const getAuthHeaders = () => ({
    Authorization: `Basic ${BASIC_AUTH}`,
    "x-api-key": API_KEY,
  });

  const fetchHash = async () => {
    setLoading("hash");
    try {
      const res = await axios.get(`${BASE_URL}/mobile/airtime/hashes`, {
        headers: getAuthHeaders(),
      });
      setHashResponse(res.data.complete);
    } catch (error) {
      console.error("Error fetching hash:", error);
      setHashResponse("Error fetching hash");
    } finally {
      setLoading(null);
    }
  };

  const fetchProducts = async () => {
    setLoading("products");
    try {
      const res = await axios.get(`${BASE_URL}/mobile/airtime/products`, {
        headers: getAuthHeaders(),
      });
      setProductResponse(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductResponse([]);
    } finally {
      setLoading(null);
    }
  };

  const prevendAirtime = async () => {
    setLoading("prevend");
    try {
      const { mobileNumber, vendorId, amount } = prevendDetails;
      const res = await axios.get(`${BASE_URL}/mobile/airtime/info`, {
        headers: getAuthHeaders(),
        params: { mobilenumber: mobileNumber, vendorid: vendorId, amount },
      });
      setPrevendResponse(res.data);
    } catch (error) {
      console.error("Error fetching prevend info:", error);
      setPrevendResponse(null);
    } finally {
      setLoading(null);
    }
  };

  const querySale = async () => {
    setLoading("sale");
    try {
      const { mobileNumber, requestId } = saleDetails;
      const res = await axios.get(`${BASE_URL}/mobile/airtime/sales`, {
        headers: getAuthHeaders(),
        params: { mobilenumber: mobileNumber, requestid: requestId },
      });
      setSaleResponse(res.data);
    } catch (error) {
      console.error("Error querying sale:", error);
      setSaleResponse(null);
    } finally {
      setLoading(null);
    }
  };

  const vendAirtime = async () => {
    setLoading("vend");
    try {
      const { mobileNumber, vendorId, amount } = vendDetails;
      const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
      const payload = {
        requestId,
        vendorId,
        mobileNumber,
        amount: parseInt(amount),
      };

      const res = await axios.post(
        `${BASE_URL}/mobile/airtime/sales`,
        payload,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        },
      );

      setVendResponse(res.data);
    } catch (error) {
      console.error("Error vending airtime:", error);
      setVendResponse(null);
    } finally {
      setLoading(null);
    }
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <button
          onClick={() => router.push("/protected/manageTerminals")}
          className="mb-6 w-full rounded-lg bg-gray-700 px-4 py-2 text-white shadow-lg hover:bg-gray-800 md:w-auto"
        >
          Back to Terminal Management
        </button>
        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          Mobile Airtime Management - Terminal {terminalId}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Query Hash</h3>
            <button
              onClick={fetchHash}
              className={`w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 ${
                loading === "hash" && "cursor-not-allowed opacity-50"
              }`}
              disabled={loading === "hash"}
            >
              {loading === "hash" ? "Fetching..." : "Fetch Hash"}
            </button>
            {hashResponse && (
              <p className="mt-4 text-gray-600">{hashResponse}</p>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Query Products</h3>
            <button
              onClick={fetchProducts}
              className={`w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 ${
                loading === "products" && "cursor-not-allowed opacity-50"
              }`}
              disabled={loading === "products"}
            >
              {loading === "products" ? "Fetching..." : "Fetch Products"}
            </button>
            {productResponse.length > 0 && (
              <ul className="mt-4 text-gray-600">
                {productResponse.map((product: any, idx: number) => (
                  <li key={idx}>{product.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Pre-Vend Airtime</h3>
            <input
              type="text"
              placeholder="Mobile Number"
              value={prevendDetails.mobileNumber}
              onChange={(e) =>
                setPrevendDetails({
                  ...prevendDetails,
                  mobileNumber: e.target.value,
                })
              }
              className="mb-4 w-full rounded-lg border px-4 py-2"
            />
            <input
              type="text"
              placeholder="Vendor ID"
              value={prevendDetails.vendorId}
              onChange={(e) =>
                setPrevendDetails({
                  ...prevendDetails,
                  vendorId: e.target.value,
                })
              }
              className="mb-4 w-full rounded-lg border px-4 py-2"
            />
            <input
              type="number"
              placeholder="Amount"
              value={prevendDetails.amount}
              onChange={(e) =>
                setPrevendDetails({ ...prevendDetails, amount: e.target.value })
              }
              className="mb-4 w-full rounded-lg border px-4 py-2"
            />
            <button
              onClick={prevendAirtime}
              className={`w-full rounded-lg bg-green-500 py-2 text-white hover:bg-green-600 ${
                loading === "prevend" && "cursor-not-allowed opacity-50"
              }`}
              disabled={loading === "prevend"}
            >
              {loading === "prevend" ? "Processing..." : "Pre-Vend"}
            </button>
            {prevendResponse && (
              <p className="mt-4 text-gray-600">
                Mobile Number: {prevendResponse.mobileNumber}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Query Sale</h3>
            <input
              type="text"
              placeholder="Mobile Number"
              value={saleDetails.mobileNumber}
              onChange={(e) =>
                setSaleDetails({ ...saleDetails, mobileNumber: e.target.value })
              }
              className="mb-4 w-full rounded-lg border px-4 py-2"
            />
            <input
              type="text"
              placeholder="Request ID"
              value={saleDetails.requestId}
              onChange={(e) =>
                setSaleDetails({ ...saleDetails, requestId: e.target.value })
              }
              className="mb-4 w-full rounded-lg border px-4 py-2"
            />
            <button
              onClick={querySale}
              className={`w-full rounded-lg bg-green-500 py-2 text-white hover:bg-green-600 ${
                loading === "sale" && "cursor-not-allowed opacity-50"
              }`}
              disabled={loading === "sale"}
            >
              {loading === "sale" ? "Querying..." : "Query Sale"}
            </button>
            {saleResponse && (
              <p className="mt-4 text-gray-600">
                Reference: {saleResponse.reference}
              </p>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default MobileAirtimeManagement;
