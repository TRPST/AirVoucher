import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  Box,
  TextField,
  Badge,
  Tooltip,
} from "@mui/material";
import { supabase } from "../../../../../utils/supabase/client";

// Define interfaces for vouchers
interface BaseVoucher {
  id: string;
  name: string;
  category: string;
  amount: number;
  vendorId: string;
  supplier_name: string;
  status?: string;
  voucher_pin?: string | null;
  voucher_serial_number?: string | null;
}

interface ManualVoucher extends BaseVoucher {
  isApiVoucher: false;
}

interface ApiVoucher extends BaseVoucher {
  isApiVoucher: true;
  dstv_account?: string;
  meter_number?: string;
}

type UnifiedVoucher = ManualVoucher | ApiVoucher;

interface VoucherAvailability {
  amount: string;
  total: number;
  available: number;
}

interface UnifiedVoucherListProps {
  selectedProvider: string;
  selectedService: string;
  onSelect: (voucher: UnifiedVoucher) => void;
  terminalId: string;
  commGroupId: string;
}

// Provider color configurations
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
    light: "rgba(128, 128, 128, 0.15)",
    dark: "rgba(169, 169, 169, 0.25)",
    border: isDark ? "rgb(169, 169, 169)" : "rgb(128, 128, 128)",
    text: isDark ? "rgb(211, 211, 211)" : "rgb(96, 96, 96)",
  },
  Telkom: {
    light: "rgba(0, 102, 204, 0.15)",
    dark: "rgba(0, 102, 204, 0.25)",
    border: "rgb(0, 102, 204)",
    text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
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

const TELECOM_PROVIDERS = ["MTN", "Vodacom", "CellC", "Telkom"];
const amounts = [
  "1",
  "2",
  "3",
  "5",
  "10",
  "15",
  "20",
  "30",
  "40",
  "50",
  "100",
  "150",
  "200",
  "250",
  "1999",
];

// Helper function to get provider image with fallbacks
const getProviderImageUrl = (provider: string) => {
  const basePath = `/images`;
  switch (provider.toLowerCase()) {
    case "vodacom":
      return `${basePath}/vodacom.png`;
    case "mtn":
      return `${basePath}/mtn.png`;
    case "cellc":
      return `${basePath}/cellc.png`;
    case "telkom":
      return `${basePath}/telkom.jpeg`;
    case "hollywoodbets":
      return `${basePath}/hollywoodbets.png`;
    case "ringa":
      return `${basePath}/ringa.jpg`;
    case "easyload":
      return `${basePath}/easyload.png`;
    default:
      return `${basePath}/glocell.png`;
  }
};

const UnifiedVoucherList: React.FC<UnifiedVoucherListProps> = ({
  selectedProvider,
  selectedService,
  onSelect,
  terminalId,
  commGroupId,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const providerColors = getProviderColors(isDark);
  const colors =
    providerColors[selectedProvider as keyof typeof providerColors] ||
    providerColors.MTN;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [voucherAvailability, setVoucherAvailability] = useState<
    VoucherAvailability[]
  >([]);
  const isTelecomProvider = TELECOM_PROVIDERS.includes(selectedProvider);
  const [allVouchersState, setAllVouchersState] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("mobile_data_vouchers")
      .select("*")
      .then(({ data }) => {
        setAllVouchersState(data || []);
      });
  }, []);

  // Fetch voucher availability for all amounts
  useEffect(() => {
    const fetchVoucherAvailability = async () => {
      try {
        console.log("[DEBUG] Filters: ", {
          isTelecomProvider,
          selectedProvider,
          selectedService,
          commGroupId,
        });

        // Fetch all vouchers for this table
        const { data: allVouchers } = await supabase
          .from("mobile_data_vouchers")
          .select("*");
        console.log("[DEBUG] All vouchers in table:", allVouchers);
        console.log(
          "[DEBUG] Sample comm_group_id values:",
          (allVouchers || []).slice(0, 10).map((v) => v.comm_group_id),
        );
        console.log(
          "[DEBUG] All comm_group_id values:",
          Array.from(new Set((allVouchers || []).map((v) => v.comm_group_id))),
        );

        // Now, fetch for this provider only
        let providerQuery = supabase.from("mobile_data_vouchers").select("*");
        if (isTelecomProvider) {
          providerQuery = providerQuery.ilike("vendorId", selectedProvider);
          if (selectedService) {
            providerQuery = providerQuery.ilike("category", selectedService);
          }
        } else {
          providerQuery = providerQuery.ilike(
            "supplier_name",
            selectedProvider,
          );
        }

        const { data: providerVouchers } = await providerQuery;
        console.log(
          "[DEBUG] Vouchers after provider filters:",
          providerVouchers,
        );

        // Now, continue with the rest of your logic...
        const availability = amounts.map((amount) => {
          const vouchersForAmount =
            providerVouchers?.filter(
              (v) => String(v.amount) === String(amount),
            ) || [];
          const activeVouchers = vouchersForAmount.filter(
            (v) => v.status === "active",
          );
          console.log(
            `[DEBUG] Amount: R${amount} | All:`,
            vouchersForAmount,
            "| Active:",
            activeVouchers,
          );
          return {
            amount,
            total: vouchersForAmount.length,
            available: activeVouchers.length,
          };
        });

        console.log("[DEBUG] voucherAvailability array:", availability);
        setVoucherAvailability(availability);
      } catch (err) {
        console.error("Error fetching voucher availability:", err);
      }
    };

    if (selectedProvider) {
      fetchVoucherAvailability();
    }
  }, [selectedProvider, selectedService, isTelecomProvider, allVouchersState]);

  const handleAmountSelect = async (amount: number) => {
    setLoading(true);
    setError(null);

    try {
      // Build query to get an available voucher
      let query = supabase
        .from("mobile_data_vouchers")
        .select("*")
        .eq("status", "active")
        .eq("amount", amount);

      if (isTelecomProvider) {
        query = query.ilike("vendorId", selectedProvider);
        if (selectedService) {
          query = query.ilike("category", selectedService);
        }
      } else {
        query = query.ilike("supplier_name", selectedProvider);
      }

      // Get first available voucher
      const { data, error: queryError } = await query.limit(1);

      if (queryError) throw queryError;

      if (!data || data.length === 0) {
        const serviceText = isTelecomProvider ? ` ${selectedService}` : "";
        setError(
          `Sorry, no vouchers available for R${amount} ${selectedProvider}${serviceText} at the moment. Please try another amount.`,
        );
        return;
      }

      const voucher: UnifiedVoucher = {
        ...data[0],
        isApiVoucher: false,
      };

      onSelect(voucher);
    } catch (err: any) {
      console.error("Error fetching voucher:", err);
      setError(`Failed to fetch voucher: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAmountSubmit = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) {
      handleAmountSelect(amount);
      setCustomAmount("");
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    if (available === 0) return "error";
    if (available <= total * 0.2) return "warning";
    return "success";
  };

  if (!selectedProvider || !selectedService) {
    return null;
  }

  return (
    <div>
      {loading && (
        <div className="flex justify-center p-6">
          <CircularProgress sx={{ color: colors.border }} />
        </div>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            textAlign: "center",
            color: isDark ? "#ffffff" : "#333333",
            fontWeight: 600,
            background: isDark
              ? "rgba(24, 24, 27, 0.95)"
              : "rgba(0, 0, 0, 0.03)",
            py: 0.75,
            borderRadius: 1,
            fontSize: "1rem",
          }}
        >
          Select Amount for {selectedProvider}{" "}
          {isTelecomProvider ? selectedService : ""}
        </Typography>

        <Grid
          container
          spacing={1}
          sx={{
            justifyContent: "flex-start",
            width: "100%",
            margin: 0,
            padding: "0",
          }}
        >
          {amounts.map((amount) => {
            const availability = voucherAvailability.find(
              (v) => v.amount === amount,
            );
            const isAvailable = availability && availability.available > 0;
            return (
              <Grid
                item
                xs={3}
                sm={2}
                key={amount}
                sx={{ p: "4px !important" }}
              >
                <Card
                  onClick={() =>
                    isAvailable ? handleAmountSelect(Number(amount)) : null
                  }
                  sx={{
                    minWidth: 0,
                    width: "100%",
                    cursor: isAvailable ? "pointer" : "not-allowed",
                    opacity: isAvailable ? 1 : 0.6,
                    background: "#fff",
                    border: `1px solid #e0e0e0`,
                    borderRadius: 1.5,
                    transition: "all 0.2s ease-in-out",
                    height: "64px",
                    margin: "0",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px",
                    boxSizing: "border-box",
                    "&:hover": isAvailable
                      ? {
                          transform: "translateY(-1px)",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                          borderColor: colors.border,
                        }
                      : {},
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundImage: `url(${getProviderImageUrl(selectedProvider)})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      opacity: 0.9,
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#666666",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    R{amount}
                  </Typography>
                </Card>
              </Grid>
            );
          })}

          {/* Custom Amount Input */}
          <Grid item xs={12} sm={6} sx={{ p: "4px !important" }}>
            <Card
              sx={{
                background: "#fff",
                border: `1px solid #e0e0e0`,
                borderRadius: 1.5,
                height: "64px",
                display: "flex",
                alignItems: "center",
                padding: "0 8px",
              }}
            >
              <TextField
                size="small"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                type="number"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    background: isDark ? "rgba(0,0,0,0.2)" : "white",
                    height: "40px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <Typography
                      sx={{ color: "#666", mr: 1, fontSize: "0.875rem" }}
                    >
                      R
                    </Typography>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleCustomAmountSubmit}
                size="small"
                sx={{
                  ml: 1,
                  height: "40px",
                  minWidth: "80px",
                  background: colors.border,
                  color: "#fff",
                  "&:hover": {
                    background: `${colors.border}dd`,
                  },
                }}
              >
                Add
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default UnifiedVoucherList;
