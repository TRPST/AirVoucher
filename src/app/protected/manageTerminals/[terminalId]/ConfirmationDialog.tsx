// app/protected/manageTerminals/[terminalID]/ConfirmationDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onConfirm,
  onClose,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: isDark ? "rgb(18, 18, 18)" : "background.paper",
        },
      }}
    >
      <DialogTitle sx={{ color: isDark ? "#ffffff" : "text.primary" }}>
        Confirm Action
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="body1"
          sx={{ color: isDark ? "#ffffff" : "text.primary" }}
        >
          Are you sure you want to proceed?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: isDark ? "#ffffff" : null }}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
