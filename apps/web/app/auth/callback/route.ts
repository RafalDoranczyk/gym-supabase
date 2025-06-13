import { setupUserDefaults } from "@/actions";
import { PATHS } from "@/constants";
import { createServerClient } from "@/utils";
import { type NextRequest, NextResponse } from "next/server";

// Helper functions
function isValidRedirectPath(path: string): boolean {
  // Check if path is safe (starts with /, doesn't contain ..//, etc.)
  return path.startsWith("/") && !path.includes("//") && !path.includes("..");
}

function redirectToError(origin: string): NextResponse {
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

function getRedirectBase(request: NextRequest, origin: string): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return origin;
  }

  return forwardedHost ? `https://${forwardedHost}` : origin;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? PATHS.DASHBOARD;

  // Validate next parameter - prevent open redirect
  if (!isValidRedirectPath(next)) {
    return redirectToError(origin);
  }

  // If authorization code is missing, redirect to error
  if (!code) {
    return redirectToError(origin);
  }

  try {
    const supabase = await createServerClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth exchange error:", error);
      return redirectToError(origin);
    }

    try {
      console.log("🚀 Setting up defaults for new user:", data.user.id);
      await setupUserDefaults();
      console.log("✅ User defaults setup completed");
    } catch (setupError) {
      console.error("❌ Failed to setup user defaults:", setupError);
    }

    const redirectBase = getRedirectBase(request, origin);
    return NextResponse.redirect(`${redirectBase}${next}`);
  } catch (error) {
    console.error("Unexpected error during OAuth callback:", error);
    return redirectToError(origin);
  }
}
