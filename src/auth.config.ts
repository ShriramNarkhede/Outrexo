import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Notice this is only an object, not a full Auth instance
export const authConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "https://www.googleapis.com/auth/gmail.send openid email profile",
                },
            },
        }),
    ],
    pages: {
        signIn: '/login',
        signOut: '/signout',
        error: '/error',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard =
                nextUrl.pathname.startsWith('/dashboard') ||
                nextUrl.pathname.startsWith('/campaigns') ||
                nextUrl.pathname.startsWith('/templates') ||
                nextUrl.pathname.startsWith('/settings');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            if (isLoggedIn && nextUrl.pathname === '/') {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/signup')) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            return true;
        },
        async session({ session, user, token }) {
            // When using database strategy, user is passed. 
            // When using jwt (which middleware uses effectively), token is passed.
            if (session.user && user) {
                session.user.id = user.id;
            } else if (session.user && token && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
} satisfies NextAuthConfig
