// app/protected/manageTerminals/[terminalID]/OTTModal.tsx
import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ Ensure axios is imported
import crypto from "crypto-js"; // ✅ Use crypto-js for hashing (browser-safe)
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
} from "@mui/material";

interface OTTModalProps {
  open: boolean;
  onClose: () => void;
  onIssueVoucher: (amount: number) => Promise<void>;
}

interface VoucherResponse {
  success: boolean;
  message?: string;
  voucher?: {
    voucherID: string;
    pin: string;
    serialNumber: string;
    saleID: string;
    amount: number;
  };
}

interface HashParams {
  [key: string]: string | number;
}

const OTTModal: React.FC<OTTModalProps> = ({
  open,
  onClose,
  onIssueVoucher,
}) => {
  // OTT State Management
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [voucherResponse, setVoucherResponse] =
    useState<VoucherResponse | null>(null);
  const [confirmationAction, setConfirmationAction] = useState<
    (() => Promise<void>) | null
  >(null);
  const amounts = [10, 20, 50, 100, 200, 1000, 2000]; // ✅ Define voucher amounts

  // OTT API Credentials
  const BASE_URL = "/api/ott";
  const username = "AIRVOUCHER";
  const password = "v95Hp_#kc+";
  const apiKey = "b39abd74-534c-44dc-a8ba-62a89dc8d31c";

  // Helper Functions
  const generateHash = (params: HashParams) => {
    const sortedKeys = Object.keys(params).sort();
    const concatenatedString = [
      apiKey,
      ...sortedKeys.map((key) => params[key]),
    ].join("");
    return crypto.SHA256(concatenatedString).toString(); // ✅ Use SHA256 hashing
  };

  const getAuthHeaders = () => {
    const token = btoa(`${username}:${password}`); // ✅ Base64 encode credentials
    return { Authorization: `Basic ${token}` };
  };

  const generateUniqueReference = () =>
    `ref-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

  // Fetch OTT Balance when Modal Opens
  useEffect(() => {
    if (open) {
      fetchBalance();
    }
  }, [open]);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const uniqueReference = generateUniqueReference();
      const params = { uniqueReference };
      const hash = generateHash(params);

      const res = await axios.post(
        `${BASE_URL}/reseller/v1/GetBalance`,
        new URLSearchParams({ uniqueReference, hash }),
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      console.log("OTT Balance Response:", res.data);
      setBalance(res.data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error fetching balance");
    } finally {
      setLoading(false);
    }
  };

  // Issue a Voucher
  const handleIssueVoucher = async (amount: number) => {
    setLoading(true);
    try {
      await onIssueVoucher(amount);
      fetchBalance(); // Refresh balance after issuing voucher
    } catch (error) {
      console.error("Error issuing voucher:", error);
      setVoucherResponse({
        success: false,
        message: "An error occurred while issuing the voucher.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>OTT Voucher</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Balance: R{balance}
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{ mt: 2, justifyContent: "center" }}
            >
              {amounts.map((amount) => (
                <Grid item xs={6} sm={3} key={amount}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 2,
                    }}
                    onClick={() =>
                      setConfirmationAction(
                        () => () => handleIssueVoucher(amount),
                      )
                    }
                  >
                    <img
                      src="/images/ott_logo.png"
                      alt="OTT Logo"
                      style={{ height: 40, width: "auto", marginBottom: 5 }}
                    />
                    <Typography variant="h6">R{amount}</Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Custom Amount Input */}
            <TextField
              fullWidth
              label="Enter Custom Amount"
              variant="outlined"
              sx={{ mt: 2 }}
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => {
                setConfirmationAction(
                  () => () => handleIssueVoucher(parseFloat(customAmount) || 0),
                );
                setCustomAmount("");
              }}
            >
              Confirm Custom Amount
            </Button>

            {/* Display Voucher Response */}
            {voucherResponse && (
              <div>
                <Typography variant="h6">Voucher Details:</Typography>
                <Typography>
                  Voucher ID: {voucherResponse.voucher?.voucherID || "N/A"}
                </Typography>
                <Typography>
                  PIN: {voucherResponse.voucher?.pin || "N/A"}
                </Typography>
                <Typography>
                  Serial Number:{" "}
                  {voucherResponse.voucher?.serialNumber || "N/A"}
                </Typography>
                <Typography>
                  Sale ID: {voucherResponse.voucher?.saleID || "N/A"}
                </Typography>
                <Typography>
                  Amount: R{voucherResponse.voucher?.amount || "N/A"}
                </Typography>
              </div>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      {/* Confirmation Prompt */}
      <Dialog
        open={Boolean(confirmationAction)}
        onClose={() => setConfirmationAction(null)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to proceed?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationAction(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (confirmationAction) confirmationAction();
              setConfirmationAction(null);
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default OTTModal;
