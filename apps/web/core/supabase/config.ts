import { AppError, type AppErrorCodes } from "@/core";
import {
  createSupabaseErrorMapper,
  createSupabaseServer,
  type SupabaseConfig,
} from "@/lib/supabase";

if (!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  throw new Error("Supabase envs not provided");
}

// Environment config
export const supabaseConfig: SupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

if (!(supabaseConfig.url && supabaseConfig.key)) {
  throw new Error("Missing Supabase environment variables");
}

// Project-specific error mapper
export const mapSupabaseErrorToAppError = createSupabaseErrorMapper(
  (code: string, message: string, details?: string) =>
    new AppError(code as AppErrorCodes, message, details)
);

// Project-specific server client
export async function createSupabase() {
  return await createSupabaseServer(supabaseConfig.url, supabaseConfig.key);
}
