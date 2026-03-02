import { getOrgBySlug, getMembersOfOrg } from "../../../../lib/queries";
import { notFound } from "next/navigation";

export default async function MembersPage({
    params,
}: {
    params: Promise<{ orgSlug: string }>;
}) {
    const { orgSlug } = await params;
    const org = await getOrgBySlug(orgSlug);
    if (!org) notFound();

    const members = await getMembersOfOrg(org.id);

    return (
        <>
            <div className="page-header">
                <h1>Membros — {org.name}</h1>
                <p>Gerencie os membros da organização</p>
            </div>

            {members.length > 0 ? (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Papel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((m) => (
                            <tr key={m.userId}>
                                <td style={{ fontWeight: 500 }}>{m.userName ?? "Sem nome"}</td>
                                <td style={{ color: "var(--text-secondary)" }}>{m.userEmail}</td>
                                <td>
                                    <span className={`badge badge-${m.role.toLowerCase()}`}>
                                        {m.role}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="empty-state">
                    <h3>Sem membros</h3>
                    <p>Nenhum membro vinculado a esta organização.</p>
                </div>
            )}
        </>
    );
}
