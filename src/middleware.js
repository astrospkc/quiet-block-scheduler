import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs"; // important for Prisma-safe runtime

export async function middleware(req) {
  const url = req.nextUrl.pathname;

  // Skip auth for specific routes
  if (
    url.startsWith("/api/auth/signup") ||
    url.startsWith("/api/auth/login") ||
    url.startsWith("/") ||
    url.startsWith("/_next") ||
    url === "/favicon.ico"
  ) {
    return NextResponse.next();
  }
  //   const token = req.headers["authorization"]?.split(" ")[1];
  let token = req.headers.get("authorization")?.split(" ")[1];
  //   console.log("token: ", token);

  if (!token) {
    const cookies = req.headers.get("cookie");

    if (cookies) {
      const match = cookies.match(/auth-token=([^;]+)/);
      token = match ? match[1] : null;
    }
  }

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Instead of querying Prisma here, just pass userId forward
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.userId);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (err) {
    console.error("JWT error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
