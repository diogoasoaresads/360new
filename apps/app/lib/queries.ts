import { db } from "@repo/db";
import { organizations, memberships, users } from "@repo/db/schema";
import { eq, and } from "drizzle-orm";

/** Retorna todas as orgs que um user pertence */
export async function getOrgsForUser(userId: string) {
    const rows = await db
        .select({
            orgId: organizations.id,
            orgName: organizations.name,
            orgSlug: organizations.slug,
            orgType: organizations.type,
            role: memberships.role,
        })
        .from(memberships)
        .innerJoin(organizations, eq(memberships.orgId, organizations.id))
        .where(eq(memberships.userId, userId));
    return rows;
}

/** Retorna a org pelo slug */
export async function getOrgBySlug(slug: string) {
    const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.slug, slug))
        .limit(1);
    return org ?? null;
}

/** Verifica se o user é membro da org */
export async function getMembership(userId: string, orgId: string) {
    const [row] = await db
        .select()
        .from(memberships)
        .where(and(eq(memberships.userId, userId), eq(memberships.orgId, orgId)))
        .limit(1);
    return row ?? null;
}

/** Retorna a lista de membros de uma org com dados do user */
export async function getMembersOfOrg(orgId: string) {
    const rows = await db
        .select({
            userId: users.id,
            userName: users.name,
            userEmail: users.email,
            userImage: users.image,
            role: memberships.role,
        })
        .from(memberships)
        .innerJoin(users, eq(memberships.userId, users.id))
        .where(eq(memberships.orgId, orgId));
    return rows;
}

/** Retorna orgs-filha (Clients de uma Agency) */
export async function getChildOrgs(parentOrgId: string) {
    const rows = await db
        .select()
        .from(organizations)
        .where(eq(organizations.parent_id, parentOrgId));
    return rows;
}
