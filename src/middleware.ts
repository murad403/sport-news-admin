import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "es", "fr", "de"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Redirect exact root / to /en/admin
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/en/admin";
    return NextResponse.redirect(url);
  }

  // 2. Redirect exact locale root (e.g. /en, /es) to /<locale>/admin
  const isExactLocale = SUPPORTED_LOCALES.some((locale) => pathname === `/${locale}`);
  if (isExactLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `${pathname}/admin`;
    return NextResponse.redirect(url);
  }

  // Check if the path already starts with a supported locale prefix (e.g., /en/...)
  const hasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`)
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  // Redirect legacy admin auth requests to their new location
  const legacyAuthMap: Record<string, string> = {
    "/admin/signin": "/en/auth/signin",
    "/admin/forgot-password": "/en/auth/forgot-password",
    "/admin/verify-otp": "/en/auth/verify-otp",
    "/admin/reset-password": "/en/auth/reset-password",
  };

  if (pathname in legacyAuthMap) {
    const url = request.nextUrl.clone();
    url.pathname = legacyAuthMap[pathname];
    return NextResponse.redirect(url);
  }

  // If visiting an auth route without a locale prefix, redirect to /en/auth
  if (pathname.startsWith("/auth") || pathname === "/auth") {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  // If visiting an admin route without a locale prefix, redirect to /en/admin
  if (pathname.startsWith("/admin") || pathname === "/admin") {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except static files, api, and internal next paths
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|next.svg|vercel.svg).*)"],
};
