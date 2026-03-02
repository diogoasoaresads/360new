import { getOrgBySlug, getMembersOfOrg, getChildOrgs } from "../../../lib/queries";
import { notFound } from "next/navigation";

export default async function OrgDashboardPage({
    params,
}: {
    params: Promise<{ orgSlug: string }>;
}) {
    const { orgSlug } = await params;
    const org = await getOrgBySlug(orgSlug);
    if (!org) notFound();

    const members = await getMembersOfOrg(org.id);
    const childOrgs = org.type === "AGENCY" ? await getChildOrgs(org.id) : [];

    return (
        <>
            <div className="page-header">
                <h1>Dashboard — {org.name}</h1>
                <p>Visão geral da organização <strong>/{org.slug}</strong></p>
            </div>

            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-label">Tipo</div>
                    <div className="stat-value">
                        <span className={`badge badge-${org.type.toLowerCase()}`}>{org.type}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Membros</div>
                    <div className="stat-value">{members.length}</div>
                </div>
                {org.type === "AGENCY" && (
                    <div className="stat-card">
                        <div className="stat-label">Clientes</div>
                        <div className="stat-value">{childOrgs.length}</div>
                    </div>
                )}
            </div>

            {/* Membros rápidos */}
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16 }}>Membros</h2>
                {members.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr><th>Nome</th><th>Email</th><th>Papel</th></tr>
                        </thead>
                        <tbody>
                            {members.map((m) => (
                                <tr key={m.userId}>
                                    <td>{m.userName ?? "—"}</td>
                                    <td style={{ color: "var(--text-secondary)" }}>{m.userEmail}</td>
                                    <td>
                                        <span className={`badge badge-${m.role.toLowerCase()}`}>{m.role}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state"><p>Sem membros vinculados.</p></div>
                )}
            </div>

            {/* Sub-orgs para Agencies */}
            {org.type === "AGENCY" && childOrgs.length > 0 && (
                <div>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16 }}>Clientes vinculados</h2>
                    <div className="card-grid">
                        {childOrgs.map((child) => (
                            <a key={child.id} href={`/${child.slug}`}>
                                <div className="card">
                                    <span className="card-title">{child.name}</span>
                                    <span className="card-subtitle">/{child.slug}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
