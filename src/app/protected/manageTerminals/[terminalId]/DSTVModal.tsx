import React, { useState } from "react";
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

interface DSTVModalProps {
  open: boolean;
  onClose: () => void;
}

const DSTVModal: React.FC<DSTVModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [loading, setLoading] = useState(false);
  const [smartcardNumber, setSmartcardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);

  // Theme-aware colors
  const dstvColor = isDark ? "rgba(0, 0, 139, 0.08)" : "rgba(0, 0, 139, 0.15)";
  const dstvBorder = isDark ? "rgb(30, 144, 255)" : "rgb(0, 0, 139)";
  const textColor = isDark
    ? theme.palette.text.primary
    : theme.palette.text.primary;
  const buttonBg = isDark ? "rgba(30, 144, 255, 0.2)" : "rgba(0, 0, 139, 0.9)";
  const buttonHoverBg = isDark
    ? "rgba(30, 144, 255, 0.3)"
    : "rgba(0, 0, 139, 1)";

  const handleSmartcardLookup = async () => {
    setLoading(true);
    try {
      // TODO: Implement smartcard lookup API call
      setCustomerDetails({
        name: "John Doe",
        accountNumber: "12345678",
        package: "DSTV Premium",
        balance: "R 0.00",
      });
    } catch (error) {
      console.error("Error looking up smartcard:", error);
      setCustomerDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // TODO: Implement payment API call
      setPaymentResponse({
        success: true,
        message: "Payment successful",
        reference: "DST" + Date.now(),
        amount: amount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentResponse({
        success: false,
        message: "Payment failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          background: isDark ? "rgb(18, 18, 18)" : "background.paper",
          color: isDark ? "#ffffff" : "text.primary",
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
          sx={{ color: dstvBorder, fontWeight: "bold", mb: 1 }}
        >
          DSTV Payment Service
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "text.secondary",
            opacity: 0.7,
          }}
        >
          Pay your DSTV subscription
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <CircularProgress sx={{ color: dstvBorder }} />
          </div>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Card
                sx={{
                  background: dstvColor,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Smartcard Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        placeholder="Enter Smartcard Number"
                        variant="outlined"
                        size="small"
                        value={smartcardNumber}
                        onChange={(e) => setSmartcardNumber(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            background: isDark ? "rgba(0,0,0,0.2)" : "white",
                            color: isDark ? "#ffffff" : "text.primary",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSmartcardLookup}
                        sx={{
                          background: buttonBg,
                          color: "#fff",
                          border: `1px solid ${dstvBorder}`,
                          "&:hover": {
                            background: buttonHoverBg,
                          },
                        }}
                      >
                        Lookup
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {customerDetails && (
              <>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      background: dstvColor,
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Customer Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: textColor, opacity: 0.7 }}
                          >
                            Name
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {customerDetails.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: textColor, opacity: 0.7 }}
                          >
                            Account Number
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {customerDetails.accountNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: textColor, opacity: 0.7 }}
                          >
                            Current Package
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {customerDetails.package}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: textColor, opacity: 0.7 }}
                          >
                            Balance
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {customerDetails.balance}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card
                    sx={{
                      background: dstvColor,
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Payment Amount
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            fullWidth
                            placeholder="Enter Amount"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                background: isDark
                                  ? "rgba(0,0,0,0.2)"
                                  : "white",
                                color: isDark ? "#ffffff" : "text.primary",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={handlePayment}
                            sx={{
                              background: buttonBg,
                              color: "#fff",
                              border: `1px solid ${dstvBorder}`,
                              "&:hover": {
                                background: buttonHoverBg,
                              },
                            }}
                          >
                            Pay Now
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}

            {paymentResponse && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background: paymentResponse.success
                      ? isDark
                        ? "rgba(0, 180, 0, 0.1)"
                        : "rgba(0, 255, 0, 0.1)"
                      : isDark
                        ? "rgba(255, 0, 0, 0.1)"
                        : "rgba(255, 0, 0, 0.1)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                  }}
                >
                  <CardContent>
                    {paymentResponse.success ? (
                      <>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ textAlign: "center" }}
                        >
                          Payment Successful
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography
                              variant="caption"
                              sx={{ color: textColor, opacity: 0.7 }}
                            >
                              Reference Number
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {paymentResponse.reference}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="caption"
                              sx={{ color: textColor, opacity: 0.7 }}
                            >
                              Amount Paid
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              R{paymentResponse.amount}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                textAlign: "center",
                                color: textColor,
                                opacity: 0.7,
                              }}
                            >
                              {new Date(
                                paymentResponse.timestamp,
                              ).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <Typography color="error" variant="body2" align="center">
                        {paymentResponse.message}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: `${dstvBorder}50`,
            color: dstvBorder,
            "&:hover": {
              borderColor: dstvBorder,
              background: dstvColor,
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DSTVModal;
