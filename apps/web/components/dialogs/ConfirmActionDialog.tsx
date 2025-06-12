"use client";

import { WarningAmber } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import type { PropsWithChildren } from "react";

type ConfirmActionModalProps = {
  description?: React.ReactNode | string;

  onClose: () => void;
  loading?: boolean;
  onConfirm: () => void;
  open: boolean;
  title?: string;
};

function renderDescription(description?: ConfirmActionModalProps["description"]) {
  if (!description) return null;

  if (typeof description === "string") {
    return (
      <Typography textAlign="justify" variant="body2">
        {description}
      </Typography>
    );
  }

  return description;
}

export function ConfirmActionDialog({
  children,
  description,

  onClose,
  loading,
  onConfirm,
  open,
  title = "Confirm",
}: PropsWithChildren<ConfirmActionModalProps>) {
  return (
    <Dialog
      aria-describedby="confirm-dialog-description"
      aria-labelledby="confirm-dialog-title"
      maxWidth="xs"
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
          },
        },
      }}
    >
      <DialogTitle>
        <Stack alignItems="center" direction="row" spacing={1}>
          <WarningAmber fontSize="small" color="warning" />
          <Typography component="span" color="text.primary">
            {title}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {renderDescription(description)}
        {children}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          autoFocus
          color="inherit"
          disabled={loading}
          onClick={onClose}
          size="small"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          color="error"
          loading={loading}
          onClick={onConfirm}
          size="small"
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
