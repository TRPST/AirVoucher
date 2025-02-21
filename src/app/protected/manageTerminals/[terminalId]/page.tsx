// // app / protected / manageTerminals / [terminalID] / page.tsx;
// ("use client");

// import React, { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   IconButton,
//   Typography,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import WestIcon from "@mui/icons-material/West";
// import ProviderSelection from "./ProviderSelection";
// import ServiceSelection from "./ServiceSelection";
// import VoucherList from "./VoucherList";
// import SaleModal from "./SaleModal";
// import OTTModal from "./OTTModal";
// import ConfirmationDialog from "./ConfirmationDialog";
// // import { fetchVouchers, issueVoucher } from "./api";
// import issueVoucher from "./OTTModal"; // ✅ Import fetchVouchers and issueVoucher from ./api

// const TerminalDashboard = () => {
//   const { terminalId } = useParams();
//   const router = useRouter();

//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [selectedService, setSelectedService] = useState(null);
//   const [vouchers, setVouchers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showSaleModal, setShowSaleModal] = useState(false);
//   const [selectedVoucher, setSelectedVoucher] = useState(null);
//   const [showOTTModal, setShowOTTModal] = useState(false);
//   const [confirmationAction, setConfirmationAction] = useState<
//     (() => void) | null
//   >(null);

//   // Navigate back to Terminal Management
//   const navigateToTerminalManagement = () => {
//     router.push("/protected/manageTerminals");
//   };

//   const handleProviderSelection = (provider) => {
//     setSelectedProvider(provider);
//     setSelectedService(null);
//     setVouchers([]);
//     if (provider === "OTT") setShowOTTModal(true);
//   };

//   const handleServiceSelection = async (service) => {
//     setSelectedService(service);
//     setLoading(true);
//     try {
//       const fetchedVouchers = await fetchVouchers(service, selectedProvider);
//       setVouchers(fetchedVouchers);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="mb-6 flex items-center justify-between">
//         <IconButton color="primary" onClick={navigateToTerminalManagement}>
//           <WestIcon sx={{ fontSize: 30 }} />
//         </IconButton>
//         <Typography variant="h4" fontWeight="bold">
//           Terminal Dashboard - {terminalId}
//         </Typography>
//         <Button variant="contained" color="primary">
//           Sales Analytics
//         </Button>
//       </div>
//       <ProviderSelection
//         selectedProvider={selectedProvider}
//         onSelect={handleProviderSelection}
//       />
//       {selectedProvider && selectedProvider !== "OTT" && (
//         <ServiceSelection
//           selectedService={selectedService}
//           onSelect={handleServiceSelection}
//         />
//       )}
//       {loading && <CircularProgress />}
//       {error && <Typography color="error">{error}</Typography>}
//       {selectedService && (
//         <VoucherList
//           vouchers={vouchers}
//           onSelect={(voucher) => {
//             setSelectedVoucher(voucher);
//             setShowSaleModal(true);
//           }}
//         />
//       )}
//       <SaleModal
//         open={showSaleModal}
//         onClose={() => setShowSaleModal(false)}
//         voucher={selectedVoucher}
//       />
//       <OTTModal
//         open={showOTTModal}
//         onClose={() => setShowOTTModal(false)}
//         issueVoucher={issueVoucher}
//       />
//       <ConfirmationDialog
//         open={Boolean(confirmationAction)}
//         onConfirm={confirmationAction}
//         onClose={() => setConfirmationAction(null)}
//       />
//     </div>
//   );
// };

// export default TerminalDashboard;

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconButton,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import TerminalBalances from "./components/TerminalBalances";
import TerminalHeader from "./components/TerminalHeader";
import TransactionHistoryButton from "./components/TransactionHistoryButton";
import ProviderSelection from "./ProviderSelection";
import ServiceSelection from "./ServiceSelection";
import VoucherList from "./VoucherList";
import SaleModal from "./SaleModal";
import OTTModal from "./OTTModal";
import ConfirmationDialog from "./ConfirmationDialog";
// import { fetchVouchers, issueVoucher } from "./api";
import issueVoucher from "./OTTModal"; // ✅ Import fetchVouchers and issueVoucher from ./api

const TerminalDashboard = () => {
  const { terminalId } = useParams();
  const router = useRouter();

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showOTTModal, setShowOTTModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    (() => void) | null
  >(null);

  // Navigate back to Terminal Management
  const navigateToTerminalManagement = () => {
    router.push("/protected/manageTerminals");
  };

  const handleProviderSelection = (provider) => {
    setSelectedProvider(provider);
    setSelectedService(null);
    setVouchers([]);
    if (provider === "OTT") setShowOTTModal(true);
  };

  const handleServiceSelection = async (service) => {
    setSelectedService(service);
    setLoading(true);
    try {
      const fetchedVouchers = await fetchVouchers(service, selectedProvider);
      setVouchers(fetchedVouchers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <IconButton color="primary" onClick={navigateToTerminalManagement}>
            <WestIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Terminal {terminalId}
          </h2>
          <SyncIndicator lastSync={lastSync} />
        </div>
        <button
          onClick={handleAnalytics}
          className="rounded-lg border border-blue-700 px-3 py-2 font-semibold text-blue-500 shadow transition duration-300 hover:bg-blue-800 hover:text-white dark:border-blue-600 dark:hover:bg-blue-700"
        >
          Sales Analytics
        </button>
      </div>
      <ProviderSelection
        selectedProvider={selectedProvider}
        onSelect={handleProviderSelection}
      />
      {selectedProvider && selectedProvider !== "OTT" && (
        <ServiceSelection
          selectedService={selectedService}
          onSelect={handleServiceSelection}
        />
      )}
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {selectedService && (
        <VoucherList
          vouchers={vouchers}
          onSelect={(voucher) => {
            setSelectedVoucher(voucher);
            setShowSaleModal(true);
          }}
        />
      )}
      <SaleModal
        open={showSaleModal}
        onClose={() => setShowSaleModal(false)}
        voucher={selectedVoucher}
      />

      <OTTModal
        open={showOTTModal}
        onClose={() => setShowOTTModal(false)}
        onIssueVoucher={async (amount) => {
          // Handle OTT voucher issuance
          console.log("Issuing OTT voucher for amount:", amount);
          // Add your voucher issuance logic here
          return Promise.resolve(); // Return a Promise to match the expected type
        }}
      />

      <ConfirmationDialog
        open={Boolean(confirmationAction)}
        onConfirm={confirmationAction}
        onClose={() => setConfirmationAction(null)}
      />
    </div>
  );
}
