import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
    publicRoutes: ['/'],
    afterAuth(auth, req) {
        // Check if user is signed in and trying to access public routes
        if (auth.userId && auth.isPublicRoute) {
            const path = new URL(req.url).pathname;
            // Redirect to dashboard if on homepage
            if (path === '/') {
                const dashboardUrl = new URL('/dashboard', req.url);
                return Response.redirect(dashboardUrl);
            }
        }
    }
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/","/(api|trpc)(.*)"],
  };
  