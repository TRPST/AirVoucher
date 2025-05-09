// app/protected/manageTerminals/[terminalID]/OTTModal.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import crypto from "crypto-js";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  useTheme,
  Divider,
} from "@mui/material";
import { getRetailerByIdAction } from "../actions";

interface OTTModalProps {
  open: boolean;
  onClose: () => void;
  provider: string | null;
  service: string | null;
  terminalId: string;
  assignedRetailerId: string | null;
}

const OTTModal: React.FC<OTTModalProps> = ({
  open,
  onClose,
  provider,
  service,
  terminalId,
  assignedRetailerId,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [validationPin, setValidationPin] = useState("");
  const [retailer, setRetailer] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [uniqueRef, setUniqueRef] = useState<string>("");

  interface VoucherResponse {
    success: boolean;
    message?: string;
    voucher?: {
      voucherID: string;
      pin: string;
      serialNumber: string;
      saleID: string;
      amount: number;
      timestamp?: string;
      arvReference?: string;
    };
  }

  const [voucherResponse, setVoucherResponse] =
    useState<VoucherResponse | null>(null);
  const [confirmationAction, setConfirmationAction] = useState<
    (() => Promise<void>) | null
  >(null);
  const amounts = [10, 20, 50, 100, 200, 1000, 2000];

  // Theme-aware colors
  const ottColor = isDark ? "rgba(0, 128, 0, 0.08)" : "rgba(0, 128, 0, 0.15)";
  const ottBorder = isDark ? "rgb(0, 180, 0)" : "rgb(0, 128, 0)";
  const textColor = isDark
    ? theme.palette.text.primary
    : theme.palette.text.primary;
  const buttonBg = isDark ? "rgba(0, 180, 0, 0.2)" : "rgba(0, 128, 0, 0.9)";
  const buttonHoverBg = isDark ? "rgba(0, 180, 0, 0.3)" : "rgba(0, 128, 0, 1)";

  // OTT API Credentials
  const BASE_URL = "/api/ott";
  const username = "AIRVOUCHER";
  const password = "v95Hp_#kc+";
  const apiKey = "b39abd74-534c-44dc-a8ba-62a89dc8d31c";

  const generateHash = (params: { [key: string]: any }) => {
    const sortedKeys = Object.keys(params).sort();
    const concatenatedString = [
      apiKey,
      ...sortedKeys.map((key) => params[key]),
    ].join("");
    return crypto.SHA256(concatenatedString).toString();
  };

  const getAuthHeaders = () => {
    const token = btoa(`${username}:${password}`);
    return { Authorization: `Basic ${token}` };
  };

  const generateUniqueReference = () =>
    `ref-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

  const generateARVReference = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `ARV${timestamp}${random}`;
  };

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const uniqueReference = generateUniqueReference();
      const params = { uniqueReference };
      const hash = generateHash(params);

      const response = await axios.post(
        `${BASE_URL}/reseller/v1/GetBalance`,
        new URLSearchParams({ uniqueReference, hash }),
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (response.data.success === "true") {
        setBalance(response.data.balance);
      } else {
        throw new Error(response.data.message || "Failed to fetch balance");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignedRetailerId) {
      getRetailerByIdAction(assignedRetailerId).then((res: any) => {
        if (res && res.retailer) {
          setRetailer({ id: res.retailer.id, name: res.retailer.name });
        }
      });
    }
    // Generate unique reference on open
    if (open) {
      setUniqueRef(`REF-${Date.now()}-${Math.floor(Math.random() * 10000)}`);
    }
  }, [assignedRetailerId, open]);

  const validateVoucher = async (pin: string) => {
    setLoading(true);
    try {
      const uniqueReference = generateUniqueReference();
      const params = {
        uniqueReference,
        pin,
        vendorCode: "11",
      };
      const hash = generateHash(params);

      const response = await axios.post(
        `${BASE_URL}/reseller/v1/ValidateVoucher`,
        new URLSearchParams({ ...params, hash }),
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (response.data.success === "true") {
        setVoucherResponse({
          success: true,
          message: "Voucher is valid",
          voucher: {
            ...JSON.parse(response.data.voucher),
            timestamp: new Date().toISOString(),
            arvReference: generateARVReference(),
          },
        });
      } else {
        setVoucherResponse({
          success: false,
          message: response.data.message || "Invalid voucher",
        });
      }
    } catch (error) {
      console.error("Error validating voucher:", error);
      setVoucherResponse({
        success: false,
        message: "Failed to validate voucher",
      });
    } finally {
      setLoading(false);
    }
  };

  const issueVoucher = async (amount: number) => {
    setLoading(true);
    setVoucherResponse(null);

    if (!amount || amount <= 0) {
      setVoucherResponse({
        success: false,
        message: "Please select a valid voucher amount.",
      });
      setLoading(false);
      return;
    }

    try {
      const uniqueReference = generateUniqueReference();
      const params = {
        branch: "DEFAULT_BRANCH",
        cashier: "SYSTEM",
        mobileForSMS: "",
        till: "WEB",
        uniqueReference,
        value: amount,
        vendorCode: "11",
      };

      const hash = generateHash(params);

      const res = await axios.post(
        `${BASE_URL}/reseller/v1/GetVoucher`,
        new URLSearchParams(
          Object.entries({ ...params, hash }).reduce(
            (acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            },
            {} as Record<string, string>,
          ),
        ),
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (res.data.success === "true") {
        const voucherData = JSON.parse(res.data.voucher);
        setVoucherResponse({
          success: true,
          voucher: {
            ...voucherData,
            timestamp: new Date().toISOString(),
            arvReference: generateARVReference(),
          },
        });
        fetchBalance();
      } else {
        setVoucherResponse({ success: false, message: res.data.message });
      }
    } catch (error) {
      console.error("Error issuing voucher:", error);
      setVoucherResponse({
        success: false,
        message: "An error occurred while issuing the voucher.",
      });
    } finally {
      setLoading(false);
      setSelectedAmount(null);
    }
  };

  // Helper for provider instructions
  const getLoadInstructions = (provider: string | undefined) => {
    if (!provider) return "";
    if (provider.toLowerCase() === "mtn") return "Dial *136*(voucher number)#";
    return "See voucher for instructions";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          background: isDark ? "rgb(18, 18, 18)" : "background.paper",
          color: isDark ? "#ffffff" : "text.primary",
          "& .MuiDialogTitle-root": {
            color: isDark ? "#ffffff" : "text.primary",
          },
          "& .MuiDialogContent-root": {
            color: isDark ? "#ffffff" : "text.primary",
          },
          "& .MuiDialogActions-root": {
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          pb: 2,
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: ottBorder, fontWeight: "bold", mb: 1 }}
        >
          AirVoucher OTT Service
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "text.secondary",
            opacity: 0.7,
          }}
        >
          Retailer: AirVoucher Solutions
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <CircularProgress sx={{ color: ottBorder }} />
          </div>
        ) : (
          <>
            <Card
              sx={{
                mb: 4,
                background: isDark
                  ? "rgba(0, 128, 0, 0.1)"
                  : "rgba(0, 128, 0, 0.15)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: isDark ? "#ffffff" : "text.primary" }}
                >
                  Current Balance
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: ottBorder, fontWeight: "bold" }}
                >
                  R{balance || "0.00"}
                </Typography>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, textAlign: "center" }}
                >
                  Select Amount
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {amounts.map((amount) => (
                    <Grid item xs={6} sm={4} key={amount}>
                      <Card
                        onClick={() => {
                          setSelectedAmount(amount);
                          setConfirmationAction(
                            () => () => issueVoucher(amount),
                          );
                        }}
                        sx={{
                          cursor: "pointer",
                          background:
                            selectedAmount === amount
                              ? isDark
                                ? "rgba(0, 180, 0, 0.15)"
                                : "rgba(0, 128, 0, 0.25)"
                              : ottColor,
                          border:
                            selectedAmount === amount
                              ? `2px solid ${ottBorder}`
                              : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                          borderRadius: 1,
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0px 4px 12px ${ottBorder}30`,
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <img
                            src="/images/ott_logo.png"
                            alt="OTT"
                            style={{
                              height: 30,
                              marginBottom: 8,
                              objectFit: "contain",
                              opacity: selectedAmount === amount ? 1 : 0.7,
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{ color: textColor, fontWeight: "bold" }}
                          >
                            R{amount}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Card
                  sx={{
                    mb: 3,
                    background: ottColor,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Custom Amount
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter amount"
                      variant="outlined"
                      type="number"
                      size="small"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          background: isDark ? "rgba(0,0,0,0.2)" : "white",
                          color: isDark ? "#ffffff" : "text.primary",
                          "& fieldset": {
                            borderColor: isDark
                              ? "rgba(255,255,255,0.3)"
                              : "rgba(0,0,0,0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: isDark
                              ? "rgba(255,255,255,0.5)"
                              : "rgba(0,0,0,0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: ottBorder,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: isDark
                            ? "rgba(255,255,255,0.7)"
                            : "text.secondary",
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      sx={{
                        mt: 2,
                        background: buttonBg,
                        color: "#fff",
                        border: `1px solid ${ottBorder}`,
                        "&:hover": {
                          background: buttonHoverBg,
                        },
                      }}
                      onClick={() => {
                        const amount = parseFloat(customAmount);
                        if (amount > 0) {
                          setSelectedAmount(amount);
                          setConfirmationAction(
                            () => () => issueVoucher(amount),
                          );
                        }
                        setCustomAmount("");
                      }}
                    >
                      Purchase Custom Amount
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    mb: 3,
                    background: ottColor,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Voucher Management
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter voucher PIN"
                      variant="outlined"
                      size="small"
                      value={validationPin}
                      onChange={(e) => setValidationPin(e.target.value)}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          background: isDark ? "rgba(0,0,0,0.2)" : "white",
                          color: isDark ? "#ffffff" : "text.primary",
                          "& fieldset": {
                            borderColor: isDark
                              ? "rgba(255,255,255,0.3)"
                              : "rgba(0,0,0,0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: isDark
                              ? "rgba(255,255,255,0.5)"
                              : "rgba(0,0,0,0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: ottBorder,
                          },
                        },
                      }}
                    />
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          fullWidth
                          size="small"
                          color="error"
                          onClick={() => {
                            if (validationPin) {
                              setVoucherResponse({
                                success: false,
                                message: "Voucher rejected",
                              });
                              setValidationPin("");
                            }
                          }}
                          sx={{
                            background: isDark
                              ? "rgba(255,0,0,0.2)"
                              : "error.main",
                            color: isDark ? "#ff4444" : "error.contrastText",
                            border: `1px solid ${isDark ? "rgba(255,0,0,0.5)" : "error.main"}`,
                            "&:hover": {
                              background: isDark
                                ? "rgba(255,0,0,0.3)"
                                : "error.dark",
                            },
                          }}
                        >
                          Reject
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          fullWidth
                          size="small"
                          onClick={() => validateVoucher(validationPin)}
                          sx={{
                            background: buttonBg,
                            color: "#fff",
                            border: `1px solid ${ottBorder}`,
                            "&:hover": {
                              background: buttonHoverBg,
                            },
                          }}
                        >
                          Validate
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {voucherResponse && (
              <Card
                sx={{
                  maxWidth: 400,
                  mx: "auto",
                  background: voucherResponse.success
                    ? isDark
                      ? "rgba(0, 180, 0, 0.1)"
                      : "rgba(0, 255, 0, 0.1)"
                    : isDark
                      ? "rgba(255, 0, 0, 0.1)"
                      : "rgba(255, 0, 0, 0.1)",
                  mb: 3,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  {voucherResponse.success && voucherResponse.voucher ? (
                    <>
                      {/* Retailer info at top, centered */}
                      <Typography
                        variant="h6"
                        align="center"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {retailer?.name || "Retailer"}
                      </Typography>
                      <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                        {retailer?.id ? `ID: ${retailer.id}` : ""}
                      </Typography>

                      {/* Voucher name and amount */}
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        sx={{ color: ottBorder }}
                      >
                        {provider}
                      </Typography>
                      <Typography
                        variant="body1"
                        align="center"
                        sx={{
                          mb: 2,
                          color: isDark ? "#ffffff" : "text.primary",
                        }}
                      >
                        Amount: R{voucherResponse.voucher.amount}
                      </Typography>

                      {/* Loading instructions */}
                      <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                        {getLoadInstructions(provider || undefined)}
                      </Typography>

                      {/* Voucher PIN, Serial, Reference, Date/Time */}
                      <Typography
                        variant="h5"
                        align="center"
                        sx={{
                          fontFamily: "monospace",
                          letterSpacing: 2,
                          mb: 2,
                        }}
                      >
                        {voucherResponse.voucher.pin}
                      </Typography>
                      <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                        Serial Number: {voucherResponse.voucher.serialNumber}
                      </Typography>
                      <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                        Ref: {uniqueRef}
                      </Typography>
                      <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                        Date:{" "}
                        {voucherResponse.voucher.timestamp
                          ? new Date(
                              voucherResponse.voucher.timestamp,
                            ).toLocaleString()
                          : "-"}
                      </Typography>
                    </>
                  ) : (
                    <Typography color="error" variant="body2" align="center">
                      {voucherResponse.message}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{
            borderColor: `${ottBorder}50`,
            color: ottBorder,
            "&:hover": {
              borderColor: ottBorder,
              background: isDark
                ? "rgba(0, 128, 0, 0.1)"
                : "rgba(0, 128, 0, 0.15)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>

      {confirmationAction && (
        <Dialog
          open={Boolean(confirmationAction)}
          onClose={() => setConfirmationAction(null)}
          PaperProps={{
            sx: {
              borderRadius: 1,
              background: isDark
                ? "rgba(0, 0, 0, 0.9)"
                : "rgba(255, 255, 255, 0.98)",
            },
          }}
        >
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Are you sure you want to purchase a voucher for R{selectedAmount}?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setConfirmationAction(null)}
              size="small"
              sx={{
                color: textColor,
                opacity: 0.7,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                confirmationAction();
                setConfirmationAction(null);
              }}
              variant="contained"
              size="small"
              sx={{
                background: buttonBg,
                color: "#fff",
                border: `1px solid ${ottBorder}`,
                "&:hover": {
                  background: buttonHoverBg,
                },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  );
};

export default OTTModal;
