import { db } from "@repo/db";
import { pipelines, dealStages, deals } from "@repo/db/schema";
import { eq, and, asc } from "drizzle-orm";

/** Retorna todos os pipelines de uma organização */
export async function getPipelines(orgId: string) {
    return await db
        .select()
        .from(pipelines)
        .where(eq(pipelines.orgId, orgId))
        .orderBy(asc(pipelines.name));
}

/** Retorna um pipeline específico pelo ID */
export async function getPipelineById(id: string) {
    const [pipeline] = await db
        .select()
        .from(pipelines)
        .where(eq(pipelines.id, id))
        .limit(1);
    return pipeline ?? null;
}

/** Retorna os estágios de um pipeline ordenados */
export async function getStages(pipelineId: string) {
    return await db
        .select()
        .from(dealStages)
        .where(eq(dealStages.pipelineId, pipelineId))
        .orderBy(asc(dealStages.order));
}

/** Retorna todos os deals de uma organização, filtrados opcionalmente por pipeline */
export async function getDeals(orgId: string, pipelineId?: string) {
    const conditions = [eq(deals.orgId, orgId)];

    if (pipelineId) {
        conditions.push(eq(dealStages.pipelineId, pipelineId));
    }

    return await db
        .select({
            id: deals.id,
            name: deals.name,
            amount: deals.amount,
            stageId: deals.stageId,
            contactName: deals.contactName,
            contactEmail: deals.contactEmail,
            createdAt: deals.createdAt,
            stageName: dealStages.name,
        })
        .from(deals)
        .innerJoin(dealStages, eq(deals.stageId, dealStages.id))
        .where(and(...conditions));
}
