import { routes } from "@/utils/routes";
import { NextRequest, NextResponse } from "next/server";

// Stop Middleware running on static files https://stackoverflow.com/questions/76348460/nextjs-13-4-app-router-middleware-page-redirect-has-no-styles
export const config = { matcher: "/((?!.*\\.).*)" };

const notAuthorizedPaths = [routes.LOGIN, routes.REGISTER, routes.INIT];
const publicPaths = ["/-/", "/_next", ...notAuthorizedPaths];

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const apiUrl = process.env.NEXT_PUBLIC_APP1_URL;
  const authCookieToken = request.cookies.get("AuthCookie")?.value;

  console.log("Request");
  console.log(request);
  console.log("Path");
  console.log(path);
  console.log("authCookieToken");
  console.log(authCookieToken);

  try {
    const res = await fetch(`${apiUrl}/initialize`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Failed to fetch initialization status:", res.statusText);
      return NextResponse.next(); // Let request pass if API call fails
    }

    const data = await res.json();
    const { isInitialized } = data;

    if (isInitialized) {
      if (request.nextUrl.pathname === routes.INIT) {
        return NextResponse.redirect(new URL(routes.DASHBOARD, request.url));
      }
    }
    if (!isInitialized) {
      if (request.nextUrl.pathname === routes.INIT) {
        return NextResponse.next();
      }
      // If not initialized, redirect to the /init page
      if (request.nextUrl.pathname !== routes.INIT) {
        return NextResponse.redirect(new URL(routes.INIT, request.url));
      }
    }
  } catch (error) {
    console.error("Error checking initialization status:", error);
  }

  // If token exists, validate it --> remove invalid token
  try {
    if (authCookieToken) {
      const authRes = await fetch(`${apiUrl}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCookieToken}`,
        },
      });

      const authData = await authRes.json();
      console.log("Auth user data");
      console.log(authData);

      if (!authRes.ok) {
        console.warn("Invalid token detected, clearing cookies.");

        // Create a response and delete the token cookie
        const response = NextResponse.redirect(new URL(routes.LOGIN, request.url));
        response.cookies.delete("AuthCookie");

        return response;
      }
    }
  } catch (error) {
    console.error("Error in middleware:", error);
  }

  // AUTH
  if (request.cookies.has("AuthCookie")) {
    if (notAuthorizedPaths.find((allowed) => path.startsWith(allowed))) {
      return NextResponse.redirect(new URL(routes.DASHBOARD, request.url));
    } else {
      return NextResponse.next();
    }
  }

  // public
  if (publicPaths.find((allowed) => path.startsWith(allowed))) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL(routes.LOGIN, request.url));
};
