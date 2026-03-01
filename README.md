# 360 - SaaS Monorepo

Este é o monorepo do produto **360** focado em arquitetura B2B Multi-tenant, construído usando [Turborepo](https://turbo.build/repo).

## Estrutura do Projeto

- `apps/web`: Site institucional (Porta **3000** local)
- `apps/app`: Aplicação SaaS Mão na Massa (Porta **3001** local)
- `packages/ui`: Componentes React compartilhados UI (shadcn/ui futuramente)
- `packages/eslint-config`: Configurações padrão de ESLint
- `packages/typescript-config`: Configurações TS padrão

## Scripts Principais (Root)

Para executar qualquer um destes scripts na raiz, use o gerenciador `pnpm`:

- `pnpm install` - Instala dependências do monorepo
- `pnpm dev` - Inicia ambos os apps (web e app) localmente.
- `pnpm lint` - Roda o lint em todo o monorepo.
- `pnpm typecheck` - Checa a tipologia TS em todo o monorepo via tsc.
- `pnpm build` - Builda todos os pacotes usando Turbo.

## Deploy no EasyPanel (Docker)

Foi configurado um `Dockerfile` paramétrico na raiz do repositório. O EasyPanel deve buildar 1 serviço por aplicação (`web` e `app` de forma independente). 
Cada projeto tem seu output definido para `standalone` no `next.config.js`.

### Passos de Configuração do Serviço no Painel:

1. **Service 1 (Site Web)**
   - Crie o "App" apontando para este repositório Github.
   - Defina o Build Type para `Dockerfile`.
   - Adicione este Build Argument: `APP_NAME=web`.
   - Porta interna que será exposta: `3000`.

2. **Service 2 (SaaS App)**
   - Crie o "App" apontando para este repositório Github.
   - Defina o Build Type para `Dockerfile`.
   - Adicione este Build Argument: `APP_NAME=app`.
   - Porta interna que será exposta: `3000`.
   
*(Nota: Lembre-se que no Docker os apps rodam isolados, então internamente cada container usará a porta `3000`, exposta no exterior como configurado pelo panel).*
