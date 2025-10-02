import { withAuth } from "next-auth/middleware";

export default withAuth({
  // `withAuth` augments your `Request` with the user's token.
});

export const config = {
  // The matcher config specifies the routes that the middleware will run on.
  // We are protecting the dashboard and any user-specific API routes.
  // The homepage ('/') is NOT included, so it remains public.
  matcher: ["/dashboard/:path*", "/api/user/:path*"],
};
