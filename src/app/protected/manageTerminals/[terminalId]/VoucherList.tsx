// // app/protected/manageTerminals/[terminalID]/VoucherList.tsx
// import React from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   useTheme,
// } from "@mui/material";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// interface Voucher {
//   id: string;
//   name: string;
//   category: string;
//   amount: number;
//   vendorId: string;
//   supplier_name: string;
//   status?: string;
//   voucher_pin?: string | null;
//   voucher_serial_number?: string | null;
// }

// interface VoucherListProps {
//   vouchers: Voucher[];
//   onSelect: (voucher: Voucher) => void;
//   selectedProvider?: string;
// }

// const getProviderColors = (isDark: boolean) => ({
//   MTN: {
//     light: "rgba(255, 204, 0, 0.15)",
//     dark: "rgba(255, 204, 0, 0.12)",
//     border: "rgb(255, 204, 0)",
//   },
//   Vodacom: {
//     light: "rgba(255, 0, 0, 0.15)",
//     dark: "rgba(255, 0, 0, 0.12)",
//     border: "rgb(255, 0, 0)",
//   },
//   CellC: {
//     light: "rgba(0, 0, 0, 0.15)",
//     dark: "rgba(255, 255, 255, 0.12)",
//     border: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
//   },
//   Telkom: {
//     light: "rgba(0, 102, 204, 0.15)",
//     dark: "rgba(0, 102, 204, 0.12)",
//     border: "rgb(0, 102, 204)",
//   },
//   OTT: {
//     light: "rgba(0, 128, 0, 0.15)",
//     dark: "rgba(0, 128, 0, 0.12)",
//     border: "rgb(0, 128, 0)",
//   },
//   Hollywoodbets: {
//     light: "rgba(128, 0, 128, 0.15)",
//     dark: "rgba(128, 0, 128, 0.12)",
//     border: "rgb(128, 0, 128)", // Purple
//   },
//   Ringa: {
//     light: "rgba(255, 165, 0, 0.15)",
//     dark: "rgba(255, 165, 0, 0.12)",
//     border: "rgb(255, 165, 0)", // Orange
//   },
//   Easyload: {
//     light: "rgba(218, 165, 32, 0.15)",
//     dark: "rgba(218, 165, 32, 0.12)",
//     border: "rgb(218, 165, 32)", // Golden
//   },
//   Dstv: {
//     light: "rgba(218, 165, 32, 0.15)",
//     dark: "rgba(218, 165, 32, 0.12)",
//     border: "rgb(32, 66, 218)", // Golden
//   },
//   Eskom: {
//     light: "rgba(218, 165, 32, 0.15)",
//     dark: "rgba(218, 165, 32, 0.12)",
//     border: "rgb(32, 94, 218)", // Golden
//   },
// });

// const VoucherList: React.FC<VoucherListProps> = ({
//   vouchers,
//   onSelect,
//   selectedProvider = "MTN",
// }) => {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";
//   const providerColors = getProviderColors(isDark);
//   const colors =
//     providerColors[selectedProvider as keyof typeof providerColors] ||
//     providerColors.MTN;

//   return (
//     <Grid
//       container
//       spacing={1}
//       sx={{
//         mt: 0.5,
//         width: "100%",
//         margin: 0,
//         padding: "4px",
//       }}
//     >
//       {vouchers.map((voucher) => (
//         <Grid
//           item
//           xs={12}
//           sm={6}
//           md={4}
//           lg={3}
//           key={voucher.id}
//           sx={{
//             p: "4px !important",
//           }}
//         >
//           <Card
//             sx={{
//               height: "100%",
//               minHeight: "120px",
//               display: "flex",
//               flexDirection: "column",
//               background: isDark ? "rgba(30, 30, 30, 0.8)" : "#fff",
//               border: `1px solid ${colors.border}`,
//               borderRadius: 1,
//               transition: "all 0.2s ease-in-out",
//               m: 0,
//               "&:hover": {
//                 transform: "translateY(-2px)",
//                 boxShadow: `0px 2px 4px ${colors.border}40`,
//                 borderWidth: "1px",
//               },
//             }}
//           >
//             <CardContent
//               sx={{
//                 p: "8px !important",
//                 display: "flex",
//                 flexDirection: "column",
//                 height: "100%",
//                 "&:last-child": {
//                   pb: "8px !important",
//                 },
//               }}
//             >
//               <Typography
//                 variant="subtitle2"
//                 sx={{
//                   color: isDark ? "#ffffff" : "#333333",
//                   fontWeight: 500,
//                   borderBottom: `1px solid ${colors.border}40`,
//                   pb: 0.5,
//                   fontSize: "0.875rem",
//                   mb: 0.5,
//                 }}
//               >
//                 {voucher.name}
//               </Typography>
//               <Typography
//                 variant="caption"
//                 sx={{
//                   display: "block",
//                   opacity: 0.7,
//                   color: isDark ? "rgba(255,255,255,0.9)" : "#666666",
//                   mb: 0.5,
//                   fontSize: "0.75rem",
//                 }}
//               >
//                 {voucher.category}
//               </Typography>
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   color: colors.border,
//                   fontWeight: "bold",
//                   fontSize: "0.875rem",
//                   mb: 0.5,
//                 }}
//               >
//                 R{(voucher.amount || 0).toFixed(2)}
//               </Typography>
//               <Button
//                 variant="outlined"
//                 fullWidth
//                 size="small"
//                 onClick={() => onSelect(voucher)}
//                 startIcon={<ShoppingCartIcon sx={{ fontSize: "0.875rem" }} />}
//                 sx={{
//                   mt: "auto",
//                   color: colors.border,
//                   borderColor: colors.border,
//                   fontSize: "0.75rem",
//                   minHeight: "24px",
//                   padding: "2px 8px",
//                   "&:hover": {
//                     background: `${colors.border}10`,
//                     borderColor: colors.border,
//                   },
//                 }}
//               >
//                 SELL
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default VoucherList;
