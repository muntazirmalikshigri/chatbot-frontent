import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check accessToken cookie
  const token = request.cookies.get("accessToken");
  const hasToken = !!token?.value;

  // Always public — never redirect
  if (
    pathname === "/" ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Protected — must be logged in
  if (pathname.startsWith("/dashboard")) {
    if (!hasToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Auth pages — already logged in → dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (hasToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/chat/:path*",
  ],
};



