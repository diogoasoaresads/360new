import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrgBySlug, getChildOrgs } from "../../../lib/queries";

export default async function TenantLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ orgSlug: string }>;
}) {
    const { orgSlug } = await params;
    const org = await getOrgBySlug(orgSlug);

    if (!org) notFound();

    const childOrgs = org.type === "AGENCY" ? await getChildOrgs(org.id) : [];

    return (
        <div>
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">360</div>
                    <div className="sidebar-org">
                        <span className={`badge badge-${org.type.toLowerCase()}`}>{org.type}</span>
                        {" "}{org.name}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-title">Principal</div>
                    <Link href={`/${orgSlug}`}>📊 Dashboard</Link>
                    <Link href={`/${orgSlug}/members`}>👥 Membros</Link>

                    {org.type === "AGENCY" && (
                        <>
                            <div className="sidebar-section-title">Clientes</div>
                            {childOrgs.map((child) => (
                                <Link key={child.id} href={`/${child.slug}`}>
                                    🏢 {child.name}
                                </Link>
                            ))}
                            {childOrgs.length === 0 && (
                                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", padding: "4px 12px" }}>
                                    Nenhum cliente vinculado
                                </span>
                            )}
                        </>
                    )}

                    {org.type === "PO" && (
                        <>
                            <div className="sidebar-section-title">Plataforma</div>
                            <Link href={`/${orgSlug}/organizations`}>🏛️ Organizações</Link>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <Link href="/orgs" style={{ color: "var(--accent)", fontSize: "0.8rem" }}>
                        ← Trocar organização
                    </Link>
                </div>
            </aside>

            {/* MAIN */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
