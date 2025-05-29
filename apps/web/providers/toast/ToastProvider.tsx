"use client";

import { Error as ErrorIcon, CheckCircle as SuccessIcon } from "@mui/icons-material";
import { Snackbar as MuiSnackbar, SnackbarContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { createContext, useState } from "react";

type ToastContextType = {
  error: (message: string) => void;
  success: (message: string) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"error" | "success">("success");

  const showToast = (message: string, type: "error" | "success") => {
    setMessage(message);
    setType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const value = {
    error: (message: string) => showToast(message, "error"),
    success: (message: string) => showToast(message, "success"),
  };

  return (
    <ToastContext.Provider value={value}>
      <>
        <MuiSnackbar
          anchorOrigin={{
            horizontal: "right",
            vertical: "top",
          }}
          autoHideDuration={6000}
          onClose={handleClose}
          open={open}
        >
          <SnackbarContent
            message={
              <span style={{ alignItems: "center", display: "flex" }}>
                {type === "success" ? (
                  <SuccessIcon sx={{ color: theme.palette.success.main, marginRight: 1 }} />
                ) : (
                  <ErrorIcon sx={{ color: theme.palette.error.main, marginRight: 1 }} />
                )}
                {message}
              </span>
            }
            sx={{
              backgroundColor:
                type === "success" ? theme.palette.success.main : theme.palette.error.main,
              borderRadius: "4px",
              color: theme.palette.common.white,
              padding: "10px 20px",
            }}
          />
        </MuiSnackbar>
        {children}
      </>
    </ToastContext.Provider>
  );
}
