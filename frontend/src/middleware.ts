import { getGetInitializedQueryKey } from "@/utils/api";
import { absoluteUrl, verifyJwtToken } from "@/utils/middleware-helper";
import { routes } from "@/utils/routes";
import { NextRequest, NextResponse } from "next/server";

const notAuthorizedPaths = [
  routes.LOGIN,
  routes.REGISTER,
  routes.INIT,
  routes.VERIFY,
  routes.FORGOT_PASSWORD,
  routes.RESET_PASSWORD,
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const cookieTokenName = "AuthCookie";
let isInit = false;

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isNonProtectedPath = notAuthorizedPaths.includes(pathname);

  const token = request.cookies.get(cookieTokenName)?.value;
  const verifiedToken = await verifyJwtToken(token);

  // If token exists and is not valid, delete the cookie and redirect to login.
  if (!!token && verifiedToken === null) {
    const response = NextResponse.redirect(absoluteUrl(request, routes.LOGIN));
    response.cookies.delete(cookieTokenName);
    return response;
  }

  // --- Step 1: Check if the application is initialised ---
  try {
    if (!isInit) {
      const initResponse = await fetch(`${apiUrl}${getGetInitializedQueryKey()[0]}`, {
        method: "GET",
      })
        .then(async (response) => {
          console.log(JSON.stringify(response, null, 2));
          return await response.json();
        })
        .catch(async (error) => {
          console.log(JSON.stringify(error, null, 2));
          return await error.json();
        });
      const { isInitialized } = initResponse;
      isInit = isInitialized;
      console.log(`[AUTH] App initialised: ${isInit}`);
    }

    if (!isInit && pathname !== routes.INIT) {
      // Allow access only to the init page itself.
      console.log(`[AUTH] App not initialised. Redirecting from ${pathname} to ${routes.INIT}`);
      return NextResponse.redirect(absoluteUrl(request, routes.INIT));
    }

    if (!isInit && pathname === routes.INIT) {
      // Allow access only to the init page itself.
      console.log(`[AUTH] App not initialised. Redirecting from ${pathname} to ${routes.INIT}`);
      return NextResponse.next();
    }

    // If the app IS initialised but the user tries to access the init page, redirect them to the login page.
    if (isInit && pathname === routes.INIT) {
      console.log(`[AUTH] App already initialised. Redirecting from ${pathname} to ${routes.LOGIN}`);
      return NextResponse.redirect(absoluteUrl(request, routes.LOGIN));
    }
  } catch (error) {
    console.error("[AUTH] Failed to check initialisation status:", JSON.stringify(error, null, 2));
    // Handle this error state appropriately, perhaps by showing a generic error page.
    // For now, we'll let it fall through to token validation.
  }

  // --- Step 2: Validate User Authentication Token (Optimized) ---
  // If there's a token, verify it directly in the middleware.
  if (!!verifiedToken) {
    try {
      // TOKEN IS VALID
      // If the user is on a public-only page (like login/register), redirect to dashboard.
      if (isNonProtectedPath) {
        console.log(`[AUTH] Valid token. User on public page ${pathname}. Redirecting to ${routes.DASHBOARD}`);
        return NextResponse.redirect(absoluteUrl(request, routes.DASHBOARD));
      }

      // Allow access to the requested protected page.
      return NextResponse.next();
    } catch (error) {
      // TOKEN IS INVALID (or expired)
      console.log(`[AUTH] Invalid token. Deleting cookie and redirecting to ${routes.LOGIN}`);
      // If verification fails, the token is invalid. Redirect to login and delete the cookie.
      const response = NextResponse.redirect(absoluteUrl(request, routes.LOGIN));
      response.cookies.delete(cookieTokenName);
      return response;
    }
  }

  // --- Step 3: Handle Users Without a Token ---
  // If there's no token and the user is trying to access a protected path, redirect them.
  if (!verifiedToken) {
    if (isNonProtectedPath) {
      return NextResponse.next();
    }
    // console.log(`[AUTH] No token. Access to protected route ${pathname} denied. Redirecting to ${routes.LOGIN}`);
    return NextResponse.redirect(absoluteUrl(request, routes.LOGIN));
  }

  // Otherwise, allow the request to proceed (e.g., to the login page).
  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
