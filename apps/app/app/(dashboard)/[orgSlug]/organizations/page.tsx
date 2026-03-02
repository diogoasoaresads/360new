import { db } from "@repo/db";
import { organizations } from "@repo/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AllOrganizationsPage({
    params,
}: {
    params: Promise<{ orgSlug: string }>;
}) {
    const { orgSlug } = await params;
    const allOrgs = await db.select().from(organizations);

    return (
        <>
            <div className="page-header">
                <h1>Todas as Organizações</h1>
                <p>Visão global da plataforma (acesso PO)</p>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Slug</th>
                        <th>Tipo</th>
                        <th>Parent</th>
                    </tr>
                </thead>
                <tbody>
                    {allOrgs.map((org) => (
                        <tr key={org.id}>
                            <td>
                                <Link href={`/${org.slug}`} style={{ color: "var(--accent)", fontWeight: 500 }}>
                                    {org.name}
                                </Link>
                            </td>
                            <td style={{ color: "var(--text-secondary)" }}>/{org.slug}</td>
                            <td>
                                <span className={`badge badge-${org.type.toLowerCase()}`}>{org.type}</span>
                            </td>
                            <td style={{ color: "var(--text-muted)" }}>{org.parent_id ?? "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
