import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sticker/(.*)", "/api/trpc(.*)"],
  apiRoutes: [],
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/sticker/:stickerId*",
  ],
};
