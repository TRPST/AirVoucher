"use client";

import React from "react";
import { Grid, Typography, Card, CardContent, useTheme } from "@mui/material";

const services = [
  { name: "Airtime", icon: "📱" },
  { name: "Data", icon: "🌐" },
  { name: "SMS", icon: "✉️" },
  { name: "Top-up", icon: "💰" },
];

const getProviderColors = (isDark: boolean) => ({
  MTN: {
    light: "rgba(255, 204, 0, 0.15)",
    dark: "rgba(255, 204, 0, 0.12)",
    border: "rgb(255, 204, 0)",
  },
  Vodacom: {
    light: "rgba(255, 0, 0, 0.15)",
    dark: "rgba(255, 0, 0, 0.12)",
    border: "rgb(255, 0, 0)",
  },
  CellC: {
    light: "rgba(0, 0, 0, 0.15)",
    dark: "rgba(255, 255, 255, 0.12)",
    border: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  },
  Telkom: {
    light: "rgba(0, 102, 204, 0.15)",
    dark: "rgba(0, 102, 204, 0.12)",
    border: "rgb(0, 102, 204)",
  },
  OTT: {
    light: "rgba(0, 128, 0, 0.15)",
    dark: "rgba(0, 128, 0, 0.12)",
    border: "rgb(0, 128, 0)",
  },
  Hollywoodbets: {
    light: "rgba(128, 0, 128, 0.15)",
    dark: "rgba(128, 0, 128, 0.12)",
    border: "rgb(128, 0, 128)", // Purple
  },
  Ringa: {
    light: "rgba(255, 165, 0, 0.15)",
    dark: "rgba(255, 165, 0, 0.12)",
    border: "rgb(255, 165, 0)", // Orange
  },
  Easyload: {
    light: "rgba(218, 165, 32, 0.15)",
    dark: "rgba(218, 165, 32, 0.12)",
    border: "rgb(218, 165, 32)", // Golden
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
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const providerColors = getProviderColors(isDark);
  const colors =
    providerColors[selectedProvider as keyof typeof providerColors] ||
    providerColors.MTN;

  return (
    <div className="mt-6">
      {selectedProvider ? (
        <>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              textAlign: "center",
              color: isDark ? "#ffffff" : "#333333",
              fontWeight: 600,
              background: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.05)",
              py: 1,
              borderRadius: 1,
              boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
            }}
          >
            Select a Service for {selectedProvider}
          </Typography>

          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            {services.map((service) => (
              <Grid item xs={6} sm={3} key={service.name}>
                <Card
                  onClick={() => onSelect(service.name)}
                  sx={{
                    cursor: "pointer",
                    background: isDark ? "rgba(30, 30, 30, 0.8)" : "#fff",
                    border:
                      selectedService === service.name
                        ? `3px solid ${colors.border}`
                        : `2px solid ${colors.border}`,
                    borderRadius: 1,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0px 4px 12px ${colors.border}50`,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography
                      variant="h5"
                      sx={{ mb: 1, color: colors.border }}
                    >
                      {service.icon}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: isDark ? "#ffffff" : "#333333",
                        fontWeight: isDark ? 700 : 500,
                        textShadow: isDark
                          ? "0 1px 2px rgba(0,0,0,0.8)"
                          : "none",
                      }}
                    >
                      {service.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
