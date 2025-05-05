// import React, { useState, useEffect } from "react";
// import {
//   Grid,
//   Card,
//   Typography,
//   TextField,
//   Button,
//   useTheme,
// } from "@mui/material";
// import { supabase } from "../../../../../../utils/supabase/client";

// interface VoucherAmountSelectionProps {
//   selectedProvider: string;
//   selectedService: string;
//   onAmountSelect: (amount: number) => void;
// }

// const predefinedAmounts = [5, 10, 20, 30, 40, 50, 100, 150, 200];

// const getProviderImageUrl = (provider: string) => {
//   switch (provider.toLowerCase()) {
//     case "vodacom":
//       return "/images/vodacom.png";
//     case "mtn":
//       return "/images/mtn.png";
//     case "cellc":
//       return "/images/cellc.png";
//     case "telkom":
//       return "/images/telkom.jpeg";
//     default:
//       return "";
//   }
// };

// const VoucherAmountSelection: React.FC<VoucherAmountSelectionProps> = ({
//   selectedProvider,
//   selectedService,
//   onAmountSelect,
// }) => {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";
//   const [customAmount, setCustomAmount] = useState("");
//   const [availableAmounts, setAvailableAmounts] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchAvailableAmounts = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("mobile_data_vouchers")
//           .select("amount")
//           .eq("vendorId", selectedProvider.toLowerCase())
//           .eq("category", selectedService.toLowerCase())
//           .eq("status", "active");

//         if (error) throw error;

//         const amounts = Array.from(new Set(data.map((item) => item.amount)));
//         setAvailableAmounts(amounts);
//       } catch (error) {
//         console.error("Error fetching amounts:", error);
//         // Still show predefined amounts even if fetch fails
//         setAvailableAmounts(predefinedAmounts);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (selectedProvider && selectedService) {
//       fetchAvailableAmounts();
//     }
//   }, [selectedProvider, selectedService]);

//   const handleCustomAmountSubmit = () => {
//     const amount = parseFloat(customAmount);
//     if (!isNaN(amount) && amount > 0) {
//       onAmountSelect(amount);
//       setCustomAmount("");
//     }
//   };

//   return (
//     <div className="mt-4">
//       <Typography
//         variant="h6"
//         sx={{
//           mb: 2,
//           textAlign: "center",
//           color: isDark ? "#ffffff" : "#333333",
//           fontWeight: 600,
//           background: isDark ? "rgba(24, 24, 27, 0.95)" : "rgba(0, 0, 0, 0.03)",
//           py: 0.75,
//           borderRadius: 1,
//           fontSize: "1rem",
//         }}
//       >
//         Select Amount
//       </Typography>

//       <Grid container spacing={1}>
//         {predefinedAmounts.map((amount) => (
//           <Grid item xs={6} sm={4} md={3} key={amount}>
//             <Card
//               onClick={() => onAmountSelect(amount)}
//               sx={{
//                 cursor: "pointer",
//                 background: "#fff",
//                 border: "1px solid #e0e0e0",
//                 borderRadius: 2,
//                 transition: "all 0.2s ease-in-out",
//                 height: "100px",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: "16px 8px",
//                 "&:hover": {
//                   transform: "translateY(-2px)",
//                   boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//                 },
//               }}
//             >
//               <div
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   backgroundImage: `url(${getProviderImageUrl(selectedProvider)})`,
//                   backgroundSize: "contain",
//                   backgroundPosition: "center",
//                   backgroundRepeat: "no-repeat",
//                   marginBottom: "8px",
//                 }}
//               />
//               <Typography
//                 variant="h6"
//                 sx={{
//                   color: "#333",
//                   fontWeight: 600,
//                   fontSize: "1.1rem",
//                 }}
//               >
//                 R{amount}
//               </Typography>
//             </Card>
//           </Grid>
//         ))}

//         {/* Custom Amount Input */}
//         <Grid item xs={12}>
//           <Card
//             sx={{
//               background: "#fff",
//               border: "1px solid #e0e0e0",
//               borderRadius: 2,
//               p: 2,
//               mt: 2,
//             }}
//           >
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs>
//                 <TextField
//                   fullWidth
//                   placeholder="Custom amount"
//                   variant="outlined"
//                   size="small"
//                   value={customAmount}
//                   onChange={(e) => setCustomAmount(e.target.value)}
//                   InputProps={{
//                     startAdornment: (
//                       <Typography sx={{ mr: 1, color: "#666" }}>R</Typography>
//                     ),
//                   }}
//                 />
//               </Grid>
//               <Grid item>
//                 <Button
//                   variant="contained"
//                   onClick={handleCustomAmountSubmit}
//                   sx={{
//                     background: "#f50057",
//                     color: "#fff",
//                     "&:hover": {
//                       background: "#c51162",
//                     },
//                   }}
//                 >
//                   ADD
//                 </Button>
//               </Grid>
//             </Grid>
//           </Card>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default VoucherAmountSelection;
