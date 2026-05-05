import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes we want to protect
const isProtectedRoute = createRouteMatcher(['/profile(.*)', '/orders(.*)'])
const isAdminRoute = createRouteMatcher(['/admin-panel(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // If this is an admin route, require authentication and check for an admin role
  if (isAdminRoute(req)) {
    const authObj = await auth()

    // Redirect unauthenticated users to sign-in
    if (!authObj.userId) {
      return authObj.redirectToSignIn({ returnBackUrl: req.nextUrl.pathname })
    }

    // Read role from sessionClaims.metadata.role
    // In Clerk Dashboard → Sessions → Customize session token, set:
    //   { "metadata": "{{user.public_metadata}}" }
    // This maps publicMetadata into the JWT under the key "metadata"
    const userRole = authObj.sessionClaims?.metadata?.role

    // console.log('Session claims:', authObj.sessionClaims)
    console.log('Resolved user role:', userRole)

    // If not an admin role, redirect to homepage
    const adminRoles = ['SUPER_ADMIN', 'STORE_MANAGER', 'SUPPORT_AGENT']
    if (!adminRoles.includes(userRole as string)) {
      return Response.redirect(new URL('/', req.url))
    }

    // If they are an admin and hit the base admin route, redirect to the dashboard
    if (req.nextUrl.pathname === '/admin-panel') {
      return Response.redirect(new URL('/admin-panel/dashboard', req.url))
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
