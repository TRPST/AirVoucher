// app/protected/manageTerminals/[terminalID]/VoucherList.tsx
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface Voucher {
  id: string;
  name: string;
  category: string;
  amount: number;
  vendorId: string;
}

interface VoucherListProps {
  vouchers: Voucher[];
  onSelect: (voucher: Voucher) => void;
  selectedProvider?: string;
}

const getProviderColors = (isDark: boolean) => ({
  MTN: {
    light: "rgba(255, 204, 0, 0.15)",
    dark: "rgb(225, 225, 225)",
    border: "rgb(255, 204, 0)",
  },
  Vodacom: {
    light: "rgba(255, 0, 0, 0.15)",
    dark: "rgb(252, 252, 252)",
    border: "rgb(255, 0, 0)",
  },
  CellC: {
    light: "rgba(0, 0, 0, 0.15)",
    dark: "rgb(249, 249, 249)",
    border: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  Telkom: {
    light: "rgba(0, 102, 204, 0.15)",
    dark: "rgb(250, 250, 250)",
    border: "rgb(0, 102, 204)",
  },
  OTT: {
    light: "rgba(0, 128, 0, 0.15)",
    dark: "rgba(0, 128, 0, 0.08)",
    border: "rgb(0, 128, 0)",
  },
});

const VoucherList: React.FC<VoucherListProps> = ({
  vouchers,
  onSelect,
  selectedProvider = "MTN",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const providerColors = getProviderColors(isDark);
  const colors =
    providerColors[selectedProvider as keyof typeof providerColors] ||
    providerColors.MTN;

  return (
    <div className="mt-6">
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          textAlign: "center",
          color: isDark ? colors.border : theme.palette.text.primary,
        }}
      >
        Available Vouchers
      </Typography>
      <Grid container spacing={2}>
        {vouchers.map((voucher) => (
          <Grid item xs={12} sm={6} md={4} key={voucher.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: isDark ? colors.dark : colors.light,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                borderRadius: 1,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0px 4px 12px ${colors.border}30`,
                },
              }}
            >
              <CardContent sx={{ p: 2, pb: "12px" }}>
                <Typography variant="subtitle1" gutterBottom>
                  {voucher.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
                  {voucher.category}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.border,
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  R{(voucher.amount / 100).toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  onClick={() => onSelect(voucher)}
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    mt: "auto",
                    background: isDark
                      ? colors.dark.replace("0.08", "0.3")
                      : colors.light.replace("0.15", "0.9"),
                    color: colors.border,
                    border: `1px solid ${colors.border}`,
                    "&:hover": {
                      background: isDark
                        ? colors.dark.replace("0.08", "0.4")
                        : colors.light.replace("0.15", "1"),
                    },
                  }}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default VoucherList;
