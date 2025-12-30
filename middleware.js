import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Check if the request is for an admin route
    if (pathname.startsWith('/admin') && false) {
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            await jwtVerify(token, key, {
                algorithms: ['HS256'],
            });
            return NextResponse.next();
        } catch (error) {
            console.error('Middleware: Token verification failed', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
