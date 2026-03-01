import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
    const isLoginRoute = req.nextUrl.pathname === "/login";

    if (isApiAuthRoute) return;

    if (!isLoggedIn && !isLoginRoute) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isLoggedIn && isLoginRoute) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // TODO: Add Tenant Validation logic here using the req.auth and requested slug.
    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
