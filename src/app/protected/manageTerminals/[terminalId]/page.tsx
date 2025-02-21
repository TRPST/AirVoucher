// app/protected/manageTerminals/[terminalID]/page.tsx
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
import TerminalBalances from "./components/TerminalBalances";
import TerminalHeader from "./components/TerminalHeader";
import TransactionHistoryButton from "./components/TransactionHistoryButton";
import ProviderSelection from "./ProviderSelection";
import ServiceSelection from "./ServiceSelection";
import VoucherList from "./VoucherList";
import SaleModal from "./SaleModal";
import OTTModal from "./OTTModal";
import ConfirmationDialog from "./ConfirmationDialog";
import { getSalesAnalyticsAction } from "@/app/ott_actions";
import SyncIndicator from "./components/SyncIndicator";

// Add types for vouchers and providers
interface ServiceSelectionProps {
  selectedProvider: string | null;
  selectedService: string | null;
  onSelect: (service: string) => Promise<void>;
}

interface Voucher {
  id: string;
  amount: number;
  // Add other voucher properties needed
}

type Provider = string;
type Service = string;

export default function Page() {
  const { terminalId } = useParams();
  const router = useRouter();

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showOTTModal, setShowOTTModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    (() => void) | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSync, setLastSync] = useState(new Date());

  // New state for balances
  const [balances, setBalances] = useState({
    balance: 1000,
    credit: 200,
    balanceDue: 0,
  });

  // Navigate back to Terminal Management
  const navigateToTerminalManagement = () => {
    router.push("/protected/manageTerminals");
  };

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

  useEffect(() => {
    handleRefreshBalances();
  }, [terminalId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter vouchers based on search query
  };

  const handleAnalytics = () => {
    // Implement analytics view
  };

  const handleTransactionHistory = () => {
    // Implement transaction history view
  };

  const handleProviderSelection = (provider: Provider) => {
    setSelectedProvider(provider);
    setSelectedService(null);
    setVouchers([]);
    if (provider === "OTT") setShowOTTModal(true);
  };

  const handleServiceSelection = async (service: Service) => {
    setSelectedService(service);
    setLoading(true);
    try {
      // Implement fetchVouchers or remove if not needed
      const fetchedVouchers = await Promise.resolve([]); // Temporary placeholder
      setVouchers(fetchedVouchers);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
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
          <SyncIndicator lastSync={lastSync} />
        </div>
        <button
          onClick={handleAnalytics}
          className="rounded-lg border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700"
        >
          Sales Analytics
        </button>
      </div>

      {/* <TerminalHeader
        terminalId={terminalId as string}
        lastSync={lastSync}
        onSearch={handleSearch}
        onAnalytics={handleAnalytics}
      /> */}

      <TerminalBalances
        {...balances}
        lastUpdated={lastSync}
        onRefresh={handleRefreshBalances}
        isLoading={loading}
      />

      <div className="mt-8">
        <ProviderSelection
          selectedProvider={selectedProvider}
          onSelect={handleProviderSelection}
        />

        {selectedProvider && selectedProvider !== "OTT" && (
          <ServiceSelection
            selectedProvider={selectedProvider}
            selectedService={selectedService}
            onSelect={handleServiceSelection}
          />
        )}

        {loading && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        )}

        {error && <div className="text-red-500">{error}</div>}

        {selectedService && (
          <VoucherList
            vouchers={vouchers}
            onSelect={(voucher: Voucher) => {
              setSelectedVoucher(voucher);
              setShowSaleModal(true);
            }}
          />
        )}
      </div>

      {/* <TransactionHistoryButton onClick={handleTransactionHistory} /> */}

      <SaleModal
        open={showSaleModal}
        onClose={() => setShowSaleModal(false)}
        voucher={selectedVoucher}
      />

      <OTTModal
        open={showOTTModal}
        onClose={() => setShowOTTModal(false)}
        onIssueVoucher={async (amount) => {
          // Handle OTT voucher issuance
          console.log("Issuing OTT voucher for amount:", amount);
          // Add your voucher issuance logic here
          return Promise.resolve(); // Return a Promise to match the expected type
        }}
      />

      <ConfirmationDialog
        open={Boolean(confirmationAction)}
        onConfirm={confirmationAction}
        onClose={() => setConfirmationAction(null)}
      />
    </div>
  );
}
