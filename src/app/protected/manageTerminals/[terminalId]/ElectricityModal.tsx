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

interface ElectricityModalProps {
  open: boolean;
  onClose: () => void;
}

const ElectricityModal: React.FC<ElectricityModalProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [loading, setLoading] = useState(false);
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [meterDetails, setMeterDetails] = useState<any>(null);
  const [purchaseResponse, setPurchaseResponse] = useState<any>(null);

  // Theme-aware colors
  const electricityColor = isDark
    ? "rgba(255, 140, 0, 0.08)"
    : "rgba(255, 140, 0, 0.15)";
  const electricityBorder = isDark ? "rgb(64, 0, 255)" : "rgb(0, 38, 255)";
  const textColor = isDark
    ? theme.palette.text.primary
    : theme.palette.text.primary;
  const buttonBg = isDark ? "rgba(0, 30, 255, 0.2)" : "rgba(0, 81, 255, 0.9)";
  const buttonHoverBg = isDark ? "rgba(0, 68, 255, 0.3)" : "rgb(0, 115, 255)";

  const handleMeterLookup = async () => {
    setLoading(true);
    try {
      // TODO: Implement meter lookup API call
      setMeterDetails({
        address: "123 Main Street",
        municipality: "City Power",
        meterType: "Prepaid",
        lastPurchase: "R 100.00 (2024-02-20)",
      });
    } catch (error) {
      console.error("Error looking up meter:", error);
      setMeterDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // TODO: Implement purchase API call
      setPurchaseResponse({
        success: true,
        message: "Purchase successful",
        reference: "ELC" + Date.now(),
        amount: amount,
        token: "1234-5678-9012-3456",
        units: "52.7 kWh",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error processing purchase:", error);
      setPurchaseResponse({
        success: false,
        message: "Purchase failed",
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
          sx={{ color: electricityBorder, fontWeight: "bold", mb: 1 }}
        >
          Electricity Purchase
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "text.secondary",
            opacity: 0.7,
          }}
        >
          Buy prepaid electricity tokens
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <CircularProgress sx={{ color: electricityBorder }} />
          </div>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Card
                sx={{
                  background: electricityColor,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Meter Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        placeholder="Enter Meter Number"
                        variant="outlined"
                        size="small"
                        value={meterNumber}
                        onChange={(e) => setMeterNumber(e.target.value)}
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
                        onClick={handleMeterLookup}
                        sx={{
                          background: buttonBg,
                          color: "#fff",
                          border: `1px solid ${electricityBorder}`,
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

            {meterDetails && (
              <>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      background: electricityColor,
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Meter Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: textColor, opacity: 0.7 }}
                          >
                            Address
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {meterDetails.address}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: textColor, opacity: 0.7 }}
                          >
                            Municipality
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {meterDetails.municipality}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: textColor, opacity: 0.7 }}
                          >
                            Meter Type
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {meterDetails.meterType}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: textColor, opacity: 0.7 }}
                          >
                            Last Purchase
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {meterDetails.lastPurchase}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card
                    sx={{
                      background: electricityColor,
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Purchase Amount
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
                            onClick={handlePurchase}
                            sx={{
                              background: buttonBg,
                              color: "#fff",
                              border: `1px solid ${electricityBorder}`,
                              "&:hover": {
                                background: buttonHoverBg,
                              },
                            }}
                          >
                            Purchase
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}

            {purchaseResponse && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background: purchaseResponse.success
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
                    {purchaseResponse.success ? (
                      <>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ textAlign: "center" }}
                        >
                          Purchase Successful
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography
                              variant="caption"
                              sx={{ color: textColor, opacity: 0.7 }}
                            >
                              Token Number
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ mb: 1, fontFamily: "monospace" }}
                            >
                              {purchaseResponse.token}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="caption"
                              sx={{ color: textColor, opacity: 0.7 }}
                            >
                              Amount Paid
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              R{purchaseResponse.amount}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="caption"
                              sx={{ color: textColor, opacity: 0.7 }}
                            >
                              Units
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {purchaseResponse.units}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="caption"
                              sx={{ color: textColor, opacity: 0.7 }}
                            >
                              Reference Number
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {purchaseResponse.reference}
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
                                purchaseResponse.timestamp,
                              ).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <Typography color="error" variant="body2" align="center">
                        {purchaseResponse.message}
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
            borderColor: `${electricityBorder}50`,
            color: electricityBorder,
            "&:hover": {
              borderColor: electricityBorder,
              background: electricityColor,
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ElectricityModal;
