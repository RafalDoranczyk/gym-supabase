import { AppError, AppErrorCodes } from "@/core";
import { createServerClient } from "@/utils";

export async function getUser() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new AppError(AppErrorCodes.SERVER_ERROR, error.message);
  }

  if (!user) {
    throw new AppError(AppErrorCodes.UNAUTHORIZED);
  }

  return user;
}
