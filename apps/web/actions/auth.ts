"use server";

import { AppError, AppErrorCodes } from "@/core";
import { createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import { redirect } from "next/navigation";

type OAuthProvider = "github" | "google";

export async function loginWithGithub() {
  return loginWithOAuth("github");
}

export async function loginWithGoogle() {
  return loginWithOAuth("google");
}

export async function logout() {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.signOut({ scope: "global" });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  redirect("/");
}

async function loginWithOAuth(provider: OAuthProvider) {
  const supabase = await createServerClient();

  const redirectTo = process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL;

  const { data, error } = await supabase.auth.signInWithOAuth({
    options: {
      redirectTo,
    },
    provider,
  });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  if (!data?.url) {
    throw new AppError(
      AppErrorCodes.SERVER_ERROR,
      "Missing redirect URL from Supabase OAuth login",
    );
  }

  redirect(data.url);
}
