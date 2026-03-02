import { db } from "@repo/db";
import { organizations } from "@repo/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrgsPage() {
    const allOrgs = await db.select().from(organizations);

    return (
        <div style={{ padding: "40px", maxWidth: 900, margin: "0 auto" }}>
            <div className="page-header">
                <h1>Suas Organizações</h1>
                <p>Selecione uma organização para acessar o painel</p>
            </div>

            <div className="card-grid">
                {allOrgs.map((org) => (
                    <Link key={org.id} href={`/${org.slug}`}>
                        <div className="card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <span className="card-title">{org.name}</span>
                                <span className={`badge badge-${org.type.toLowerCase()}`}>{org.type}</span>
                            </div>
                            <span className="card-subtitle">/{org.slug}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {allOrgs.length === 0 && (
                <div className="empty-state">
                    <h3>Nenhuma organização encontrada</h3>
                    <p>Execute o seed para popular dados de teste.</p>
                </div>
            )}
        </div>
    );
}
