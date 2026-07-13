import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "es", "fr", "de"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Determine the locale and the path segments
  let locale = "en";
  let restPath = pathname;

  // Check if pathname starts with a supported locale prefix
  const matchedLocale = SUPPORTED_LOCALES.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (matchedLocale) {
    locale = matchedLocale;
    restPath = pathname.substring(matchedLocale.length + 1); // remove /en or /en/
    if (!restPath.startsWith("/")) {
      restPath = "/" + restPath;
    }
  } else {
    // Check legacy mappings first
    const legacyAuthMap: Record<string, string> = {
      "/admin/sign-in": "/auth/sign-in",
      "/admin/forgot-password": "/auth/forgot-password",
      "/admin/verify-otp": "/auth/verify-otp",
      "/admin/reset-password": "/auth/reset-password",
    };
    if (pathname in legacyAuthMap) {
      restPath = legacyAuthMap[pathname];
    } else {
      restPath = pathname;
    }
  }

  // Ensure restPath is normalized
  if (restPath === "/" || restPath === "") {
    restPath = "/admin";
  }

  // 2. Perform the authentication check
  const accessToken = request.cookies.get("access")?.value;

  const isAuthRoute = restPath.startsWith("/auth/") || restPath === "/auth";
  const isAdminRoute = restPath.startsWith("/admin/") || restPath === "/admin";

  let finalRestPath = restPath;

  if (accessToken) {
    // If authenticated, user cannot go to auth pages
    if (isAuthRoute) {
      finalRestPath = "/admin";
    }
  } else {
    // If not authenticated, user cannot go to admin pages
    if (isAdminRoute) {
      finalRestPath = "/auth/sign-in";
    }
  }

  // 3. Construct final destination URL
  const finalPathname = `/${locale}${finalRestPath}`;

  // If the constructed pathname differs from the incoming pathname, redirect
  if (pathname !== finalPathname) {
    const url = request.nextUrl.clone();
    url.pathname = finalPathname;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except static files, api, and internal next paths
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|next.svg|vercel.svg).*)"],
};
