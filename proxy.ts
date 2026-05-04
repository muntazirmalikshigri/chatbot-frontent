// import { NextRequest, NextResponse } from "next/server";

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const hasToken = request.cookies.has("accessToken");

//   if (pathname.startsWith("/dashboard") && !hasToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if ((pathname === "/login" || pathname === "/register") && hasToken) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/register"],
// };




import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has("accessToken");

  if (pathname === "/" || pathname.startsWith("/chat")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!hasToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/register") {
    if (hasToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*", "/chat/:path*"],
};
