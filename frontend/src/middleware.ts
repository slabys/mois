import { routes } from "@/utils/routes";
import { NextRequest, NextResponse } from "next/server";

// Stop Middleware running on static files https://stackoverflow.com/questions/76348460/nextjs-13-4-app-router-middleware-page-redirect-has-no-styles
export const config = { matcher: "/((?!.*\\.).*)" };

const notAuthorizedPaths = [routes.LOGIN, routes.REGISTER];
const publicPaths = ["/-/", "/_next", ...notAuthorizedPaths];

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;

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
