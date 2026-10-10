import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session-token";
import { sessionProfiles } from "@/lib/session-profiles";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;
  const session = verifySessionToken(sessionCookie, sessionProfiles);

  // 1. Unauthenticated OR Guest users must sign in
  if (!session || session.role === "guest") {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Staff-only protection for /kitchen
  if (pathname.startsWith("/kitchen") && session.role !== "staff") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout",
    "/checkout/:path*",
    "/orders",
    "/orders/:path*",
    "/kitchen",
    "/kitchen/:path*",
  ],
};