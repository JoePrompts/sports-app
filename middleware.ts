import { authMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  async afterAuth(auth, req) {
    console.log("Middleware running for:", req.nextUrl.pathname);

    // If trying to access admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!auth.userId) {
        const signInUrl = new URL("/sign-in", req.url);
        return NextResponse.redirect(signInUrl);
      }

      try {
        // Fetch the user directly
        const user = await clerkClient.users.getUser(auth.userId);
        console.log("User data:", {
          id: user.id,
          metadata: user.publicMetadata,
        });

        if (user.publicMetadata?.role !== "admin") {
          console.log("Access denied: User is not admin");
          const homeUrl = new URL("/", req.url);
          return NextResponse.redirect(homeUrl);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        const homeUrl = new URL("/", req.url);
        return NextResponse.redirect(homeUrl);
      }
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api|trpc)(.*)",
  ]
};