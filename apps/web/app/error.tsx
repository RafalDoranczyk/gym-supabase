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
    // Don't spam user with toast if it's a client-side navigation error
    if (error.message?.includes("ChunkLoadError") || error.message?.includes("Loading chunk")) {
      return; // These are usually harmless navigation errors
    }

    const message =
      error instanceof AppError
        ? `${error.message} (${error.code})`
        : error.message || "An unexpected error occurred";

    toast.error(message);

    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.error("Global Error:", {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        isAppError: error instanceof AppError,
        code: error instanceof AppError ? error.code : undefined,
      });
    }
  }, [error, toast]);

  const { title, description } = getErrorDetails(error);

  return (
    <ErrorPage
      title={title}
      description={description}
      reset={reset}
      showDetails={process.env.NODE_ENV === "development"}
      errorCode={error instanceof AppError ? error.code : undefined}
      digest={error.digest}
    />
  );
}

function getErrorDetails(error: Error & { digest?: string }) {
  if (error instanceof AppError) {
    return {
      title: getTitleForErrorCode(error.code),
      description: error.message || "An error occurred while processing your request.",
    };
  }

  // Handle common Next.js/React errors with user-friendly messages
  if (error.message?.includes("ChunkLoadError") || error.message?.includes("Loading chunk")) {
    return {
      title: "Loading Issue",
      description: "There was a problem loading the page. Please refresh and try again.",
    };
  }

  if (error.message?.includes("Network Error") || error.message?.includes("fetch")) {
    return {
      title: "Connection Problem",
      description:
        "Unable to connect to the server. Please check your internet connection and try again.",
    };
  }

  if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
    return {
      title: "Access Denied",
      description:
        "You don't have permission to access this resource. Please sign in and try again.",
    };
  }

  // Generic fallback
  return {
    title: "Something Went Wrong",
    description: "An unexpected error occurred.",
  };
}

function getTitleForErrorCode(code: string): string {
  const errorTitles: Record<string, string> = {
    NOT_FOUND: "Not Found",
    SERVER_ERROR: "Server Error",
    UNAUTHORIZED: "Access Denied",
    FORBIDDEN: "Forbidden",
    BAD_REQUEST: "Invalid Request",
    VALIDATION_ERROR: "Validation Failed",
    RATE_LIMITED: "Too Many Requests",
    MAINTENANCE: "Under Maintenance",
    NETWORK_ERROR: "Connection Problem",
    TIMEOUT: "Request Timeout",
  };

  return errorTitles[code] || "Something Went Wrong";
}
