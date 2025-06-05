import { getUser } from "@/actions";
import { createServerClient } from "./createServerClient";

export async function getUserScopedQuery() {
  try {
    const [user, supabase] = await Promise.all([getUser(), createServerClient()]);

    if (!user) {
      throw new Error("User not authenticated");
    }

    return { user, supabase };
  } catch (error) {
    console.error("Failed to initialize user scoped query:", error);
    throw error;
  }
}
