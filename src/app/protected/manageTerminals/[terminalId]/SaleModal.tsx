// app/protected/manageTerminals/[terminalID]/SaleModal.tsx
import React, { useState, useEffect } from "react";
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
import { getRetailerByIdAction } from "../actions";

interface VoucherType {
  id: string;
  name: string;
  amount: string | number;
  formattedAmount?: string;
  category?: string;
  supplier_name?: string;
  vendorId?: string;
  status?: string;
  voucher_pin?: string;
  voucher_serial_number?: string;
  isApiVoucher?: boolean;
}

interface SaleModalProps {
  open: boolean;
  onClose: () => void;
  voucher: VoucherType | null;
  onVoucherSold?: () => void;
  assignedRetailerId: string | null;
}

const SaleModal: React.FC<SaleModalProps> = ({
  open,
  onClose,
  voucher,
  onVoucherSold,
  assignedRetailerId,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soldVoucher, setSoldVoucher] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [retailer, setRetailer] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [uniqueRef, setUniqueRef] = useState<string>("");

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

  // Function to handle the sale process
  const handleSale = async () => {
    if (!voucher) return;

    setProcessing(true);
    setError(null);

    try {
      console.log(`Processing sale for voucher ID: ${voucher.id}`);

      // Check if this is an API voucher
      if (voucher.isApiVoucher || voucher.supplier_name === "API") {
        // Handle API voucher sale
        await handleApiVoucherSale();
        return;
      }

      // 1. Check if the voucher is available and get its details
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

      // Check if voucher has required pin and serial number
      if (!voucherData.voucher_pin || !voucherData.voucher_serial_number) {
        throw new Error("Voucher is missing PIN or serial number");
      }

      // 2. Update the voucher status to 'sold'
      const currentTime = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("mobile_data_vouchers")
        .update({
          status: "sold",
          sold_datetime: currentTime,
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
        voucher_pin: voucherData.voucher_pin,
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

      // 4. Set the sold voucher with formatted amount
      const formattedVoucher = {
        ...voucherData,
        formattedAmount: formatAmount(voucherData.amount),
      };
      setSoldVoucher(formattedVoucher);

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

  // Function to handle API voucher sale
  const handleApiVoucherSale = async () => {
    try {
      console.log("Processing API voucher sale");

      // Check if voucher is null
      if (!voucher) {
        throw new Error("No voucher selected");
      }

      // In a real implementation, you would call the API to purchase the voucher
      // For now, we'll simulate a successful purchase

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a random PIN and serial number for the API voucher
      const pin = Math.floor(
        1000000000 + Math.random() * 9000000000,
      ).toString();
      const serial = `API-${Math.floor(100000 + Math.random() * 900000).toString()}`;

      // Set the sold voucher data to display
      setSoldVoucher({
        ...voucher,
        voucher_pin: pin,
        voucher_serial_number: serial,
        sale_time: new Date().toISOString(),
        formattedAmount: formatAmount(voucher.amount),
      });

      // Record the sale in the database
      const currentTerminalId =
        window.location.pathname.split("/").pop() || "UNKNOWN";

      const saleRecord = {
        supplier_id: 1, // Default supplier ID
        terminal_id: currentTerminalId,
        retailer_id: `RE${Math.floor(1000 + Math.random() * 9000)}`,
        voucher_amount: voucher.amount.toString(),
        voucher_group_id: 1, // Default group ID
        voucher_name: voucher.name || "",
        voucher_pin: pin,
        total_comm: "0",
        retailer_comm: "0",
        sales_agent_comm: "0",
        profit: "0",
        net_profit: "0",
        is_api_voucher: true,
        api_vendor: voucher.vendorId || "",
      };

      try {
        const { error: saleError } = await supabase
          .from("voucher_sales")
          .insert(saleRecord);

        if (saleError) {
          console.error("Error recording API sale:", saleError);
        } else {
          console.log("API sale recorded successfully");
        }
      } catch (saleErr) {
        console.error("Exception recording API sale:", saleErr);
      }

      setCompleted(true);
      console.log("API voucher sale completed successfully");
    } catch (err) {
      console.error("Error processing API voucher sale:", err);
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

  // Helper function to format amount properly
  const formatAmount = (amount: string | number | undefined): string => {
    if (!amount) return "R0.00";

    const amountNumber = parseFloat(String(amount));
    if (isNaN(amountNumber)) return `R${amount}`;

    // Check if amount is in cents (large number) or in rand (small number)
    if (amountNumber > 100) {
      // Amount is in cents, convert to rand
      return `R${(amountNumber / 100).toFixed(2)}`;
    } else {
      // Amount is already in rand
      return `R${amountNumber.toFixed(2)}`;
    }
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

  // Helper for provider instructions
  const getLoadInstructions = (provider: string | undefined) => {
    if (!provider) return "";
    if (provider.toLowerCase() === "mtn") return "Dial *136*(voucher number)#";
    return "See voucher for instructions";
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
          color: isDark ? "#ffffff" : "text.primary",
          textAlign: "center",
          fontWeight: 600,
          pb: 1,
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        }}
      >
        {completed ? "Voucher Sale Completed" : "Confirm Voucher Sale"}
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: isDark ? "rgba(211, 47, 47, 0.1)" : undefined,
              color: isDark ? "#ffffff" : "text.primary",
            }}
          >
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
            <CircularProgress
              size={60}
              sx={{ mb: 2, color: isDark ? "#ffffff" : undefined }}
            />
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
                {voucher?.formattedAmount || formatAmount(voucher?.amount)}
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
                sx={{ color: getProviderColor() }}
              >
                {soldVoucher.name}
              </Typography>
              <Typography
                variant="body1"
                align="center"
                sx={{ mb: 2, color: isDark ? "#ffffff" : "text.primary" }}
              >
                {soldVoucher.formattedAmount ||
                  formatAmount(soldVoucher.amount)}
              </Typography>

              {/* Loading instructions */}
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                {getLoadInstructions(
                  soldVoucher.vendorId || soldVoucher.supplier_name,
                )}
              </Typography>

              {/* Voucher PIN, Serial, Reference, Date/Time */}
              <Typography
                variant="h5"
                align="center"
                sx={{ fontFamily: "monospace", letterSpacing: 2, mb: 2 }}
              >
                {soldVoucher.voucher_pin || "PIN not available"}
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                Serial Number:{" "}
                {soldVoucher.voucher_serial_number || "S/N not available"}
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                Ref: {uniqueRef}
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                Date:{" "}
                {soldVoucher.sale_time
                  ? new Date(soldVoucher.sale_time).toLocaleString()
                  : "-"}
              </Typography>
            </Paper>

            <Alert
              severity="info"
              sx={{
                mb: 2,
                bgcolor: isDark ? "rgba(33, 150, 243, 0.1)" : undefined,
                color: isDark ? "#ffffff" : "text.primary",
              }}
            >
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
                color: isDark ? "#ffffff" : "text.primary",
                opacity: 0.7,
                "&:hover": {
                  opacity: 1,
                },
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
                alert("Print functionality would be implemented here.");
              }}
              sx={{
                color: isDark ? "#ffffff" : "text.primary",
                borderColor: isDark
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)",
                "&:hover": {
                  borderColor: isDark ? "#ffffff" : "text.primary",
                },
              }}
            >
              Print Receipt
            </Button>
            <Button
              variant="contained"
              onClick={handleClose}
              color="primary"
              sx={{
                bgcolor: isDark ? "rgba(25, 118, 210, 0.9)" : undefined,
                "&:hover": {
                  bgcolor: isDark ? "rgba(25, 118, 210, 1)" : undefined,
                },
              }}
            >
              Done
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SaleModal;