"use client";

import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { supabase } from "../../../../../utils/supabase/client";

const services = [
  { name: "Airtime", icon: "📱" },
  { name: "Data", icon: "🌐" },
  { name: "SMS", icon: "✉️" },
  { name: "Top-up", icon: "💰" },
];

const getProviderColors = (isDark: boolean) => ({
  MTN: {
    light: "rgba(255, 204, 0, 0.15)",
    dark: "rgba(255, 204, 0, 0.08)",
    border: "rgb(255, 204, 0)",
  },
  Vodacom: {
    light: "rgba(255, 0, 0, 0.15)",
    dark: "rgba(255, 0, 0, 0.08)",
    border: "rgb(255, 0, 0)",
  },
  CellC: {
    light: "rgba(0, 0, 0, 0.15)",
    dark: "rgba(255, 255, 255, 0.08)",
    border: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  Telkom: {
    light: "rgba(0, 102, 204, 0.15)",
    dark: "rgba(0, 102, 204, 0.08)",
    border: "rgb(0, 102, 204)",
  },
  OTT: {
    light: "rgba(0, 128, 0, 0.15)",
    dark: "rgba(0, 128, 0, 0.08)",
    border: "rgb(0, 128, 0)",
  },
});

interface ServiceSelectionProps {
  selectedProvider: string;
  selectedService: string;
  onSelect: (service: string) => void;
  terminalId: string;
  commGroupId: string;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedProvider,
  selectedService,
  onSelect,
  terminalId,
  commGroupId,
}) => {
  interface Voucher {
    id: string;
    name: string;
    category: string;
    amount: number;
    vendorId: string;
  }

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const providerColors = getProviderColors(isDark);
  const colors = providerColors[selectedProvider as keyof typeof providerColors] || providerColors.MTN;

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVouchers = async (service: string) => {
    setLoading(true);
    setError(null);
    setVouchers([]);

    try {
      if (!commGroupId) {
        throw new Error("Error: comm_group_id is missing!");
      }

      const voucherGroupName = `${selectedProvider} ${service}`;
      const { data: voucherGroup, error: groupError } = await supabase
        .from("voucher_groups")
        .select("id")
        .eq("voucher_group_name", voucherGroupName)
        .single();

      if (groupError || !voucherGroup) {
        setVouchers([]);
        return;
      }

      const { data: fetchedVouchers, error: vouchersError } = await supabase
        .from("mobile_data_vouchers")
        .select("*")
        .eq("comm_group_id", commGroupId)
        .eq("vendorId", selectedProvider.toLowerCase());

      if (vouchersError) {
        throw new Error("Error fetching vouchers.");
      }

      setVouchers(fetchedVouchers || []);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {selectedProvider ? (
        <>
          <Typography variant="h6" sx={{ mb: 3, textAlign: "center", color: isDark ? colors.border : theme.palette.text.primary }}>
            Select a Service for {selectedProvider}
          </Typography>

          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            {services.map((service) => (
              <Grid item xs={6} sm={3} key={service.name}>
                <Card
                  onClick={() => {
                    onSelect(service.name);
                    fetchVouchers(service.name);
                  }}
                  sx={{
                    cursor: "pointer",
                    background: selectedService === service.name
                      ? isDark ? colors.dark.replace("0.08", "0.15") : colors.light.replace("0.15", "0.25")
                      : isDark ? colors.dark : colors.light,
                    border: selectedService === service.name
                      ? `2px solid ${colors.border}`
                      : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: 1,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0px 4px 12px ${colors.border}30`,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      {service.icon}
                    </Typography>
                    <Typography variant="subtitle1">{service.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {loading && (
            <div className="mt-6 flex justify-center">
              <CircularProgress sx={{ color: colors.border }} />
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-red-700 dark:text-red-200">
              <Typography variant="body2">{error}</Typography>
            </div>
          )}

          {vouchers.length > 0 && (
            <div className="mt-6">
              <Typography variant="h6" sx={{ mb: 3, textAlign: "center", color: isDark ? colors.border : theme.palette.text.primary }}>
                Available Vouchers
              </Typography>
              <Grid container spacing={2}>
                {vouchers.map((voucher) => (
                  <Grid item xs={12} sm={6} md={4} key={voucher.id}>
                    <Card
                      sx={{
                        background: isDark ? colors.dark : colors.light,
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        borderRadius: 1,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0px 4px 12px ${colors.border}30`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {voucher.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
                          {voucher.category || selectedService}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: colors.border,
                            fontWeight: "bold",
                          }}
                        >
                          R{(voucher.amount / 100).toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
        </>
      ) : (
        <Typography
          variant="subtitle1"
          sx={{ mt: 4, textAlign: "center", color: "error.main" }}
        >
          Please select a provider first.
        </Typography>
      )}
    </div>
  );
};

export default ServiceSelection;
