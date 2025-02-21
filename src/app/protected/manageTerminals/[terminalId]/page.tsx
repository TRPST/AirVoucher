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
import ProviderSelection from "./ProviderSelection";
import ServiceSelection from "./ServiceSelection";
import VoucherList from "./VoucherList";
import SaleModal from "./SaleModal";
import OTTModal from "./OTTModal";
import ConfirmationDialog from "./ConfirmationDialog";
import { supabase } from "../../../../../utils/supabase/client"; // ✅ Use shared Supabase client
import issueVoucher from "./OTTModal"; // ✅ Import fetchVouchers and issueVoucher from ./api

const TerminalDashboard = () => {
  const { terminalId } = useParams();
  const router = useRouter();

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showOTTModal, setShowOTTModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    (() => void) | null
  >(null);
  const [commGroupId, setCommGroupId] = useState(null);

  // Fetch the commission group ID for the terminal
  useEffect(() => {
    const fetchTerminalData = async () => {
      setLoading(true);
      setError(null);

      console.log(`Fetching terminal data for Terminal ID: ${terminalId}`);

      const { data: terminal, error: terminalError } = await supabase
        .from("terminals")
        .select("comm_group_id")
        .eq("id", terminalId)
        .single();

      if (terminalError) {
        console.error("Error fetching terminal data:", terminalError);
        setError("Error fetching terminal data.");
      } else {
        console.log("Fetched Terminal Data:", terminal);
        setCommGroupId(terminal?.comm_group_id);
      }
      setLoading(false);
    };

    if (terminalId) fetchTerminalData();
  }, [terminalId]);

  // Navigate back to Terminal Management
  const navigateToTerminalManagement = () => {
    router.push("/protected/manageTerminals");
  };

  // Handle provider selection
  const handleProviderSelection = (provider) => {
    setSelectedProvider(provider);
    setSelectedService(null);
    setVouchers([]);
    if (provider === "OTT") setShowOTTModal(true);
  };

  // Handle service selection and fetch vouchers
  const handleServiceSelection = async (service) => {
    setSelectedService(service);
    setLoading(true);

    try {
      console.log(
        `Fetching vouchers for Provider: ${selectedProvider}, Service: ${service}, CommGroupId: ${commGroupId}`,
      );

      if (!commGroupId) {
        throw new Error("Error: comm_group_id is missing!");
      }

      const { data: fetchedVouchers, error: voucherError } = await supabase
        .from("mobile_data_vouchers")
        .select("*")
        .eq("comm_group_id", commGroupId)
        .eq("supplier_name", selectedProvider)
        .eq("category", service);

      if (voucherError) {
        console.error("Error fetching vouchers:", voucherError);
        throw new Error("Error fetching vouchers.");
      }

      console.log("Fetched Vouchers:", fetchedVouchers);
      setVouchers(fetchedVouchers);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <IconButton color="primary" onClick={navigateToTerminalManagement}>
          <WestIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          Terminal Dashboard - {terminalId}
        </Typography>
        <Button variant="contained" color="primary">
          Sales Analytics
        </Button>
      </div>

      {/* Provider Selection */}
      <ProviderSelection
        selectedProvider={selectedProvider}
        onSelect={handleProviderSelection}
      />

      {/* Service Selection */}
      {selectedProvider && selectedProvider !== "OTT" && (
        <ServiceSelection
          selectedProvider={selectedProvider}
          selectedService={selectedService}
          onSelect={handleServiceSelection}
          terminalId={terminalId}
          commGroupId={commGroupId} // ✅ Pass commGroupId to ServiceSelection
        />
      )}

      {/* Loading and Error Handling */}
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {/* Display Voucher List */}
      {selectedService && (
        <VoucherList
          vouchers={vouchers}
          onSelect={(voucher) => {
            setSelectedVoucher(voucher);
            setShowSaleModal(true);
          }}
        />
      )}

      {/* Modals */}
      <SaleModal
        open={showSaleModal}
        onClose={() => setShowSaleModal(false)}
        voucher={selectedVoucher}
      />
      <OTTModal
        open={showOTTModal}
        onClose={() => setShowOTTModal(false)}
        issueVoucher={issueVoucher}
      />
      <ConfirmationDialog
        open={Boolean(confirmationAction)}
        onConfirm={confirmationAction}
        onClose={() => setConfirmationAction(null)}
      />
    </div>
  );
};

export default TerminalDashboard;
