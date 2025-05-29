import { AppErrorCodes } from "./AppErrorCodes";

export class AppError extends Error {
  public code: string;
  public details?: unknown;

  constructor(code: AppErrorCodes, message?: string, details?: unknown) {
    const finalMessage = message ?? AppError.getDefaultMessage(code);
    super(finalMessage);
    this.code = code;
    this.details = details;
    this.name = "AppError";
  }

  private static getDefaultMessage(code: AppErrorCodes): string {
    switch (code) {
      case AppErrorCodes.FOREIGN_KEY_VIOLATION:
        return "Invalid foreign key reference.";
      case AppErrorCodes.INGREDIENT_NAME_EXISTS:
        return "Ingredient with this name already exists.";
      case AppErrorCodes.INVALID_PAYLOAD:
        return "The provided data is invalid.";
      case AppErrorCodes.INVALID_QUERY_PARAMS:
        return "Invalid query parameters provided.";
      case AppErrorCodes.NOT_FOUND:
        return "Requested resource not found.";
      case AppErrorCodes.PERMISSION_DENIED:
        return "You do not have permission to perform this action.";
      case AppErrorCodes.SERVER_ERROR:
        return "An unexpected server error occurred.";
      case AppErrorCodes.UNAUTHORIZED:
        return "User is not authorized.";
      default:
        return "An unknown error occurred.";
    }
  }
}
