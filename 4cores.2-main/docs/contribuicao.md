# Contribuição

## Princípios

Cada módulo deve ter uma responsabilidade clara e depender de contratos simples. A organização por features evita que a página vire um componente monolítico; `shared` é reservado para código realmente transversal. O backend permanece modular para permitir evolução sem antecipar autenticação, pedidos ou pagamentos.

## Convenções

Use TypeScript strict, nomes em inglês no código e textos da interface em português. Prefira HTML semântico, componentes acessíveis e tokens semânticos de tema. Ícones são consumidos somente pela fachada em `shared/ui/Icons.tsx`.

## Testes

Teste comportamento observável e fluxos críticos, com unitários para funções puras e integração para componentes, hooks e endpoints. A estratégia segue o ISTQB: testes antecipados, agrupamento de defeitos, contexto e manutenção contínua dos casos.

## Qualidade e contribuição

Antes de abrir um PR, execute `pnpm check`, `pnpm test` e `pnpm build`. Mantenha mudanças focadas, documente decisões que expliquem o porquê e use Conventional Commits, por exemplo `feat(frontend): adiciona filtro de produtos`. Um PR deve ter descrição objetiva, validação executada e nenhuma credencial ou artefato gerado.