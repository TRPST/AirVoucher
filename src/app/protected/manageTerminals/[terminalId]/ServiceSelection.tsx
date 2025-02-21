// import React from "react";
// import { Button } from "@mui/material";

// const services = ["Airtime", "Data", "SMS", "Top-up"];

// const ServiceSelection = ({ selectedService, onSelect }) => (
//   <div className="mt-4 grid grid-cols-3 gap-4">
//     {services.map((service) => (
//       <Button
//         key={service}
//         variant={selectedService === service ? "contained" : "outlined"}
//         onClick={() => onSelect(service)}
//         fullWidth
//       >
//         {service}
//       </Button>
//     ))}
//   </div>
// );

// export default ServiceSelection;

import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import ProviderSelection from "./ProviderSelection";

const services = ["Airtime", "Data", "SMS", "Top-up"];

interface Voucher {
  id: string;
  name: string;
  category: string;
  amount: number;
  vendorId?: string;
}

interface ServiceSelectionProps {
  selectedProvider: string | null;
  selectedService: string | null;
  onSelect: (service: string) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedProvider,
  selectedService,
  onSelect,
}) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log provider selection for debugging
  useEffect(() => {
    console.log("Received selectedProvider:", selectedProvider);
  }, [selectedProvider]);

  // Fetch Vouchers based on service type
  const fetchVouchers = async (service: string) => {
    if (!selectedProvider) {
      const errorMsg = "Please select a provider before choosing a service.";
      console.error("Error: No provider selected");
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setVouchers([]);

    const url =
      service === "Airtime"
        ? "https://api.qa.bltelecoms.net/v2/trade/mobile/airtime/products"
        : "https://api.qa.bltelecoms.net/v2/trade/mobile/bundle/products";

    const username = "bld";
    const password = "ornuk3i9vseei125s8qea71kub";
    const apiKey = "b97ac3ea-da33-11ef-9cd2-0242ac120002";

    const authHeader = "Basic " + btoa(`${username}:${password}`);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: authHeader,
          apikey: apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vouchers. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Fetched ${service} Data:`, JSON.stringify(data, null, 2));

      // Ensure data is valid
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid API response: No vouchers found.");
      }

      if (!selectedProvider) {
        throw new Error("Please select a provider.");
      }

      console.log("Selected Provider:", selectedProvider);

      // Fix Filtering Logic (Handle case differences)
      const filteredVouchers = data.filter((v) =>
        v.vendorId?.toLowerCase().includes(selectedProvider.toLowerCase()),
      );

      console.log(
        "Filtered Vouchers:",
        JSON.stringify(filteredVouchers, null, 2),
      );

      if (filteredVouchers.length === 0) {
        throw new Error(`No vouchers available for ${selectedProvider}.`);
      }

      setVouchers(filteredVouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle service selection
  const selectService = async (service: string) => {
    if (!selectedProvider) {
      console.error("Cannot select service, provider not selected.");
      setError("Please select a provider before choosing a service.");
      return;
    }

    onSelect(service);
    await fetchVouchers(service);
  };

  return (
    <div>
      {selectedProvider ? (
        <>
          <Typography variant="h5">
            Select a Service for {selectedProvider}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
            {services.map((service) => (
              <Grid item xs={6} sm={3} key={service}>
                <Button
                  variant={
                    selectedService === service ? "contained" : "outlined"
                  }
                  color="secondary"
                  fullWidth
                  onClick={() => selectService(service)}
                  sx={{
                    height: 50,
                    fontSize: 16,
                    fontWeight: selectedService === service ? "bold" : "normal",
                    borderRadius: 2,
                  }}
                >
                  {service}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Show Loading Spinner */}
          {loading && (
            <div className="mt-4 flex justify-center">
              <CircularProgress />
            </div>
          )}

          {/* Show Error Message */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
              <Typography>{error}</Typography>
            </div>
          )}

          {/* Display Vouchers */}
          {selectedService && vouchers.length > 0 && (
            <div className="mt-6">
              <Typography variant="h5">Available Vouchers</Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {vouchers.map((voucher) => (
                  <Grid item xs={6} sm={3} key={voucher.id}>
                    <Card
                      sx={{
                        minWidth: 200,
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6">{voucher.name}</Typography>
                        <Typography>Mobile {voucher.category}</Typography>
                        <Typography variant="body2" color="text.secondary">
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
          variant="h6"
          sx={{ mt: 4, textAlign: "center", color: "red" }}
        >
          Please select a provider first.
        </Typography>
      )}
    </div>
  );
};

export default ServiceSelection;
