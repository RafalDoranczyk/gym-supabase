import { AppError, AppErrorCodes } from "@/core";
import { createSupabase, mapSupabaseErrorToAppError } from "@/core/supabase";

export async function getUser() {
  try {
    const supabase = await createSupabase();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw mapSupabaseErrorToAppError(error);
    }

    if (!user) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, "User not authenticated");
    }

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(AppErrorCodes.SERVER_ERROR, "Failed to get user");
  }
}
