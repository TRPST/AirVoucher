// app/protected/manageTerminals/[terminalID]/SaleModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Paper,
  Box,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import { supabase } from "../../../../../utils/supabase/client";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface VoucherType {
  id: string;
  name: string;
  amount: number;
  category?: string;
  supplier_name?: string;
  vendorId?: string;
  status?: string;
}

interface SaleModalProps {
  open: boolean;
  onClose: () => void;
  voucher: VoucherType | null;
  onVoucherSold?: () => void;
}

const SaleModal: React.FC<SaleModalProps> = ({
  open,
  onClose,
  voucher,
  onVoucherSold,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soldVoucher, setSoldVoucher] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Helper function to generate a pin (since the database doesn't have them yet)
  const generatePin = (length = 12) => {
    const chars = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Helper function to generate a serial number
  const generateSerialNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    return `${timestamp}${random}`;
  };

  // Function to handle the sale process
  const handleSale = async () => {
    if (!voucher) return;

    setProcessing(true);
    setError(null);

    try {
      console.log(`Processing sale for voucher ID: ${voucher.id}`);

      // 1. Check if the voucher is available
      const { data: voucherData, error: voucherError } = await supabase
        .from("mobile_data_vouchers")
        .select("*")
        .eq("id", voucher.id)
        .single();

      if (voucherError) {
        throw new Error(`Could not fetch voucher: ${voucherError.message}`);
      }

      if (!voucherData) {
        throw new Error("Voucher not found");
      }

      // Check if voucher is already sold or has a status other than available
      if (voucherData.status === "sold") {
        throw new Error("This voucher has already been sold");
      }

      // Generate pin and serial number (as they're currently not in the database)
      const voucherPin = generatePin();
      const vendorPrefix =
        voucherData.vendorId?.toUpperCase().substring(0, 3) || "GEN";
      const serialNumber = generateSerialNumber();

      // 2. Update the voucher status to 'sold'
      const currentTime = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("mobile_data_vouchers")
        .update({
          status: "sold",
          voucher_pin: voucherPin,
          voucher_serial_number: serialNumber,
        })
        .eq("id", voucher.id);

      if (updateError) {
        throw new Error(`Failed to update voucher: ${updateError.message}`);
      }

      // 3. Create a record of the sale in the voucher_sells table
      const currentTerminalId =
        window.location.pathname.split("/").pop() || "UNKNOWN";

      // Format the voucher amount as a string (remove decimal places)
      const amountInRand = parseInt(voucherData.amount);

      const saleRecord = {
        supplier_id: voucherData.supplier_id || 1,
        terminal_id: currentTerminalId,
        retailer_id: `RE${Math.floor(1000 + Math.random() * 9000)}`, // Generate a placeholder retailer ID
        voucher_amount: amountInRand.toString(),
        voucher_group_id: voucherData.comm_group_id || 1,
        voucher_name: voucherData.name || "",
        voucher_pin: voucherPin,
        total_comm: voucherData.total_comm || "0",
        retailer_comm: voucherData.retailer_comm || "0",
        sales_agent_comm: voucherData.sales_agent_comm || "0",
        profit: voucherData.profit || "0",
        net_profit: voucherData.profit
          ? (parseFloat(voucherData.profit) * 0.8).toFixed(2)
          : "0", // Simplified net profit calculation
      };

      try {
        const { error: saleError } = await supabase
          .from("voucher_sales")
          .insert(saleRecord);

        if (saleError) {
          console.error(
            "Error recording sale in voucher_sales table:",
            saleError,
          );
          // Continue even if sale recording fails, we already updated the voucher status
        } else {
          console.log("Sale recorded successfully in voucher_sales table");
        }
      } catch (saleErr) {
        console.error("Exception recording sale:", saleErr);
        // We'll continue even if sale recording fails, but log the error
      }

      // 4. Set the sold voucher data to display
      setSoldVoucher({
        ...voucherData,
        voucher_pin: voucherPin,
        voucher_serial_number: serialNumber,
        sale_time: currentTime,
        formattedAmount: `R${amountInRand.toFixed(2)}`,
      });

      setCompleted(true);
      console.log("Sale completed successfully");
    } catch (err) {
      console.error("Error processing sale:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setProcessing(false);
    }
  };

  // Function to copy content to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  // Close and reset modal
  const handleClose = () => {
    if (completed && onVoucherSold) {
      // Call the callback FIRST
      onVoucherSold();

      // THEN reset the state
      setCompleted(false);
      setError(null);
      setSoldVoucher(null);
      setCopied(null);
    }

    // Always reset state and close modal
    setCompleted(false);
    setError(null);
    setSoldVoucher(null);
    setCopied(null);
    onClose();
  };

  // Get provider color for styling based on the voucher
  const getProviderColor = () => {
    if (!voucher) return "#666666";

    const providerMap: Record<string, string> = {
      MTN: "#ffcc00",
      Vodacom: "#e60000",
      CellC: isDark ? "#ffffff" : "#000000",
      Telkom: "#0066cc",
      Hollywoodbets: "#800080", // Purple
      Ringa: "#FFA500", // Orange
      Easyload: "#DAA520", // Golden
      OTT: "#008000",
    };

    // Use vendorId for Glocell vouchers
    if (voucher.supplier_name === "Glocell" && voucher.vendorId) {
      const vendorId = voucher.vendorId.toLowerCase();
      if (vendorId === "mtn") return providerMap.MTN;
      if (vendorId === "vodacom") return providerMap.Vodacom;
      if (vendorId === "cellc") return providerMap.CellC;
      if (vendorId === "telkom") return providerMap.Telkom;
    }

    // Use supplier_name for direct providers
    if (voucher.supplier_name === "Hollywoodbets")
      return providerMap.Hollywoodbets;
    if (voucher.supplier_name === "Ringa") return providerMap.Ringa;
    if (voucher.supplier_name === "Easyload") return providerMap.Easyload;
    if (voucher.supplier_name === "OTT") return providerMap.OTT;

    return "#666666";
  };

  return (
    <Dialog
      open={open}
      onClose={processing ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: isDark ? "rgb(18, 18, 18)" : "background.paper",
          borderTop: voucher ? `5px solid ${getProviderColor()}` : "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: isDark ? "#ffffff" : "text.primary",
          textAlign: "center",
          fontWeight: 600,
          pb: 1,
        }}
      >
        {completed ? "Voucher Sale Completed" : "Confirm Voucher Sale"}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {processing && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography
              variant="body1"
              sx={{ color: isDark ? "#ffffff" : "text.primary" }}
            >
              Processing your sale...
            </Typography>
          </Box>
        )}

        {!processing && !completed && voucher && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: isDark ? "#ffffff" : "text.primary",
                mb: 1,
              }}
            >
              {voucher.name}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: isDark ? "#ffffff" : "text.primary",
                mb: 2,
              }}
            >
              Amount:{" "}
              <span style={{ color: getProviderColor(), fontWeight: "bold" }}>
                R{voucher.amount.toFixed(2)}
              </span>
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: isDark ? "rgba(255,255,255,0.7)" : "text.secondary",
                mb: 2,
              }}
            >
              Please confirm that you want to sell this voucher. Once confirmed,
              the voucher will be marked as sold and the details will be
              displayed.
            </Typography>
          </Box>
        )}

        {!processing && completed && soldVoucher && (
          <Box>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: isDark
                  ? "rgba(30, 30, 30, 0.8)"
                  : "rgb(250, 250, 250)",
                borderRadius: 2,
                border: `1px solid ${getProviderColor()}30`,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={2}
              >
                <CheckCircleIcon
                  sx={{ color: "success.main", fontSize: 40, mb: 1 }}
                />
              </Box>

              <Typography
                variant="h6"
                align="center"
                gutterBottom
                sx={{ color: getProviderColor() }}
              >
                {soldVoucher.name}
              </Typography>

              <Typography
                variant="body1"
                align="center"
                sx={{ mb: 3, color: isDark ? "#ffffff" : "text.primary" }}
              >
                {soldVoucher.formattedAmount}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ p: 1 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.7)"
                        : "text.secondary",
                    }}
                  >
                    Voucher PIN
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: isDark ? "#ffffff" : "text.primary",
                        fontFamily: "monospace",
                        letterSpacing: "0.5px",
                        mr: 1,
                      }}
                    >
                      {soldVoucher.voucher_pin || "PIN not available"}
                    </Typography>
                    {soldVoucher.voucher_pin && (
                      <Button
                        size="small"
                        onClick={() =>
                          copyToClipboard(soldVoucher.voucher_pin, "pin")
                        }
                        sx={{ minWidth: 0, p: 0.5 }}
                      >
                        {copied === "pin" ? (
                          <CheckCircleIcon
                            fontSize="small"
                            sx={{ color: "success.main" }}
                          />
                        ) : (
                          <ContentCopyIcon fontSize="small" />
                        )}
                      </Button>
                    )}
                  </Box>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.7)"
                        : "text.secondary",
                    }}
                  >
                    Serial Number
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: isDark ? "#ffffff" : "text.primary",
                        fontFamily: "monospace",
                        letterSpacing: "0.5px",
                        mr: 1,
                      }}
                    >
                      {soldVoucher.voucher_serial_number || "S/N not available"}
                    </Typography>
                    {soldVoucher.voucher_serial_number && (
                      <Button
                        size="small"
                        onClick={() =>
                          copyToClipboard(
                            soldVoucher.voucher_serial_number,
                            "serial",
                          )
                        }
                        sx={{ minWidth: 0, p: 0.5 }}
                      >
                        {copied === "serial" ? (
                          <CheckCircleIcon
                            fontSize="small"
                            sx={{ color: "success.main" }}
                          />
                        ) : (
                          <ContentCopyIcon fontSize="small" />
                        )}
                      </Button>
                    )}
                  </Box>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.7)"
                        : "text.secondary",
                    }}
                  >
                    Provider
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: getProviderColor(),
                    }}
                  >
                    {/* {soldVoucher.supplier_name} */}
                    {soldVoucher.supplier_name === "Glocell" &&
                      soldVoucher.vendorId &&
                      ` ${soldVoucher.vendorId.toUpperCase()}`}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.7)"
                        : "text.secondary",
                    }}
                  >
                    Category
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: isDark ? "#ffffff" : "text.primary",
                    }}
                  >
                    {soldVoucher.category || "-"}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.7)"
                        : "text.secondary",
                    }}
                  >
                    Terminal ID
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: isDark ? "#ffffff" : "text.primary",
                    }}
                  >
                    {window.location.pathname.split("/").pop() || "Unknown"}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.7)"
                        : "text.secondary",
                    }}
                  >
                    Sale Time
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: isDark ? "#ffffff" : "text.primary",
                    }}
                  >
                    {new Date(soldVoucher.sale_time).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="body2"
                align="center"
                sx={{
                  mt: 2,
                  color: isDark ? "rgba(255,255,255,0.7)" : "text.secondary",
                }}
              >
                Please provide the above PIN and serial number to your customer.
              </Typography>
            </Paper>

            <Alert severity="info" sx={{ mb: 2 }}>
              You may need to print or save this information. You won't be able
              to retrieve it once you close this window.
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {!processing && !completed && (
          <>
            <Button
              onClick={handleClose}
              sx={{
                color: isDark ? "#ffffff" : null,
                opacity: 0.7,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSale}
              sx={{
                bgcolor: getProviderColor(),
                "&:hover": {
                  bgcolor: isDark
                    ? `${getProviderColor()}cc`
                    : `${getProviderColor()}dd`,
                },
              }}
            >
              Confirm Sale
            </Button>
          </>
        )}

        {!processing && completed && (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                // Here you could add printing functionality
                alert("Print functionality would be implemented here.");
              }}
              sx={{
                color: isDark ? "#ffffff" : null,
              }}
            >
              Print Receipt
            </Button>
            <Button variant="contained" onClick={handleClose} color="primary">
              Done
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SaleModal;