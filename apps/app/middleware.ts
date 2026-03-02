// Middleware temporariamente simplificado para permitir acesso sem auth
// O auth será reativado quando os providers forem configurados
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // Permitir todas as rotas por agora (sem auth ativo)
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
