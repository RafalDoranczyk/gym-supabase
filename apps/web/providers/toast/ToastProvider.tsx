"use client";

import { Error as ErrorIcon, CheckCircle as SuccessIcon } from "@mui/icons-material";
import { Snackbar as MuiSnackbar, SnackbarContent, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type React from "react";
import { createContext, useState } from "react";

export type ToastContextType = {
  error: (message: string) => void;
  success: (message: string) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastType = "error" | "success";

/**
 * Provides toast notification functionality throughout the app.
 *
 * @param children - React components to be wrapped with toast context.
 */
export function ToastProvider({ children }: React.PropsWithChildren) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");

  const showToast = (message: string, toastType: ToastType) => {
    setMessage(message);
    setType(toastType);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const value: ToastContextType = {
    error: (message: string) => showToast(message, "error"),
    success: (message: string) => showToast(message, "success"),
  };

  const isSuccess = type === "success";
  const iconColor = isSuccess ? theme.palette.success.main : theme.palette.error.main;
  const backgroundColor = isSuccess ? theme.palette.success.main : theme.palette.error.main;

  return (
    <ToastContext.Provider value={value}>
      {children}
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isSuccess ? (
                <SuccessIcon sx={{ color: iconColor, mr: 1 }} />
              ) : (
                <ErrorIcon sx={{ color: iconColor, mr: 1 }} />
              )}
              {message}
            </Box>
          }
          sx={{
            backgroundColor,
            borderRadius: 1,
            color: theme.palette.common.white,
            p: "10px 20px",
          }}
        />
      </MuiSnackbar>
    </ToastContext.Provider>
  );
}
