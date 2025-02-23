"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconButton,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import ProviderSelection from "./ProviderSelection";
import ServiceSelection from "./ServiceSelection";
import VoucherList from "./VoucherList";
import SaleModal from "./SaleModal";
import OTTModal from "./OTTModal";
import ConfirmationDialog from "./ConfirmationDialog";
import { supabase } from "../../../../../utils/supabase/client"; // ✅ Use shared Supabase client
import issueVoucher from "./OTTModal"; // ✅ Import fetchVouchers and issueVoucher from ./api
import TerminalBalances from "./components/TerminalBalances";

const TerminalDashboard = () => {
  const { terminalId } = useParams();
  const router = useRouter();

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showOTTModal, setShowOTTModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    (() => void) | null
  >(null);
  const [commGroupId, setCommGroupId] = useState(null);
  const [lastSync, setLastSync] = useState(new Date());

  // Fetch the commission group ID for the terminal
  useEffect(() => {
    const fetchTerminalData = async () => {
      setLoading(true);
      setError(null);

      console.log(`Fetching terminal data for Terminal ID: ${terminalId}`);

      const { data: terminal, error: terminalError } = await supabase
        .from("terminals")
        .select("comm_group_id")
        .eq("id", terminalId)
        .single();

      if (terminalError) {
        console.error("Error fetching terminal data:", terminalError);
        setError("Error fetching terminal data.");
      } else {
        console.log("Fetched Terminal Data:", terminal);
        setCommGroupId(terminal?.comm_group_id);
      }
      setLoading(false);
    };

    if (terminalId) fetchTerminalData();
  }, [terminalId]);

  // Navigate back to Terminal Management
  const navigateToTerminalManagement = () => {
    router.push("/protected/manageTerminals");
  };

  // Handle provider selection
  const handleProviderSelection = (provider: string) => {
    setSelectedProvider(provider);
    setSelectedService(null);
    setVouchers([]);
    if (provider === "OTT") setShowOTTModal(true);
  };

  // Handle service selection and fetch vouchers
  const handleServiceSelection = async (service: string) => {
    setSelectedService(service);
    setLoading(true);

    try {
      console.log(
        `Fetching vouchers for Provider: ${selectedProvider}, Service: ${service}, CommGroupId: ${commGroupId}`,
      );

      if (!commGroupId) {
        throw new Error("Error: comm_group_id is missing!");
      }

      const { data: fetchedVouchers, error: voucherError } = await supabase
        .from("mobile_data_vouchers")
        .select("*")
        .eq("comm_group_id", commGroupId)
        .eq("supplier_name", selectedProvider)
        .eq("category", service);

      if (voucherError) {
        console.error("Error fetching vouchers:", voucherError);
        throw new Error("Error fetching vouchers.");
      }

      console.log("Fetched Vouchers:", fetchedVouchers);
      setVouchers(fetchedVouchers);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // New state for balances
  const [balances, setBalances] = useState({
    balance: 1000,
    credit: 200,
    balanceDue: 0,
  });

  const handleRefreshBalances = async () => {
    setLoading(true);
    // try {
    //   const analytics = await getSalesAnalyticsAction(terminalId as string);
    //   setBalances({
    //     balance: analytics.totalRevenue || 0,
    //     credit: 1000,
    //     balanceDue: analytics.totalRevenue * 0.1 || 0,
    //   });
    //   setLastSync(new Date());
    // } catch (err: unknown) {
    //   if (err instanceof Error) {
    //     setError(err.message);
    //   } else {
    //     setError("An unknown error occurred");
    //   }
    // } finally {
    //   setLoading(false);
    // }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <IconButton color="primary" onClick={navigateToTerminalManagement}>
            <WestIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Terminal {terminalId}
          </h2>
          {/* <SyncIndicator lastSync={lastSync} /> */}
        </div>
        <button
          // onClick={handleAnalytics}
          className="rounded-lg border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700"
        >
          Sales Analytics
        </button>
      </div>

      <TerminalBalances
        {...balances}
        lastUpdated={lastSync}
        onRefresh={handleRefreshBalances}
        isLoading={loading}
      />

      {/* Provider Selection */}
      <ProviderSelection
        selectedProvider={selectedProvider}
        onSelect={handleProviderSelection}
      />

      {/* Service Selection */}
      {selectedProvider && selectedProvider !== "OTT" && (
        <ServiceSelection
          selectedProvider={selectedProvider}
          selectedService={selectedService}
          onSelect={handleServiceSelection}
          terminalId={terminalId}
          commGroupId={commGroupId} // ✅ Pass commGroupId to ServiceSelection
        />
      )}

      {/* Loading and Error Handling */}
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {/* Display Voucher List */}
      {selectedService && (
        <VoucherList
          vouchers={vouchers}
          onSelect={(voucher: any) => {
            setSelectedVoucher(voucher);
            setShowSaleModal(true);
          }}
        />
      )}

      {/* Modals */}
      <SaleModal
        open={showSaleModal}
        onClose={() => setShowSaleModal(false)}
        voucher={selectedVoucher}
      />
      <OTTModal open={showOTTModal} onClose={() => setShowOTTModal(false)} />
      <ConfirmationDialog
        open={Boolean(confirmationAction)}
        onConfirm={confirmationAction}
        onClose={() => setConfirmationAction(null)}
      />
    </div>
  );
};

export default TerminalDashboard;
