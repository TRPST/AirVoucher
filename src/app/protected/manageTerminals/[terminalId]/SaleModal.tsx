// app/protected/manageTerminals/[terminalID]/SaleModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const SaleModal = ({ open, onClose, voucher }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Sell Voucher</DialogTitle>
    <DialogContent>
      {voucher && (
        <>
          <Typography variant="h6">Product: {voucher.name}</Typography>
          <Typography variant="body1">
            Amount: R{(voucher.amount / 100).toFixed(2)}
          </Typography>
        </>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" color="primary">
        Confirm Sale
      </Button>
    </DialogActions>
  </Dialog>
);

export default SaleModal;