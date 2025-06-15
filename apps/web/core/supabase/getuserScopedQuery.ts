import { getUser } from "@/actions/user";
import { createSupabase } from "./config";

export async function getUserScopedQuery() {
  try {
    const [user, supabase] = await Promise.all([getUser(), createSupabase()]);

    if (!user) {
      throw new Error("User not authenticated");
    }

    return { user, supabase };
  } catch (error) {
    console.error("Failed to initialize user scoped query:", error);
    throw error;
  }
}
