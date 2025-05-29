"use client";

import { ErrorPage } from "@/components";
import { AppError } from "@/core";
import { useToast } from "@/providers";
import { useEffect } from "react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const toast = useToast();

  useEffect(() => {
    const message =
      error instanceof AppError
        ? `${error.message} (${error.code})`
        : error.message || "Something went wrong";

    toast.error(message);
  }, [error, toast]);

  const title =
    error instanceof AppError ? getTitleForErrorCode(error.code) : "Something went wrong";

  return <ErrorPage description={error.message} reset={reset} title={title} />;
}

function getTitleForErrorCode(code: string): string {
  switch (code) {
    case "NOT_FOUND":
      return "Not found";
    case "SERVER_ERROR":
      return "Server error";
    case "UNAUTHORIZED":
      return "Access denied";
    default:
      return "Something went wrong";
  }
}
