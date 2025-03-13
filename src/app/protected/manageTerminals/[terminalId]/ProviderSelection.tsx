"use client";

import React from "react";
import { Grid, Card, CardActionArea, CardMedia, useTheme } from "@mui/material";

// Provider configurations with colors for light/dark modes
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

interface ProviderSelectionProps {
  selectedProvider: string;
  onSelect: (providerName: string) => void;
}

const ProviderSelection: React.FC<ProviderSelectionProps> = ({
  selectedProvider,
  onSelect,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const providerColors = getProviderColors(isDark);
  const providers = [
    { name: "MTN", image: "/images/mtn.png" },
    { name: "Vodacom", image: "/images/vodacom.png" },
    { name: "CellC", image: "/images/cellc.png" },
    { name: "Telkom", image: "/images/telkom.jpeg" },
    { name: "OTT", image: "/images/ott_logo.png" },
  ];

  return (
    <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
      {providers.map((provider) => {
        const colors =
          providerColors[provider.name as keyof typeof providerColors];
        return (
          <Grid item xs={4} sm={2} key={provider.name}>
            <Card
              onClick={() => onSelect(provider.name)}
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                background: isDark ? colors.dark : colors.light,
                boxShadow:
                  selectedProvider === provider.name
                    ? `0px 2px 8px ${colors.border}40`
                    : "none",
                border:
                  selectedProvider === provider.name
                    ? `2px solid ${colors.border}`
                    : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0px 4px 12px ${colors.border}30`,
                },
                height: 90,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={provider.image}
                  alt={provider.name}
                  sx={{
                    height: 50,
                    objectFit: "contain",
                    mx: "auto",
                    filter:
                      selectedProvider === provider.name
                        ? "none"
                        : isDark
                          ? "brightness(0.8) contrast(1.2)"
                          : "grayscale(0.3)",
                    transition: "all 0.2s ease-in-out",
                  }}
                />
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ProviderSelection;
