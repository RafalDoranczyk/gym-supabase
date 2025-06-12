"use client";

import { ErrorPage } from "@/components";
import { AppError, AppErrorCodes } from "@/core";
import { useToast } from "@/providers";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const toast = useToast();

  useEffect(() => {
    // Only show toast for unexpected errors
    if (!(error instanceof AppError)) {
      toast.error("Something went wrong");
    }

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

  const errorDetails = getErrorDetails(error);

  return (
    <ErrorPage
      title={errorDetails.title}
      description={errorDetails.description}
      technicalDetails={errorDetails.technicalDetails}
      suggestions={errorDetails.suggestions}
      reset={reset}
      showDetails={process.env.NODE_ENV === "development"}
      errorCode={error instanceof AppError ? error.code : undefined}
      digest={error instanceof AppError ? undefined : error.digest}
    />
  );
}

function getErrorDetails(error: Error & { digest?: string }) {
  if (error instanceof AppError) {
    return {
      title: getTitleForErrorCode(error.code as AppErrorCodes),
      description: error.message,
      technicalDetails: {
        errorCode: error.code,
        timestamp: new Date().toISOString(),
        details: error.details,
      },
      suggestions: getSuggestionsForErrorCode(error.code as AppErrorCodes),
    };
  }

  // Fallback for unexpected errors
  return {
    title: "Something Went Wrong",
    description: "An unexpected error occurred while processing your request.",
    technicalDetails: {
      errorType: "UnexpectedError",
      timestamp: new Date().toISOString(),
      digest: error.digest,
      message: error.message,
    },
    suggestions: ["Try refreshing the page", "If the problem persists, contact support"],
  };
}

function getTitleForErrorCode(code: AppErrorCodes): string {
  const errorTitles: Record<AppErrorCodes, string> = {
    [AppErrorCodes.NOT_FOUND]: "Not Found",
    [AppErrorCodes.UNAUTHORIZED]: "Access Denied",
    [AppErrorCodes.PERMISSION_DENIED]: "Permission Denied",
    [AppErrorCodes.SERVER_ERROR]: "Server Error",
    [AppErrorCodes.VALIDATION_ERROR]: "Validation Error",
    [AppErrorCodes.INVALID_PAYLOAD]: "Invalid Data",
    [AppErrorCodes.INVALID_QUERY_PARAMS]: "Invalid Request",
    [AppErrorCodes.FOREIGN_KEY_VIOLATION]: "Data Conflict",
    [AppErrorCodes.UNIQUE_VIOLATION]: "Duplicate Entry",
  };

  return errorTitles[code] || "Error";
}

function getSuggestionsForErrorCode(code: AppErrorCodes): string[] {
  const suggestions: Record<AppErrorCodes, string[]> = {
    [AppErrorCodes.NOT_FOUND]: [
      "Check the URL for typos",
      "Navigate back to the previous page",
      "Contact support if you believe this resource should exist",
    ],
    [AppErrorCodes.UNAUTHORIZED]: ["Sign in to your account", "Check if your session has expired"],
    [AppErrorCodes.PERMISSION_DENIED]: [
      "You may not have permission to access this resource",
      "Contact your administrator for access",
    ],
    [AppErrorCodes.SERVER_ERROR]: [
      "Try refreshing the page",
      "Wait a few minutes and try again",
      "Contact support if the problem persists",
    ],
    [AppErrorCodes.VALIDATION_ERROR]: [
      "Check your input data for errors",
      "Ensure all required fields are filled correctly",
    ],
    [AppErrorCodes.INVALID_PAYLOAD]: [
      "Check your input data",
      "Ensure all fields are in the correct format",
    ],
    [AppErrorCodes.INVALID_QUERY_PARAMS]: [
      "Check the URL parameters",
      "Try using the navigation menu instead",
    ],
    [AppErrorCodes.FOREIGN_KEY_VIOLATION]: [
      "The referenced item may no longer exist",
      "Try refreshing the page",
      "Contact support if this continues",
    ],
    [AppErrorCodes.UNIQUE_VIOLATION]: [
      "This entry already exists",
      "Try using different values",
      "Check for duplicates",
    ],
  };

  return (
    suggestions[code] || ["Try refreshing the page", "Contact support if the problem persists"]
  );
}
