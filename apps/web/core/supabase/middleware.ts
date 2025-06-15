import { createSupabaseMiddleware } from "@/lib/supabase";
import type { NextRequest } from "next/server";
import { supabaseConfig } from "./config";

export function createMiddlewareClient(request: NextRequest) {
  return createSupabaseMiddleware(request, supabaseConfig.url, supabaseConfig.key);
}
