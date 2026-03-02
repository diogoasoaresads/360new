import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@repo/db";
import { accounts, sessions, users, verificationTokens } from "@repo/db/schema";

const config = {
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [], // Providers added later (e.g. Google, Credentials)
    callbacks: {
        session({ session }) {
            return session;
        },
    },
} satisfies NextAuthConfig;

const nextAuth = NextAuth(config);

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const auth = nextAuth.auth;
