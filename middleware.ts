import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Redirect from /dashboard to role-specific dashboard
    if (path === "/dashboard") {
      if (token?.role === "lawyer") {
        return NextResponse.redirect(new URL("/dashboard/lawyer", req.url))
      }
      if (token?.role === "client") {
        return NextResponse.redirect(new URL("/dashboard/client", req.url))
      }
    }

    // Protect lawyer routes
    if (path.startsWith("/dashboard/lawyer") && token?.role !== "lawyer") {
      return NextResponse.redirect(new URL("/auth/lawyer/login", req.url))
    }

    // Protect client routes
    if (path.startsWith("/dashboard/client") && token?.role !== "client") {
      return NextResponse.redirect(new URL("/auth/client/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/case-folders/:path*",
    "/api/documents/:path*"
  ]
}