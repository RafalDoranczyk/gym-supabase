import { type NextRequest, NextResponse } from "next/server";
import { PATHS } from "./constants";
import { createMiddlewareClient } from "./core/supabase";

const PUBLIC_ROUTES = ["/", "/about", "/auth", "/auth/callback"];

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // ========== AUTH LOGIC ==========
  if (!(isPublicRoute || user)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // ========== ONBOARDING LOGIC ==========
  if (user && pathname.startsWith(PATHS.DASHBOARD)) {
    try {
      // ✅ Use the same supabase client for onboarding check
      const { data: settings } = await supabase
        .from("user_settings")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      const isCompleted = settings?.onboarding_completed;

      // Redirect to setup if not completed and not already on setup
      if (!(isCompleted || pathname.includes(PATHS.SETUP))) {
        const url = request.nextUrl.clone();
        url.pathname = PATHS.SETUP;
        return NextResponse.redirect(url);
      }

      // Redirect away from setup if already completed
      if (isCompleted && pathname.includes(PATHS.SETUP)) {
        const url = request.nextUrl.clone();
        url.pathname = PATHS.DASHBOARD;
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error(error);
      // If no settings exist or query fails, redirect to setup
      if (!pathname.includes(PATHS.SETUP)) {
        const url = request.nextUrl.clone();
        url.pathname = PATHS.SETUP;
        return NextResponse.redirect(url);
      }
      // If already on setup page and query fails, allow access
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
