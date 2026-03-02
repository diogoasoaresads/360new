import { getOrgBySlug } from "../../../../../lib/queries";
import { getPipelineById, getStages, getDeals } from "../../../../../lib/crm-queries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PipelineKanbanPage({
    params,
}: {
    params: Promise<{ orgSlug: string; pipelineId: string }>;
}) {
    const { orgSlug, pipelineId } = await params;
    const org = await getOrgBySlug(orgSlug);
    if (!org) notFound();

    const pipeline = await getPipelineById(pipelineId);
    if (!pipeline || pipeline.orgId !== org.id) notFound();

    const stages = await getStages(pipelineId);
    const deals = await getDeals(org.id, pipelineId);

    return (
        <>
            <div className="page-header" style={{ marginBottom: 20 }}>
                <h1>{pipeline.name}</h1>
                <p>Visão Kanban dos seus negócios em <strong>{org.name}</strong></p>
            </div>

            <div className="kanban-wrapper" style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                paddingBottom: "20px",
                minHeight: "calc(100vh - 200px)"
            }}>
                {stages.map((stage: any) => {
                    const stageDeals = deals.filter((d: any) => d.stageId === stage.id);

                    return (
                        <div key={stage.id} className="kanban-column" style={{
                            background: "var(--bg-secondary)",
                            borderRadius: "var(--radius)",
                            width: "300px",
                            minWidth: "300px",
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid var(--border)"
                        }}>
                            <div className="kanban-column-header" style={{
                                padding: "16px",
                                borderBottom: `2px solid ${stage.color || "var(--accent)"}`,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{stage.name}</span>
                                <span className="badge badge-member" style={{ opacity: 0.7 }}>{stageDeals.length}</span>
                            </div>

                            <div className="kanban-column-content" style={{
                                padding: "12px",
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px"
                            }}>
                                {stageDeals.map((deal: any) => (
                                    <div key={deal.id} className="card" style={{ padding: "12px" }}>
                                        <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "4px" }}>
                                            {deal.name}
                                        </div>
                                        <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "8px" }}>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((deal.amount || 0) / 100)}
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                            👤 {deal.contactName || "Sem contato"}
                                        </div>
                                    </div>
                                ))}

                                {stageDeals.length === 0 && (
                                    <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                                        Nenhum negócio
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
