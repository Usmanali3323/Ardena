// middleware.js
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, block protected API access
  if (!session?.user) {
    if (
      req.nextUrl.pathname.startsWith("/api/cart") ||
      req.nextUrl.pathname.startsWith("/api/orders") ||
      req.nextUrl.pathname.startsWith("/api/orders") ||
      req.nextUrl.pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  }


  // ✅ Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    
const role = session.user.app_metadata?.role;
console.log(session.user.app_metadata);
    if (role !== "admin") {
      // Block if not admin
      return NextResponse.redirect(new URL("/", req.url)); // redirect to homepage
      // or return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/admin/:path*", // protect all admin pages
  ],
};
