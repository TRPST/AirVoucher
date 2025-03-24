"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconButton,
  Typography,
  Button,
  CircularProgress,
  useTheme,
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
    dark: "rgba(255, 204, 0, 0.12)",
    border: "rgb(255, 204, 0)",
  },
  Vodacom: {
    light: "rgba(255, 0, 0, 0.15)",
    dark: "rgba(255, 0, 0, 0.12)",
    border: "rgb(255, 0, 0)",
  },
  CellC: {
    light: "rgba(0, 0, 0, 0.15)",
    dark: "rgba(255, 255, 255, 0.12)",
    border: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  Telkom: {
    light: "rgba(0, 102, 204, 0.15)",
    dark: "rgba(0, 102, 204, 0.12)",
    border: "rgb(0, 102, 204)",
  },
  OTT: {
    light: "rgba(0, 128, 0, 0.15)",
    dark: "rgba(0, 128, 0, 0.12)",
    border: "rgb(0, 128, 0)",
  },
  Hollywoodbets: {
    light: "rgba(128, 0, 128, 0.15)",
    dark: "rgba(128, 0, 128, 0.12)",
    border: "rgb(128, 0, 128)", // Purple
  },
  Ringa: {
    light: "rgba(255, 165, 0, 0.15)",
    dark: "rgba(255, 165, 0, 0.12)",
    border: "rgb(255, 165, 0)", // Orange
  },
  Easyload: {
    light: "rgba(218, 165, 32, 0.15)",
    dark: "rgba(218, 165, 32, 0.12)",
    border: "rgb(218, 165, 32)", // Golden
  },
});

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

    // Handle OTT provider separately - both from suppliers table and potential other forms of OTT
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
    <div className="container mx-auto p-6">
      {isDark && <style dangerouslySetInnerHTML={{ __html: globalStyle }} />}
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
          className="rounded-lg border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-700"
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
        selectedProvider={selectedProvider || ""}
        onSelect={handleProviderSelection}
      />

      {/* Service Selection - only show for providers that need service categorization */}
      {selectedProvider &&
        selectedProvider !== "OTT" &&
        requiresServiceSelection && (
        <ServiceSelection
          selectedProvider={selectedProvider}
            selectedService={selectedService || ""}
          onSelect={handleServiceSelection}
            terminalId={
              typeof terminalId === "string"
                ? terminalId
                : Array.isArray(terminalId)
                  ? terminalId[0]
                  : ""
            }
            commGroupId={commGroupId || ""}
        />
      )}

      {/* Loading and Error Handling */}
      {loading && (
        <div className="mt-6 flex flex-col items-center justify-center space-y-2">
          <CircularProgress />
          <Typography variant="body2" color="textSecondary">
            {selectedProvider && selectedService
              ? `Loading ${selectedProvider} ${selectedService} vouchers...`
              : "Loading..."}
          </Typography>
        </div>
      )}
      {error && (
        <Typography
          color="error"
          sx={{
            backgroundColor: isDark
              ? "rgba(211, 47, 47, 0.1)"
              : "rgba(211, 47, 47, 0.05)",
            p: 2,
            borderRadius: 1,
            color: isDark ? "#ff6b6b" : "error.main",
          }}
        >
          {error}
        </Typography>
      )}

      {/* Display Voucher List (only when service is selected and vouchers exist) */}
      {selectedService && vouchers && vouchers.length > 0 && (
        <div className="mt-6">
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              textAlign: "center",
              color: isDark ? "#ffffff" : "#333333",
              fontWeight: 600,
              background: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.02)",
              py: 1,
              borderRadius: 1,
              borderLeft: selectedProvider
                ? `4px solid ${providerColors[selectedProvider as keyof typeof providerColors]?.border || "#ccc"}`
                : "none",
              borderRight: selectedProvider
                ? `4px solid ${providerColors[selectedProvider as keyof typeof providerColors]?.border || "#ccc"}`
                : "none",
              boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
            }}
          >
            Available Vouchers ({vouchers.length})
          </Typography>
        <VoucherList
          vouchers={vouchers}
          onSelect={(voucher: any) => {
              console.log("Selected voucher:", voucher);
            setSelectedVoucher(voucher);
            setShowSaleModal(true);
          }}
            selectedProvider={selectedProvider || "MTN"}
          />
        </div>
      )}

      {/* Show message when no vouchers are found - this should only appear when loading is complete */}
      {!loading && selectedService && (!vouchers || vouchers.length === 0) && (
        <div
          className="mt-6 rounded-lg border-2 p-4"
          style={{
            borderColor: selectedProvider
              ? providerColors[selectedProvider as keyof typeof providerColors]
                  ?.border || "#ccc"
              : "#ccc",
            background: isDark ? "rgba(30, 30, 30, 0.8)" : "#fff",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: selectedProvider
                ? providerColors[
                    selectedProvider as keyof typeof providerColors
                  ]?.border || (isDark ? "#9ecef8" : "#0066cc")
                : isDark
                  ? "#9ecef8"
                  : "#0066cc",
            }}
          >
            {requiresServiceSelection
              ? `No vouchers found for ${selectedProvider} ${selectedService}. Please try another service or provider.`
              : `No vouchers available for ${selectedProvider}. Please contact the administrator to add vouchers.`}
          </Typography>
        </div>
      )}

      {/* Modals */}
      <SaleModal
        open={showSaleModal}
        onClose={() => setShowSaleModal(false)}
        voucher={selectedVoucher}
        onVoucherSold={handleVoucherSold}
      />
      <OTTModal open={showOTTModal} onClose={() => setShowOTTModal(false)} />
      <ConfirmationDialog
        open={Boolean(confirmationAction)}
        onConfirm={confirmationAction || (() => {})}
        onClose={() => setConfirmationAction(null)}
      />
    </div>
  );
};

export default TerminalDashboard;
