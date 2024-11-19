import { routes } from "@/utils/routes";
import { NextRequest, NextResponse } from "next/server";

// Stop Middleware running on static files https://stackoverflow.com/questions/76348460/nextjs-13-4-app-router-middleware-page-redirect-has-no-styles
export const config = { matcher: "/((?!.*\\.).*)" };

const publicPaths = ["/-/", "/_next", routes.LOGIN, routes.REGISTRATION];

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;

  // public
  if (publicPaths.find((allowed) => path.startsWith(allowed))) {
    return NextResponse.next();
  }

  // AUTH - TODO
  if (request.cookies.has("Auth")) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(routes.LOGIN, request.url));
};
