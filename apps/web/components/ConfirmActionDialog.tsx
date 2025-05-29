"use client";

import { WarningAmber } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { PropsWithChildren } from "react";

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
  },
}));

type ConfirmActionModalProps = {
  description?: React.ReactNode | string;
  disabled?: boolean;
  handleClose: () => void;
  loading?: boolean;
  onConfirm: () => void;
  open: boolean;
  title?: string;
};

const renderDescription = (description?: ConfirmActionModalProps["description"]) => {
  if (!description) return null;

  return typeof description === "string" ? (
    <Typography textAlign="justify" variant="body2">
      {description}
    </Typography>
  ) : (
    description
  );
};

export function ConfirmActionDialog({
  children,
  description,
  disabled,
  handleClose,
  loading,
  onConfirm,
  open,
  title = "Confirm",
}: PropsWithChildren<ConfirmActionModalProps>) {
  return (
    <StyledDialog
      aria-describedby="confirm-dialog-description"
      aria-labelledby="confirm-dialog-title"
      maxWidth="xs"
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>
        <Stack alignItems="center" direction="row" spacing={1}>
          <WarningAmber fontSize="small" />
          <span>{title}</span>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {renderDescription(description)}
        {children}
      </DialogContent>
      <DialogActions>
        <LoadingButton
          autoFocus
          color="error"
          disabled={disabled}
          loading={loading}
          onClick={handleClose}
          size="small"
          variant="contained"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          color="primary"
          disabled={disabled}
          loading={loading}
          onClick={onConfirm}
          size="small"
          variant="contained"
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </StyledDialog>
  );
}
