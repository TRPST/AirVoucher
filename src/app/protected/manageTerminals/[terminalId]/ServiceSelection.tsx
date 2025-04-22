"use client";

import React from "react";
import { Grid, Typography, Card, CardContent, useTheme } from "@mui/material";

const services = [
  { name: "Airtime" },
  { name: "Data" },
  { name: "SMS" },
  { name: "Top-up" },
];

const getProviderImageUrl = (provider: string) => {
  switch (provider.toLowerCase()) {
    case "vodacom":
      return "/images/vodacom.png";
    case "mtn":
      return "/images/mtn.png";
    case "cellc":
      return "/images/cellc.png";
    case "telkom":
      return "/images/telkom.jpeg";
    default:
      return "";
  }
};

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
    <div className="mt-4">
      {selectedProvider ? (
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
                xs={6}
                sm={3}
                key={service.name}
                sx={{
                  p: "4px !important",
                }}
              >
                <Card
                  onClick={() => onSelect(service.name)}
                  sx={{
                    cursor: "pointer",
                    background: "#fff",
                    border:
                      selectedService === service.name
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
                    padding: "16px 8px",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0px 2px 4px rgba(0, 0, 0, 0.1)`,
                      borderColor: colors.border,
                    },
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundImage: `url(${getProviderImageUrl(selectedProvider)})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      marginBottom: "8px",
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#666666",
                      fontWeight: selectedService === service.name ? 600 : 500,
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {service.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography
          variant="subtitle1"
          sx={{
            mt: 2,
            textAlign: "center",
            color: "error.main",
            fontSize: "0.875rem",
          }}
        >
          Please select a provider first.
        </Typography>
      )}
    </div>
  );
};

export default ServiceSelection;
