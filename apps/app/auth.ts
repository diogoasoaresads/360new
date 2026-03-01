import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@repo/db";
import { accounts, sessions, users, verificationTokens } from "@repo/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [], // Providers added later (e.g. Google, Credentials)
    callbacks: {
        session({ session, user }) {
            return session;
        },
    },
});
