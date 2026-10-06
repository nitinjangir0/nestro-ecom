// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/checkout', '/profile'];
const AUTH_ROUTES = ['/login', '/register','/verify-otp'];


export function proxy(request) {
    const { pathname } = request.nextUrl;  // get the pathname from the request URL
    const token = request.cookies.get('jwt')?.value || null // get the token from cookies, if it exists

    if (PROTECTED_ROUTES.includes(pathname) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

     if (AUTH_ROUTES.includes(pathname) && token) {
        return NextResponse.redirect(new URL('/Home', request.url));
    }
}

export const config = {
    matcher: [
        // Match protected patterns; exclude public paths
        '/checkout',
        '/profile',
        '/login',
        '/register',
        '/verify-otp'
    ],
};