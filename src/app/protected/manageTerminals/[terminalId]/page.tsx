// app/protected/manageTerminals/[terminalID]/TerminalDashboard.tsx
"use client";

import React, { useState } from "react";
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
// import { fetchVouchers, issueVoucher } from "./api";
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
