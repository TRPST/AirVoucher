"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconButton,
  Typography,
  Button,
  CircularProgress,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import ProviderSelection from "./ProviderSelection";
import ServiceSelection from "./ServiceSelection";
import UnifiedVoucherList from "./UnifiedVoucherList";
import SaleModal from "./SaleModal";
import OTTModal from "./OTTModal";
import ConfirmationDialog from "./ConfirmationDialog";
import { supabase } from "../../../../../utils/supabase/client"; // ✅ Use shared Supabase client
import issueVoucher from "./OTTModal"; // ✅ Import fetchVouchers and issueVoucher from ./api
import TerminalBalances from "./components/TerminalBalances";
import ElectricityModal from "./ElectricityModal";
import DSTVModal from "./DSTVModal";

// Add global style for dark mode text
const globalStyle = `
  @media (prefers-color-scheme: dark) {
    body.dark, .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6, .dark p, .dark span {
      color: white !important;
    }
  }
`;

// Provider color scheme function
const getProviderColors = (isDark: boolean) => ({
  MTN: {
    light: "rgba(255, 204, 0, 0.15)",
    dark: "rgba(255, 204, 0, 0.25)",
    border: "rgb(255, 204, 0)",
    text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  Vodacom: {
    light: "rgba(255, 0, 0, 0.15)",
    dark: "rgba(255, 0, 0, 0.25)",
    border: "rgb(255, 0, 0)",
    text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  CellC: {
    light: "rgba(0, 0, 0, 0.15)",
    dark: "rgba(255, 255, 255, 0.25)",
    border: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
    text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  Telkom: {
    light: "rgba(0, 102, 204, 0.15)",
    dark: "rgba(0, 102, 204, 0.25)",
    border: "rgb(0, 102, 204)",
    text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  OTT: {
    light: "rgba(0, 128, 0, 0.15)",
    dark: "rgba(0, 128, 0, 0.12)",
    border: "rgb(0, 128, 0)",
  },
  Hollywoodbets: {
    light: "rgba(128, 0, 128, 0.15)",
    dark: "rgba(128, 0, 128, 0.25)",
    border: "rgb(128, 0, 128)",
    text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  Ringa: {
    light: "rgba(255, 165, 0, 0.15)",
    dark: "rgba(255, 165, 0, 0.25)",
    border: "rgb(255, 165, 0)",
    text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  Easyload: {
    light: "rgba(218, 165, 32, 0.15)",
    dark: "rgba(218, 165, 32, 0.25)",
    border: "rgb(218, 165, 32)",
    text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
});

// Add type definitions for all component props
interface BalanceProps {
  terminalId: string;
  onRefresh: () => Promise<void>;
  lastSync: Date;
}

interface ProviderSelectionProps {
  selectedProvider: string;
  onSelect: (provider: string, requiresServiceSelection?: boolean) => void;
  providerColors: {
    [key: string]: {
      light: string;
      dark: string;
      border: string;
      text: string;
    };
  };
}

interface ServiceSelectionProps {
  selectedProvider: string;
  selectedService: string;
  onSelect: (service: string) => Promise<void>;
  terminalId: string;
  commGroupId: string;
}

interface OTTModalProps {
  open: boolean;
  onClose: () => void;
  provider: string | null;
  service: string | null;
  terminalId: string;
  assignedRetailerId: string | null;
}

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const TerminalDashboard = () => {
  const { terminalId } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const providerColors = getProviderColors(isDark);

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [requiresServiceSelection, setRequiresServiceSelection] =
    useState<boolean>(true);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [showOTTModal, setShowOTTModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    (() => void) | null
  >(null);
  const [commGroupId, setCommGroupId] = useState(null);
  const [lastSync, setLastSync] = useState(new Date());
  const [isElectricityModalOpen, setIsElectricityModalOpen] = useState(false);
  const [isDSTVModalOpen, setIsDSTVModalOpen] = useState(false);
  const [assignedRetailerId, setAssignedRetailerId] = useState<string | null>(
    null,
  );

  // Fetch the commission group ID for the terminal
  useEffect(() => {
    const fetchTerminalData = async () => {
      setLoading(true);
      setError(null);

      console.log(`Fetching terminal data for Terminal ID: ${terminalId}`);

      const { data: terminal, error: terminalError } = await supabase
        .from("terminals")
        .select("comm_group_id, assigned_retailer")
        .eq("id", terminalId)
        .single();

      if (terminalError) {
        console.error("Error fetching terminal data:", terminalError);
        setError("Error fetching terminal data.");
      } else {
        console.log("Fetched Terminal Data:", terminal);
        setCommGroupId(terminal?.comm_group_id);
        setAssignedRetailerId(terminal?.assigned_retailer || null);
      }
      setLoading(false);
    };

    if (terminalId) fetchTerminalData();
  }, [terminalId]);

  // Add test check for any vouchers in database
  useEffect(() => {
    const testFetchVouchers = async () => {
      try {
        console.log("🧪 TEST: Checking if any vouchers exist in the database");
        const { data: testVouchers, error: testError } = await supabase
          .from("mobile_data_vouchers")
          .select("*")
          .limit(20);

        if (testError) {
          console.error("❌ TEST: Error checking vouchers:", testError);
        } else if (testVouchers && testVouchers.length > 0) {
          console.log(
            `✅ TEST: Found ${testVouchers.length} vouchers in database:`,
            testVouchers,
          );
        } else {
          console.warn("⚠️ TEST: No vouchers found in the database");
        }
      } catch (err) {
        console.error("❌ TEST: Unexpected error checking vouchers:", err);
      }
    };

    testFetchVouchers();
  }, [supabase]);

  // Navigate back to Terminal Management
  const navigateToTerminalManagement = () => {
    router.push("/protected/manageTerminals");
  };

  // Helper function to get network name from vendorId
  const getNetworkNameFromVendorId = (vendorId: string): string => {
    const vendorIdLower = vendorId.toLowerCase();
    switch (vendorIdLower) {
      case "mtn":
        return "MTN";
      case "vodacom":
        return "Vodacom";
      case "cellc":
        return "CellC";
      case "telkom":
        return "Telkom";
      default:
        return (
          vendorId.charAt(0).toUpperCase() + vendorId.slice(1).toLowerCase()
        );
    }
  };

  // Process vouchers to enhance display info
  const enhanceVouchers = (vouchers: any[]): any[] => {
    return vouchers.map((voucher) => {
      const enhancedVoucher = { ...voucher };

      // Add network name for Glocell vouchers
      if (voucher.supplier_name === "Glocell" && voucher.vendorId) {
        enhancedVoucher.networkName = getNetworkNameFromVendorId(
          voucher.vendorId,
        );
      }

      // Add formatted amount (convert from cents to rand)
      if (voucher.amount) {
        const amountNumber = parseInt(voucher.amount, 10);
        if (!isNaN(amountNumber)) {
          enhancedVoucher.formattedAmount = `R${(amountNumber / 100).toFixed(2)}`;
        }
      }

      return enhancedVoucher;
    });
  };

  // For providers that don't need service selection
  const fetchVouchersForProvider = async (provider: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 Fetching vouchers directly for provider: ${provider}`);

      // For telecom providers (MTN, Vodacom, CellC, Telkom), check vendorId
      const isTelecomProvider = ["MTN", "Vodacom", "CellC", "Telkom"].includes(
        provider,
      );
      const nonCommVouchers = ["Hollywoodbets", "Ringa", "Easyload"]; // These providers have their own comm structure

      let query;
      if (isTelecomProvider) {
        // For telecom providers, filter by Glocell supplier_name and vendorId
        const vendorId = provider.toLowerCase(); // Convert to lowercase to match database values
        query = supabase
          .from("mobile_data_vouchers")
          .select("*")
          .eq("supplier_name", "Glocell")
          .eq("vendorId", vendorId);

        // Add comm group filter if available
        if (commGroupId) {
          query = query.eq("comm_group_id", commGroupId);
        }
      } else {
        // For non-telecom providers, filter by supplier_name directly
        query = supabase
          .from("mobile_data_vouchers")
          .select("*")
          .eq("supplier_name", provider);

        // Add comm group filter ONLY if not a special non-comm provider
        if (commGroupId && !nonCommVouchers.includes(provider)) {
          query = query.eq("comm_group_id", commGroupId);
        }
      }

      // Execute the query
      const { data: providerVouchers, error: providerError } = await query;

      if (providerError) {
        console.error(
          `❌ Error fetching vouchers for ${provider}:`,
          providerError,
        );
        setError(`Error fetching vouchers: ${providerError.message}`);
        setVouchers([]);
      } else {
        console.log(
          `✅ Fetched ${providerVouchers?.length || 0} vouchers for ${provider}`,
          providerVouchers,
        );

        // Enhance vouchers with additional display info
        const enhancedVouchers = enhanceVouchers(providerVouchers || []);
        setVouchers(enhancedVouchers);
      }
    } catch (err) {
      console.error(
        `❌ Unexpected error fetching vouchers for ${provider}:`,
        err,
      );
      setError("An unexpected error occurred while fetching vouchers.");
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  // For telecom providers that need service selection
  const handleServiceSelection = async (service: string) => {
    setSelectedService(service);
    setSelectedVoucher(null);
    setShowOTTModal(false);

    // Handle special services that don't use vouchers
    if (service === "Electricity" || service === "DSTV" || service === "Dstv") {
      if (service === "Electricity") {
        setIsElectricityModalOpen(true);
      } else {
        setIsDSTVModalOpen(true);
      }
      return; // Return early to prevent any voucher-related logic
    }

    // For all other services, proceed with voucher fetching
    setLoading(true);
    setError(null);

    try {
      console.log(
        `🔍 Page component: Fetching vouchers for Provider: ${selectedProvider}, Service: ${service}, CommGroupId: ${commGroupId}`,
      );

      const isTelecomProvider = ["MTN", "Vodacom", "CellC", "Telkom"].includes(
        selectedProvider || "",
      );
      const nonCommVouchers = ["Hollywoodbets", "Ringa", "Easyload"]; // These providers have their own comm structure

      let query;

      // Debug: Check if there are any vouchers in the table
      const { data: anyVouchers } = await supabase
        .from("mobile_data_vouchers")
        .select("*")
        .limit(10);
      console.log(
        `DEBUG: Any vouchers in the table: ${anyVouchers?.length || 0}`,
        anyVouchers,
      );

      if (isTelecomProvider) {
        const vendorId = selectedProvider?.toLowerCase(); // Convert to lowercase to match database values

        // Debug: Check if there are any matching provider vouchers
        const { data: debugProviderVouchers } = await supabase
          .from("mobile_data_vouchers")
          .select("*")
          .eq("supplier_name", "Glocell")
          .eq("vendorId", vendorId);

        console.log(
          `DEBUG: Vouchers for ${selectedProvider}: ${debugProviderVouchers?.length || 0}`,
          debugProviderVouchers,
        );

        // Try original query with all filters
        query = supabase
          .from("mobile_data_vouchers")
          .select("*")
          .eq("supplier_name", "Glocell")
          .eq("vendorId", vendorId);

        // Add category filter if service is provided
        if (service) {
          query = query.eq("category", service.toLowerCase());
        }

        // Add comm group filter if available
        if (commGroupId) {
          query = query.eq("comm_group_id", commGroupId);
        }
      } else {
        // For non-telecom providers, filter by supplier_name directly
        query = supabase
          .from("mobile_data_vouchers")
          .select("*")
          .eq("supplier_name", selectedProvider);

        // Add category filter if service is provided
        if (service) {
          query = query.eq("category", service.toLowerCase());
        }

        // Add comm group filter ONLY if not a special non-comm provider
        if (
          commGroupId &&
          selectedProvider &&
          !nonCommVouchers.includes(selectedProvider)
        ) {
          query = query.eq("comm_group_id", commGroupId);
        }
      }

      // Execute the query
      const { data: fetchedVouchers, error: voucherError } = await query;

      if (voucherError) {
        console.error("❌ Error fetching vouchers:", voucherError);
        setError(`Error fetching vouchers: ${voucherError.message}`);
        setVouchers([]);
      } else {
        console.log(
          `✅ Page component: Fetched Vouchers with full filters: ${fetchedVouchers?.length || 0} vouchers found`,
        );

        // If no vouchers found with all filters, try just the provider filter
        if (!fetchedVouchers || fetchedVouchers.length === 0) {
          console.warn(
            "⚠️ No vouchers found with all filters, using just provider filter",
          );

          // Fetch vouchers with just provider filter as fallback
          if (isTelecomProvider && selectedProvider) {
            const vendorId = selectedProvider.toLowerCase();
            const { data: telecomVouchers } = await supabase
              .from("mobile_data_vouchers")
              .select("*")
              .eq("supplier_name", "Glocell")
              .eq("vendorId", vendorId)
              .limit(10);

            if (!telecomVouchers || telecomVouchers.length === 0) {
              console.warn("⚠️ No vouchers found at all");
              setVouchers([]);
            } else {
              // Enhance vouchers with additional display info
              const enhancedVouchers = enhanceVouchers(telecomVouchers || []);
              setVouchers(enhancedVouchers);
            }
          } else if (selectedProvider) {
            // Create fallback query with just supplier_name
            let fallbackQuery = supabase
              .from("mobile_data_vouchers")
              .select("*")
              .eq("supplier_name", selectedProvider);

            // Skip comm_group_id for special non-comm providers
            if (commGroupId && !nonCommVouchers.includes(selectedProvider)) {
              fallbackQuery = fallbackQuery.eq("comm_group_id", commGroupId);
            }

            // Execute the fallback query
            const { data: otherProviderVouchers } =
              await fallbackQuery.limit(10);

            if (!otherProviderVouchers || otherProviderVouchers.length === 0) {
              console.warn("⚠️ No vouchers found at all");
              setVouchers([]);
            } else {
              // Enhance vouchers with additional display info
              const enhancedVouchers = enhanceVouchers(
                otherProviderVouchers || [],
              );
              setVouchers(enhancedVouchers);
            }
          } else {
            setVouchers([]);
          }
        } else {
          // Enhance vouchers with additional display info
          const enhancedVouchers = enhanceVouchers(fetchedVouchers || []);
          setVouchers(enhancedVouchers);
        }
      }
    } catch (err) {
      console.error("❌ Unexpected error in handleServiceSelection:", err);
      setError("An unexpected error occurred while fetching vouchers.");
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle provider selection
  const handleProviderSelection = (
    provider: string,
    requiresServiceSelection: boolean = true,
  ) => {
    setSelectedProvider(provider);
    setSelectedService(null);
    setVouchers([]);
    setRequiresServiceSelection(requiresServiceSelection);

    // Handle special providers that show modals directly
    if (provider === "Electricity") {
      setIsElectricityModalOpen(true);
      return;
    } else if (provider === "DSTV" || provider === "Dstv") {
      setIsDSTVModalOpen(true);
      return;
    }

    // Handle OTT provider separately
    if (provider === "OTT" || (provider && provider.toUpperCase() === "OTT")) {
      setShowOTTModal(true);
      return;
    }

    // For providers that don't need service categorization, fetch vouchers directly
    if (!requiresServiceSelection) {
      setSelectedService("All");
      fetchVouchersForProvider(provider);
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

  // Add a function to handle voucher sales
  const handleVoucherSold = async () => {
    // Refresh vouchers after a sale
    setShowSaleModal(false);
    setSelectedVoucher(null);

    // Refresh vouchers based on current filters
    if (selectedProvider && selectedService) {
      setLoading(true);

      if (requiresServiceSelection) {
        await handleServiceSelection(selectedService);
      } else {
        await fetchVouchersForProvider(selectedProvider);
      }
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col p-4">
      <style>{globalStyle}</style>

      {/* Header Section */}
      <div className="bg-background sticky left-0 right-0 top-0 z-50 px-4 pb-4">
        <div className="mb-4 flex items-center">
          <IconButton
            onClick={navigateToTerminalManagement}
            className="mr-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            size="small"
          >
            <WestIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" component="h1">
            Terminal Dashboard
          </Typography>
        </div>

        {/* Terminal Balances */}
        <div className="w-full">
          <TerminalBalances
            available={balances.balance}
            credit={balances.credit}
            commission={balances.balanceDue}
            lastUpdated={lastSync}
            onRefresh={handleRefreshBalances}
            isLoading={loading}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-4">
        {/* Provider Selection */}
        <div className="mb-4">
          <ProviderSelection
            selectedProvider={selectedProvider || ""}
            onSelect={handleProviderSelection}
          />
        </div>

        {/* Service Selection */}
        {selectedProvider && requiresServiceSelection && (
          <div className="mb-4">
            <ServiceSelection
              selectedProvider={selectedProvider}
              selectedService={selectedService || ""}
              onSelect={handleServiceSelection}
              terminalId={terminalId as string}
              commGroupId={commGroupId || ""}
            />
          </div>
        )}

        {/* Voucher List */}
        {selectedProvider &&
          (!requiresServiceSelection || selectedService) &&
          selectedProvider !== "Electricity" &&
          selectedProvider !== "DSTV" &&
          selectedProvider !== "Dstv" && (
            <UnifiedVoucherList
              selectedProvider={selectedProvider}
              selectedService={selectedService || ""}
              terminalId={terminalId as string}
              commGroupId={commGroupId || ""}
              onSelect={(voucher) => {
                console.log("Selected voucher:", voucher);
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
          onVoucherSold={handleVoucherSold}
          assignedRetailerId={assignedRetailerId}
        />

        <OTTModal
          open={showOTTModal}
          onClose={() => setShowOTTModal(false)}
          provider={selectedProvider}
          service={selectedService}
          terminalId={terminalId as string}
          assignedRetailerId={assignedRetailerId}
        />

        <ConfirmationDialog
          open={!!confirmationAction}
          onClose={() => setConfirmationAction(null)}
          onConfirm={() => {
            if (confirmationAction) {
              confirmationAction();
              setConfirmationAction(null);
            }
          }}
          title="Confirm Action"
          subtitle="Please confirm"
          message="Are you sure you want to proceed with this action?"
        />

        {/* Special Service Modals */}
        <ElectricityModal
          open={isElectricityModalOpen}
          onClose={() => setIsElectricityModalOpen(false)}
        />
        <DSTVModal
          open={isDSTVModalOpen}
          onClose={() => setIsDSTVModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default TerminalDashboard;
