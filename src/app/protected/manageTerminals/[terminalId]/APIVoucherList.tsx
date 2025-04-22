import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
  Box,
  Divider,
  TextField,
  Paper,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";
import DSTVModal from "./DSTVModal";
import ElectricityModal from "./ElectricityModal";

interface APIVoucher {
  id: string;
  name: string;
  category: string;
  amount: number;
  vendorId: string;
  supplier_name: string;
  status?: string;
  voucher_pin?: string | null;
  voucher_serial_number?: string | null;
  isApiVoucher: boolean;
  dstv_account?: string;
  meter_number?: string;
}

interface APIVoucherListProps {
  selectedProvider: string;
  selectedService: string;
  onSelect: (service: string) => void;
  terminalId: string;
  commGroupId: string;
}

const API_URL = "/api/vouchers"; // Use Next.js API route

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
  Electricity: {
    light: "rgba(218, 165, 32, 0.15)",
    dark: "rgba(218, 165, 32, 0.25)",
    border: "rgb(32, 51, 218)",
    text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  Dstv: {
    light: "rgba(218, 165, 32, 0.15)",
    dark: "rgba(218, 165, 32, 0.25)",
    border: "rgb(32, 137, 218)",
    text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
});

// Map provider names to API vendor IDs
const providerToVendorId: Record<string, string> = {
  MTN: "mtn",
  Vodacom: "vodacom",
  CellC: "cellc",
  Telkom: "telkom",
  Hollywoodbets: "hollywoodbets",
  Ringa: "ringa",
  Easyload: "easyload",
};

// Helper function to get provider image with fallbacks
const getProviderImageUrl = (provider: string) => {
  const basePath = `/images`;
  // Map provider names to their actual image files
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
    case "dstv":
      return `${basePath}/dstv.png`;
    case "electricity":
      return `${basePath}/electricity.png`;
    default:
      return `${basePath}/glocell.png`;
  }
};

// Add service types
const TELECOM_SERVICES = {
  AIRTIME: "Airtime",
  DATA: "Data",
  SMS: "SMS",
  TOPUP: "Top Up",
};

const TELECOM_PROVIDERS = ["MTN", "Vodacom", "CellC", "Telkom"];

const services = [
  { name: "Airtime" },
  { name: "Data" },
  { name: "SMS" },
  { name: "Top-up" },
];

const amounts = ["5", "10", "20", "30", "40", "50", "100", "150", "200"];

