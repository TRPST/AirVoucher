"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { supabase } from "../../../../../utils/supabase/client";

// Provider configurations with colors for light/dark modes
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
    border: "rgb(128, 0, 128)",
  },
  Ringa: {
    light: "rgba(255, 165, 0, 0.15)",
    dark: "rgba(255, 165, 0, 0.12)",
    border: "rgb(255, 165, 0)",
  },
  Easyload: {
    light: "rgba(218, 165, 32, 0.15)",
    dark: "rgba(218, 165, 32, 0.12)",
    border: "rgb(218, 165, 32)",
  },

  Electricity: {
    light: "rgba(218, 165, 32, 0.15)",
    dark: "rgba(218, 165, 32, 0.12)",
    border: "rgb(32, 44, 218)",
  },
  Dstv: {
    light: "rgba(218, 165, 32, 0.15)",
    dark: "rgba(218, 165, 32, 0.12)",
    border: "rgb(32, 44, 218)",
  },
  // Default fallback for any new providers from the database
  DEFAULT: {
    light: "rgba(100, 100, 100, 0.15)",
    dark: "rgba(100, 100, 100, 0.12)",
    border: isDark ? "rgb(200, 200, 200)" : "rgb(100, 100, 100)",
  },
});

interface Provider {
  id: string;
  name: string;
  image_url?: string;
  color_code?: string;
  requires_service_selection?: boolean;
}

interface ProviderSelectionProps {
  selectedProvider: string;
  onSelect: (providerName: string, requiresServiceSelection?: boolean) => void;
}

const ProviderSelection: React.FC<ProviderSelectionProps> = ({
  selectedProvider,
  onSelect,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const providerColors = getProviderColors(isDark);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static fallback providers in case database fetch fails
  const fallbackProviders = [
    {
      id: "1",
      name: "MTN",
      image_url: "/images/mtn.png",
      requires_service_selection: true,
    },
    {
      id: "2",
      name: "Vodacom",
      image_url: "/images/vodacom.png",
      requires_service_selection: true,
    },
    {
      id: "3",
      name: "CellC",
      image_url: "/images/cellc.png",
      requires_service_selection: true,
    },
    {
      id: "4",
      name: "Telkom",
      image_url: "/images/telkom.jpeg",
      requires_service_selection: true,
    },
    {
      id: "5",
      name: "OTT",
      image_url: "/images/ott_logo.png",
      requires_service_selection: false,
    },
    {
      id: "6",
      name: "Hollywoodbets",
      image_url: "/images/hollywoodbets.png",
      requires_service_selection: false,
    },
    {
      id: "7",
      name: "Ringa",
      image_url: "/images/ringa.jpg",
      requires_service_selection: false,
    },
    {
      id: "8",
      name: "Easyload",
      image_url: "/images/easyload.png",
      requires_service_selection: false,
    },
    {
      id: "9",
      name: "Electricity",
      image_url: "/images/electricity.jpg",
      requires_service_selection: false,
    },
    {
      id: "10",
      name: "Dstv",
      image_url: "/images/dstv.png",
      requires_service_selection: false,
    },
  ];

  useEffect(() => {
    // Remove the database query and just use fallback providers
    setProviders(fallbackProviders);
    setLoading(false);
  }, []);

  // Helper function to get provider color
  const getProviderColor = (providerName: string) => {
    return (
      providerColors[providerName as keyof typeof providerColors] ||
      providerColors.DEFAULT
    );
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
      {providers.map((provider) => {
        const colors = getProviderColor(provider.name);
        return (
          <Grid item xs={4} sm={2} key={provider.id || provider.name}>
            <Card
              onClick={() =>
                onSelect(provider.name, provider.requires_service_selection)
              }
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                background: isDark ? "rgba(30, 30, 30, 0.8)" : "#fff",
                boxShadow:
                  selectedProvider === provider.name
                    ? `0px 2px 8px ${colors.border}40`
                    : "none",
                border:
                  selectedProvider === provider.name
                    ? `3px solid ${colors.border}`
                    : `2px solid ${colors.border}`,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0px 4px 12px ${colors.border}50`,
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
                  image={provider.image_url || "/images/default_provider.png"}
                  alt={provider.name}
                  sx={{
                    height: 60,
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
