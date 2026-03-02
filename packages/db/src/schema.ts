import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "@auth/core/adapters";

// --- AUTH.JS V5 CORE TABLES ---

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount["type"]>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
);

// --- 360 SAAS MULTI-TENANT CORE ---

export const organizations = pgTable("organization", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").unique().notNull(),
    name: text("name").notNull(),
    type: text("type", { enum: ["PO", "AGENCY", "CLIENT"] }).notNull(),
    parent_id: text("parent_id"), // Null for PO/Agency. References 'organizations.id' for Client
});

export const memberships = pgTable(
    "membership",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        orgId: text("orgId")
            .notNull()
            .references(() => organizations.id, { onDelete: "cascade" }),
        role: text("role", { enum: ["OWNER", "ADMIN", "MEMBER"] }).notNull(),
    },
    (table) => ({
        compoundKey: primaryKey({ columns: [table.userId, table.orgId] }),
    })
);

// --- CRM MODULE ---

export const pipelines = pgTable("pipeline", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    orgId: text("orgId")
        .notNull()
        .references(() => organizations.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const dealStages = pgTable("deal_stage", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    pipelineId: text("pipelineId")
        .notNull()
        .references(() => pipelines.id, { onDelete: "cascade" }),
    color: text("color").default("#6c5ce7"),
    order: integer("order").notNull().default(0),
});

export const deals = pgTable("deal", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    amount: integer("amount").default(0), // em centavos
    stageId: text("stageId")
        .notNull()
        .references(() => dealStages.id, { onDelete: "cascade" }),
    orgId: text("orgId")
        .notNull()
        .references(() => organizations.id, { onDelete: "cascade" }),
    contactName: text("contactName"),
    contactEmail: text("contactEmail"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});
