import { getOrgBySlug } from "../../../../lib/queries";
import { getPipelines } from "../../../../lib/crm-queries";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CRMOverviewPage({
    params,
}: {
    params: Promise<{ orgSlug: string }>;
}) {
    const { orgSlug } = await params;
    const org = await getOrgBySlug(orgSlug);
    if (!org) notFound();

    const pipelines = await getPipelines(org.id);

    return (
        <>
            <div className="page-header">
                <h1>CRM — Pipelines</h1>
                <p>Selecione um funil de vendas para gerenciar seus negócios</p>
            </div>

            <div className="card-grid">
                {pipelines.map((p) => (
                    <Link key={p.id} href={`/${orgSlug}/crm/${p.id}`}>
                        <div className="card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <span className="card-title">{p.name}</span>
                                <span className="badge badge-member">Pipeline</span>
                            </div>
                            <span className="card-subtitle">Clique para ver o Kanban</span>
                        </div>
                    </Link>
                ))}
            </div>

            {pipelines.length === 0 && (
                <div className="empty-state">
                    <h3>Nenhum pipeline encontrado</h3>
                    <p>Você ainda não tem funis de vendas cadastrados.</p>
                </div>
            )}
        </>
    );
}
