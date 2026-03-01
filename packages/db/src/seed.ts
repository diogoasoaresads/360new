import "dotenv/config";
import { db } from "./index";
import { organizations, users, memberships } from "./schema";

async function main() {
    console.log("🌱 Starting database seed...");

    // 1. Create a Platform Owner User
    const [poUser] = await db
        .insert(users)
        .values({
            name: "Platform Owner",
            email: "po@360os.com",
        })
        .returning();

    // 2. Create the MASTER Organization (PO)
    const [poOrg] = await db
        .insert(organizations)
        .values({
            name: "360 Platform",
            slug: "360",
            type: "PO",
        })
        .returning();

    // 3. Bind PO user to PO Org
    await db.insert(memberships).values({
        userId: poUser.id,
        orgId: poOrg.id,
        role: "OWNER",
    });

    // 4. Create an Agency Org
    const [agencyOrg] = await db
        .insert(organizations)
        .values({
            name: "Agência Turbo",
            slug: "agenciat",
            type: "AGENCY",
        })
        .returning();

    // 5. Create Agency User
    const [agencyUser] = await db
        .insert(users)
        .values({
            name: "Dono da Agência",
            email: "dono@agenciaturbo.com",
        })
        .returning();

    await db.insert(memberships).values({
        userId: agencyUser.id,
        orgId: agencyOrg.id,
        role: "OWNER",
    });

    // 6. Create 2 Clients bound to the Agency
    const [clientA] = await db
        .insert(organizations)
        .values({
            name: "Cliente A",
            slug: "cliente-a",
            type: "CLIENT",
            parent_id: agencyOrg.id,
        })
        .returning();

    const [clientB] = await db
        .insert(organizations)
        .values({
            name: "Cliente B",
            slug: "cliente-b",
            type: "CLIENT",
            parent_id: agencyOrg.id,
        })
        .returning();

    console.log("✅ Database seeded successfully!");
    console.log("-------------------");
    console.log("PO Org:", poOrg.slug);
    console.log("Agency Org:", agencyOrg.slug);
    console.log("Client Orgs:", clientA.slug, ",", clientB.slug);
    process.exit(0);
}

main().catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
});
