import { routes } from "@/utils/routes";
import { NextRequest, NextResponse } from "next/server";

// Stop Middleware running on static files https://stackoverflow.com/questions/76348460/nextjs-13-4-app-router-middleware-page-redirect-has-no-styles
export const config = { matcher: "/((?!.*\\.).*)" };

const notAuthorizedPaths = [routes.LOGIN, routes.REGISTER, routes.INIT];
const publicPaths = ["/-/", "/_next", ...notAuthorizedPaths];

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const apiUrl = process.env.NEXT_PUBLIC_APP1_URL;
  const authCookieToken = request.cookies.get("AuthCookie");

  const isInitialized = await fetch(`${apiUrl}/initialize`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(async (res) => {
    if (!res.ok) {
      console.warn("Unable to fetch initialized.");
    } else {
      const dataInit = await res.json();
      return dataInit.isInitialized;
    }
  });

  if (!isInitialized) {
    if (!path.startsWith(routes.INIT)) {
      return NextResponse.redirect(new URL(routes.INIT, request.url));
    }
  }

  if (authCookieToken) {
    return await fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCookieToken?.value}`,
      },
    }).then(async (res) => {
      if (!res.ok) {
        console.warn("Invalid token detected, clearing cookies.");

        await fetch(`${apiUrl}/auth/clear-auth`, { method: "DELETE" });
        const newResponse = NextResponse.redirect(new URL(routes.LOGIN, request.url));
        newResponse.cookies.delete("AuthCookie");
        return newResponse; //NextResponse.redirect(new URL(routes.LOGIN, request.url));
      } else {
        if (path.startsWith(routes.LOGIN)) {
          return NextResponse.redirect(new URL(routes.DASHBOARD, request.url));
        }
        return NextResponse.next();
      }
    });
  }

  // public
  if (publicPaths.find((allowed) => path.startsWith(allowed))) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(routes.LOGIN, request.url));
};
