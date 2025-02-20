// app/protected/manageTerminals/[terminalID]/ConfirmationDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ConfirmationDialog = ({ open, onConfirm, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Confirm Action</DialogTitle>
    <DialogContent>
      <Typography variant="body1">Are you sure you want to proceed?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" color="primary" onClick={onConfirm}>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;
