import { routes } from "@/utils/routes";
import { NextRequest, NextResponse } from "next/server";

// Stop Middleware running on static files https://stackoverflow.com/questions/76348460/nextjs-13-4-app-router-middleware-page-redirect-has-no-styles
export const config = { matcher: "/((?!.*\\.).*)" };

const notAuthorizedPaths = [routes.LOGIN, routes.REGISTER, routes.INIT];
const publicPaths = ["/-/", "/_next", ...notAuthorizedPaths];

// export const middleware = async (request: NextRequest) => {
//   const path = request.nextUrl.pathname;
//   const apiUrl = process.env.NEXT_PUBLIC_APP1_URL;
//   const authCookieToken = request.cookies.get("AuthCookie");
//   console.log(request.cookies.getAll());
//
//   const isInitialized = await fetch(`${apiUrl}/initialize`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   }).then(async (res) => {
//     if (!res.ok) {
//       console.warn("Unable to fetch initialized.");
//     } else {
//       const dataInit = await res.json();
//       return dataInit.isInitialized;
//     }
//   });
//
//   if (!isInitialized) {
//     if (!path.startsWith(routes.INIT)) {
//       return NextResponse.redirect(new URL(routes.INIT, request.url));
//     }
//   }
//
//   if (authCookieToken?.value) {
//     const fetchCurrentUser = await fetch(`${apiUrl}/users`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authCookieToken?.value}`,
//       },
//     }).then(async (res) => {
//       if (!res.ok) {
//         console.warn("Invalid token detected, clearing cookies.");
//
//         const clearAuthCookie = await fetch(`${apiUrl}/auth/clear-auth`, { method: "DELETE" });
//         console.log("OK");
//         console.log(clearAuthCookie.ok);
//         console.log("Headers");
//         console.log(clearAuthCookie.headers);
//         const newResponse = NextResponse.redirect(new URL(routes.LOGIN, request.url));
//         newResponse.cookies.delete("AuthCookie");
//         console.log("All Cookies");
//         console.log(newResponse.cookies.getAll());
//         console.log("New Response");
//         console.log(newResponse);
//         return newResponse; //NextResponse.redirect(new URL(routes.LOGIN, request.url));
//       } else {
//         if (path.startsWith(routes.LOGIN)) {
//           return NextResponse.redirect(new URL(routes.DASHBOARD, request.url));
//         }
//         return NextResponse.next();
//       }
//     });
//     console.log("fetchCurrentUser");
//     console.log(fetchCurrentUser);
//     fetchCurrentUser.cookies.delete("AuthCookie");
//     return fetchCurrentUser;
//   }
//
//   // public
//   if (publicPaths.find((allowed) => path.startsWith(allowed))) {
//     return NextResponse.next();
//   }
//
//   return NextResponse.redirect(new URL(routes.LOGIN, request.url));
// };

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const apiUrl = process.env.NEXT_PUBLIC_APP1_URL;
  const authCookieToken = request.cookies.get("AuthCookie");

  console.log("Request Cookies:", request.cookies.getAll());

  // ✅ Bypass middleware for public paths immediately
  if (publicPaths.some((allowed) => path.startsWith(allowed))) {
    return NextResponse.next();
  }

  // ✅ Check if the application is initialized
  try {
    const res = await fetch(`${apiUrl}/initialize`, { method: "GET" });
    const { isInitialized } = res.ok ? await res.json() : { isInitialized: false };

    if (!isInitialized && !path.startsWith(routes.INIT)) {
      return NextResponse.redirect(new URL(routes.INIT, request.url));
    }
  } catch (error) {
    console.error("Error checking initialization:", error);
  }

  // ✅ If no auth token, redirect to login (excluding login itself)
  if (!authCookieToken?.value) {
    return NextResponse.redirect(new URL(routes.LOGIN, request.url));
  }

  // ✅ Validate auth token
  try {
    const userResponse = await fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCookieToken.value}`,
      },
    });

    // ❌ Invalid Token: Clear cookie and redirect to login
    if (!userResponse.ok) {
      console.warn("Invalid token detected, clearing cookies.");

      const response = NextResponse.redirect(new URL(routes.LOGIN, request.url));
      response.cookies.delete("AuthCookie");
      return response;
    }

    // ✅ If user is already on login, send them to the dashboard
    if (path.startsWith(routes.LOGIN)) {
      return NextResponse.redirect(new URL(routes.DASHBOARD, request.url));
    }
  } catch (error) {
    console.error("Error validating user:", error);
  }

  return NextResponse.next();
};
