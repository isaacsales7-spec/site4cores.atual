# 4cores

Loja de suprimentos para impressoras, com Home, carrinho e checkout local.

## Stack

React, TypeScript strict, Vite, TailwindCSS v4, Biome, Vitest, NestJS e Prisma em um monorepo pnpm.

## Estrutura

`frontend/src/app` concentra bootstrap, rotas e shell global. `pages` compõe telas, `features` guarda comportamentos de catálogo e carrinho, e `shared` contém UI, tipos, tema e utilitários. O backend mantém módulos coesos em `backend/src/modules`; o módulo `health` valida a inicialização sem antecipar regras de negócio.

## Execução

```bash
pnpm install
pnpm --filter @4cores/frontend dev
pnpm --filter @4cores/backend start:dev
```

A Home abre em `http://localhost:5173` e a API em `http://localhost:3000/health`. Para o banco local, copie `backend/.env.example` para `backend/.env` e execute `pnpm --filter @4cores/backend exec prisma generate`.

## Verificações

```bash
pnpm check
pnpm test
pnpm build
python3 gerar_zip.py
```

O script de ZIP respeita os `.gitignore`, remove artefatos e preserva `.env.example`. Consulte [docs/contribuicao.md](docs/contribuicao.md) para as convenções.
 
