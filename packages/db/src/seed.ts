import "dotenv/config";
import { db } from "./index";
import {
    organizations,
    users,
    memberships,
    pipelines,
    dealStages,
    deals,
} from "./schema";

async function main() {
    console.log("🌱 Starting database seed...");

    // 0. Clean the database
    console.log("🧹 Cleaning database...");
    await db.delete(deals);
    await db.delete(dealStages);
    await db.delete(pipelines);
    await db.delete(memberships);
    await db.delete(organizations);
    await db.delete(users);

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

    // 7. CRM Seed - Create Pipeline for Agency
    const [agencyPipeline] = await db
        .insert(pipelines)
        .values({
            name: "Vendas Agência",
            orgId: agencyOrg.id,
        })
        .returning();

    const [stageLead, stageContato, stageFechado] = await db
        .insert(dealStages)
        .values([
            { name: "Lead", pipelineId: agencyPipeline.id, order: 0, color: "#6c5ce7" },
            { name: "Contato", pipelineId: agencyPipeline.id, order: 1, color: "#fdcb6e" },
            { name: "Fechado", pipelineId: agencyPipeline.id, order: 2, color: "#00cec9" },
        ])
        .returning();

    await db.insert(deals).values([
        { name: "Propaganda Coca-Cola", amount: 500000, stageId: stageLead.id, orgId: agencyOrg.id, contactName: "John Doe" },
        { name: "Campanha Verão", amount: 120000, stageId: stageContato.id, orgId: agencyOrg.id, contactName: "Jane Smith" },
    ]);

    // 8. CRM Seed - Create Pipeline for Client A
    const [clientAPipeline] = await db
        .insert(pipelines)
        .values({
            name: "Vendas Diretas",
            orgId: clientA.id,
        })
        .returning();

    const [cStageNovo, cStageGanhado] = await db
        .insert(dealStages)
        .values([
            { name: "Novo Lead", pipelineId: clientAPipeline.id, order: 0, color: "#a29bfe" },
            { name: "Ganhado", pipelineId: clientAPipeline.id, order: 1, color: "#55efc4" },
        ])
        .returning();

    await db.insert(deals).values([
        { name: "Venda Sapato X", amount: 45000, stageId: cStageNovo.id, orgId: clientA.id, contactName: "Mário" },
    ]);

    console.log("✅ Database seeded successfully!");
    console.log("-------------------");
    console.log("PO Org:", poOrg.slug);
    console.log("Agency Org:", agencyOrg.slug);
    console.log("Client Orgs:", clientA.slug, ",", clientB.slug);
    console.log("CRM Data created for Agency and Client A");
    process.exit(0);
}

main().catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
});
