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


// import React, { useState } from "react";
// import {
//   Button,
//   Grid,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
// } from "@mui/material";

// const services = ["Airtime", "Data", "SMS", "Top-up"];

// const ServiceSelection = ({ selectedProvider, selectedService, onSelect }) => {
//   const [vouchers, setVouchers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Handle service selection
//   const selectService = async (service) => {
//     onSelect(service);
//     await fetchVouchers(service);
//   };

//   // Fetch vouchers when a service is selected
//   const fetchVouchers = async (service) => {
//     if (!selectedProvider) {
//       setError("Please select a provider before choosing a service.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setVouchers([]);

//     const url =
//       service === "Airtime"
//         ? "https://api.qa.bltelecoms.net/v2/trade/mobile/airtime/products"
//         : "https://api.qa.bltelecoms.net/v2/trade/mobile/bundle/products";

//     const username = "bld";
//     const password = "ornuk3i9vseei125s8qea71kub";
//     const apiKey = "b97ac3ea-da33-11ef-9cd2-0242ac120002";

//     const authHeader = "Basic " + btoa(`${username}:${password}`);

//     try {
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: authHeader,
//           apikey: apiKey,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch vouchers. Status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (!data || !Array.isArray(data)) {
//         throw new Error("Invalid API response: No vouchers found.");
//       }

//       // Filter vouchers based on provider
//       const filteredVouchers = data.filter((v) =>
//         v.vendorId?.toLowerCase().includes(selectedProvider.toLowerCase()),
//       );

//       if (filteredVouchers.length === 0) {
//         throw new Error(`No vouchers available for ${selectedProvider}.`);
//       }

//       setVouchers(filteredVouchers);
//     } catch (error) {
//       console.error("Error fetching vouchers:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {selectedProvider ? (
//         <>
//           <Typography variant="h5">
//             Select a Service for {selectedProvider}
//           </Typography>
//           <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
//             {services.map((service) => (
//               <Grid item xs={6} sm={3} key={service}>
//                 <Button
//                   variant={
//                     selectedService === service ? "contained" : "outlined"
//                   }
//                   color="secondary"
//                   fullWidth
//                   onClick={() => selectService(service)}
//                   sx={{
//                     height: 50,
//                     fontSize: 16,
//                     fontWeight: selectedService === service ? "bold" : "normal",
//                     borderRadius: 2,
//                   }}
//                 >
//                   {service}
//                 </Button>
//               </Grid>
//             ))}
//           </Grid>

//           {loading && (
//             <div className="mt-4 flex justify-center">
//               <CircularProgress />
//             </div>
//           )}

//           {error && (
//             <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
//               <Typography>{error}</Typography>
//             </div>
//           )}

//           {selectedService && vouchers.length > 0 && (
//             <div className="mt-6">
//               <Typography variant="h5">Available Vouchers</Typography>
//               <Grid container spacing={2} sx={{ mt: 2 }}>
//                 {vouchers.map((voucher) => (
//                   <Grid item xs={6} sm={3} key={voucher.id}>
//                     <Card
//                       sx={{
//                         minWidth: 200,
//                         textAlign: "center",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <CardContent>
//                         <Typography variant="h6">{voucher.name}</Typography>
//                         <Typography>Mobile {voucher.category}</Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           R{(voucher.amount / 100).toFixed(2)}
//                         </Typography>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             </div>
//           )}
//         </>
//       ) : (
//         <Typography
//           variant="h6"
//           sx={{ mt: 4, textAlign: "center", color: "red" }}
//         >
//           Please select a provider first.
//         </Typography>
//       )}
//     </div>
//   );
// };

// export default ServiceSelection;

"use client";

import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { supabase } from "../../../../../utils/supabase/client"; // Ensure correct import

const services = ["Airtime", "Data", "SMS", "Top-up"]; // Services remain hardcoded

const ServiceSelection = ({
  selectedProvider,
  selectedService,
  onSelect,
  terminalId,
  commGroupId,
}) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const fetchVouchers = async (service) => {
  setLoading(true);
  setError(null);
  setVouchers([]);

  try {
    console.log(
      `🔍 Fetching vouchers for Provider: ${selectedProvider}, Service: ${service}, CommGroupId: ${commGroupId}`,
    );

    if (!commGroupId) {
      throw new Error("Error: comm_group_id is missing!");
    }

    // 🔹 Generate `voucher_group_name` (e.g., "MTN Data", "Vodacom Airtime")
    const voucherGroupName = `${selectedProvider} ${service}`;

    // ✅ Fetch the `voucher_group_id`
    const { data: voucherGroup, error: groupError } = await supabase
      .from("voucher_groups")
      .select("id")
      .eq("voucher_group_name", voucherGroupName)
      .single();

    // 🔥 **Fix: Handle missing groups** 🔥
    if (groupError || !voucherGroup) {
      console.warn(
        `⚠️ No voucher group found for "${voucherGroupName}". Skipping request.`,
      );
      setVouchers([]); // ✅ Set empty list instead of crashing
      return;
    }

    console.log(`✅ Voucher Group ID: ${voucherGroup.id}`);

    // ✅ Fetch vouchers from `mobile_data_vouchers`
    const { data: fetchedVouchers, error: vouchersError } = await supabase
      .from("mobile_data_vouchers")
      .select("*")
      .eq("comm_group_id", commGroupId)
      .eq("vendorId", selectedProvider.toLowerCase());

    if (vouchersError) {
      console.error("❌ Error fetching vouchers:", vouchersError);
      throw new Error("Error fetching vouchers.");
    }

    console.log("✅ Vouchers Fetched:", fetchedVouchers);

    // ✅ No vouchers found → Display a message instead of crashing
    if (!fetchedVouchers || fetchedVouchers.length === 0) {
      console.warn(`⚠️ No vouchers available for "${voucherGroupName}".`);
      setVouchers([]);
    } else {
      setVouchers(fetchedVouchers);
    }
  } catch (err) {
    console.error("❌ Error:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
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
                  onClick={() => {
                    onSelect(service);
                    fetchVouchers(service);
                  }}
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

          {loading && (
            <div className="mt-4 flex justify-center">
              <CircularProgress />
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
              <Typography>{error}</Typography>
            </div>
          )}

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
                        <Typography>
                          Mobile {voucher.category || "Data"}
                        </Typography>
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
