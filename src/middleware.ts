import { 
    authRoutes, 
    publicRoutes, 
    DEFAULT_LOGIN_REDIRECT, 
    apiAuthPrefix 
} from "../routes";

import { NextResponse } from "next/server";

import authConfig from "../auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth?.user;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            if (nextUrl.pathname === DEFAULT_LOGIN_REDIRECT) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return NextResponse.next();
    }

    if (nextUrl.pathname === "/") {
        const user = req.auth?.user;
        if (user?.role === "admin") {
            return NextResponse.redirect(new URL("/admin", nextUrl));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
        if (nextUrl.pathname === "/auth/sign-in") {
            return NextResponse.next(); // Prevent redirect loop
        } else if (nextUrl.pathname === "/auth/sign-up") {
            return NextResponse.next(); // Prevent redirect loop
        } else
        return NextResponse.redirect(new URL("/auth/sign-in", nextUrl));
    }

    return NextResponse.next();
});


export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
      ],
};