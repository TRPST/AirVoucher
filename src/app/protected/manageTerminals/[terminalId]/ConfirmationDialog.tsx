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
  title: string;
  subtitle: string;
  message: string;
  children?: React.ReactNode;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onConfirm,
  onClose,
  title,
  subtitle,
  message,
  children,
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
          borderRadius: 1,
          background: isDark ? "rgb(18, 18, 18)" : "background.paper",
          color: isDark ? "#ffffff" : "text.primary",
          "& .MuiDialogTitle-root": {
            color: isDark ? "#ffffff" : "text.primary",
          },
          "& .MuiDialogContent-root": {
            color: isDark ? "#ffffff" : "text.primary",
          },
          "& .MuiDialogActions-root": {
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          pb: 2,
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: isDark ? "#ffffff" : "text.primary",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "text.secondary",
            opacity: 0.7,
          }}
        >
          {subtitle}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? "rgba(255,255,255,0.9)" : "text.primary",
            textAlign: "center",
            mb: 2,
          }}
        >
          {message}
        </Typography>
        {children}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{
            borderColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
            color: isDark ? "rgba(255,255,255,0.9)" : "text.primary",
            "&:hover": {
              borderColor: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          size="small"
          sx={{
            background: isDark ? "rgba(255,255,255,0.1)" : "primary.main",
            color: isDark ? "#ffffff" : "primary.contrastText",
            "&:hover": {
              background: isDark ? "rgba(255,255,255,0.2)" : "primary.dark",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