const APIVoucherList: React.FC<APIVoucherListProps> = ({
  selectedProvider,
  selectedService,
  onSelect,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const providerColors = getProviderColors(isDark);
  const colors =
    providerColors[selectedProvider as keyof typeof providerColors] ||
    providerColors.MTN;

  const [vouchers, setVouchers] = useState<APIVoucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDSTVModalOpen, setIsDSTVModalOpen] = useState(false);
  const [isElectricityModalOpen, setIsElectricityModalOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [internalSelectedService, setInternalSelectedService] = useState<
    string | null
  >(null);

  // Check if current provider is a telecom provider
  const isTelecomProvider = TELECOM_PROVIDERS.includes(selectedProvider);

  // Reset selections when provider changes
  useEffect(() => {
    setSelectedAmount(null);
    setInternalSelectedService(null);
  }, [selectedProvider]);

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!selectedAmount) return;

      setLoading(true);
      setError(null);

      try {
        console.log(
          `🔍 Fetching API vouchers for ${selectedProvider} with amount ${selectedAmount}`,
        );

        const vendorId =
          providerToVendorId[selectedProvider] ||
          selectedProvider.toLowerCase();
        const amount = selectedAmount.replace("R", "");

        const response = await axios.get(API_URL, {
          params: {
            vendor: vendorId,
            amount: amount,
          },
        });

        console.log("API Response:", response.data);
        setApiResponse(response.data);

        if (
          response.data &&
          response.data.products &&
          response.data.products.length > 0
        ) {
          const transformedVouchers = response.data.products.map(
            (product: any) => ({
              id:
                product.id || `api-${Math.random().toString(36).substr(2, 9)}`,
              name:
                product.name || `${selectedProvider} ${selectedAmount} Voucher`,
              category: product.category || "Data",
              amount: parseFloat(amount),
              vendorId: vendorId,
              supplier_name: "API",
              status: "available",
              isApiVoucher: true,
            }),
          );

          setVouchers(transformedVouchers);
          console.log(
            `✅ Found ${transformedVouchers.length} API vouchers for ${selectedProvider} ${selectedAmount}`,
          );
        } else {
          setError(
            `No vouchers available for ${selectedProvider} ${selectedAmount}`,
          );
          setVouchers([]);
        }
      } catch (err: any) {
        console.error("❌ Error fetching API vouchers:", err);
        setError(`Failed to fetch vouchers: ${err.message || "Unknown error"}`);
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [selectedProvider, selectedAmount]);

  const handleUtilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const vendorId =
        providerToVendorId[selectedProvider] || selectedProvider.toLowerCase();
      const payload = {
        vendor: vendorId,
        amount: parseFloat(amount),
        ...(selectedProvider === "Dstv" ? { accountNumber } : { meterNumber }),
      };

      const response = await axios.get(API_URL, { params: payload });

      if (response.data && response.data.success) {
        const voucher: APIVoucher = {
          id: `api-${Math.random().toString(36).substr(2, 9)}`,
          name: `${selectedProvider} Payment`,
          category: selectedProvider,
          amount: parseFloat(amount),
          vendorId,
          supplier_name: "API",
          status: "available",
          isApiVoucher: true,
          ...(selectedProvider === "Dstv"
            ? { dstv_account: accountNumber }
            : { meter_number: meterNumber }),
        };
        onSelect(voucher.name);
      } else {
        setError(response.data.message || "Failed to process request");
      }
    } catch (err: any) {
      console.error(`❌ Error processing ${selectedProvider} payment:`, err);
      setError(
        err.message || "An error occurred while processing your request",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Open appropriate modal when provider changes
  useEffect(() => {
    if (selectedProvider.toLowerCase() === "dstv") {
      setIsDSTVModalOpen(true);
    } else if (selectedProvider.toLowerCase() === "electricity") {
      setIsElectricityModalOpen(true);
    }
  }, [selectedProvider]);

  // Only show service selection for telecom providers
  const showServiceSelection = !["dstv", "electricity"].includes(
    selectedProvider.toLowerCase(),
  );

  const handleServiceSelect = (service: string) => {
    setInternalSelectedService(service);
  };

  const handleAmountSelect = (amount: string) => {
    if (isTelecomProvider) {
      setSelectedAmount(amount);
      onSelect(`${internalSelectedService}_${amount}`);
    } else {
      setSelectedAmount(amount);
      onSelect(amount);
    }
  };

  const handleCustomAmountSubmit = () => {
    if (customAmount && !isNaN(Number(customAmount))) {
      handleAmountSelect(customAmount);
      setCustomAmount("");
    }
  };

  return (
    <div className="mt-4">
      {selectedProvider && showServiceSelection && (
        <>
          {isTelecomProvider ? (
            // Telecom Providers UI (MTN, Vodacom, CellC, Telkom)
            <>
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
                Select a Service for {selectedProvider}
              </Typography>

              {/* Service Selection UI - Always visible for telecoms */}
              <Grid
                container
                spacing={1}
                sx={{
                  justifyContent: "center",
                  width: "100%",
                  margin: 0,
                  padding: "4px",
                }}
              >
                {services.map((service) => (
                  <Grid
                    item
                    xs={4}
                    sm={3}
                    key={service.name}
                    sx={{
                      p: "4px !important",
                    }}
                  >
                    <Card
                      onClick={() => handleServiceSelect(service.name)}
                      sx={{
                        cursor: "pointer",
                        background: "#fff",
                        border:
                          internalSelectedService === service.name
                            ? `1px solid ${colors.border}`
                            : `1px solid #e0e0e0`,
                        borderRadius: 2,
                        transition: "all 0.2s ease-in-out",
                        height: "90px",
                        margin: "0",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 8px",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0px 2px 4px rgba(0, 0, 0, 0.1)`,
                          borderColor: colors.border,
                        },
                      }}
                    >
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundImage: `url(${getProviderImageUrl(
                            selectedProvider,
                          )})`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          marginBottom: "4px",
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#666666",
                          fontWeight:
                            internalSelectedService === service.name
                              ? 600
                              : 500,
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                        }}
                      >
                        {service.name}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Amount Selection UI - Show when service is selected for telecoms */}
              {internalSelectedService && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      textAlign: "left",
                      color: isDark ? "#9ca3af" : "#666666",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    Select Amount
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
                    {amounts.map((amount) => (
                      <Grid
                        item
                        xs={3}
                        sm={2}
                        key={amount}
                        sx={{
                          p: "4px !important",
                        }}
                      >
                        <Card
                          onClick={() => handleAmountSelect(amount)}
                          sx={{
                            cursor: "pointer",
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
                            "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                              borderColor: colors.border,
                            },
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
                    ))}

                    {/* Custom Amount Input - Integrated into the grid */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{
                        p: "4px !important",
                      }}
                    >
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
                                sx={{
                                  color: "#666",
                                  mr: 1,
                                  fontSize: "0.875rem",
                                }}
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
              )}
            </>
          ) : (
            // Non-Telecom Providers UI (Hollywoodbets, Ringa, Easyload)
            <>
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
                Select Amount for {selectedProvider}
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
                {amounts.map((amount) => (
                  <Grid
                    item
                    xs={3}
                    sm={2}
                    key={amount}
                    sx={{
                      p: "4px !important",
                    }}
                  >
                    <Card
                      onClick={() => handleAmountSelect(amount)}
                      sx={{
                        cursor: "pointer",
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
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                          borderColor: colors.border,
                        },
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
                ))}

                {/* Custom Amount Input - Integrated into the grid */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    p: "4px !important",
                  }}
                >
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
                            sx={{
                              color: "#666",
                              mr: 1,
                              fontSize: "0.875rem",
                            }}
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
            </>
          )}
        </>
      )}

      <DSTVModal
        open={isDSTVModalOpen}
        onClose={() => setIsDSTVModalOpen(false)}
      />
      <ElectricityModal
        open={isElectricityModalOpen}
        onClose={() => setIsElectricityModalOpen(false)}
      />
    </div>
  );
};

export default APIVoucherList;
