import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const { pathname } = req.nextUrl;

      // Protected routes
      if (pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }
      if (pathname.startsWith("/dashboard")) {
        return !!token;
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
