
// import { NextRequest, NextResponse } from "next/server";

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   // Cookie ya Authorization header dono check karo
//   const hasToken = request.cookies.has("accessToken") || 
//     !!request.headers.get("authorization")

//   if (pathname === "/" || pathname.startsWith("/chat")) {
//     return NextResponse.next();
//   }

//   if (pathname.startsWith("/dashboard")) {
//     if (!hasToken) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     return NextResponse.next();
//   }

//   if (pathname === "/login" || pathname === "/register") {
//     if (hasToken) {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/login", "/register", "/dashboard/:path*", "/chat/:path*"],
// };

import { NextRequest, NextResponse } from "next/server";

export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*", "/chat/:path*"],
};



