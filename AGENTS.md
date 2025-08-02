# AGENTS.md

## Visão Geral
Este projeto implementa o “Card Creator v4.1” com arquitetura modular e princípios SOLID.
O código fonte está em `src/` e os estilos em `styles/`. Há ainda um script Python
(`extraction_script.py`) para extrair módulos do HTML original.

## Estrutura Principal
- `src/analysis/` – rotinas de análise de conteúdo.
- `src/layout/` – composição e otimização de layout.
- `src/plugins/` – plugins de blocos (texto, imagem etc.).
- `src/renderer/` – renderização de layouts.
- `src/state/` – controle de estado da aplicação.
- `src/ui/` – código da interface.
- `src/utils/` – utilidades diversas.
A entrada principal é `src/app.js`.

## Fluxo de Branches
- `main`: versão estável.
- `feature/*`: novas funcionalidades.
- `fix/*`: correções de bugs.
- `experiment/*`: experimentos ou protótipos.

## Commits
Siga o padrão [Conventional Commits](https://conventionalcommits.org) incluindo emojis, por exemplo:
```
🌿 feat: adiciona plugin de vídeo
🐛 fix: corrige upload de imagens grandes
📚 docs: atualiza README com novos plugins
🔧 refactor: move utils para paradigma funcional
```

## Testes
Não há suíte automatizada no momento. Caso crie testes, descreva aqui como executá-los
(por exemplo, `npm test` ou `pytest`). Mencione a execução dos testes nas PRs.

## Pull Requests
Resuma as mudanças, indique o impacto (plugins, layout, UI, state, docs) e informe se executou os
testes. PRs curtas e objetivas facilitam a revisão.

## Execução Local
Utilize um servidor HTTP para abrir o `index.html` (ex.: `python3 -m http.server 8000`)
e acesse pelo navegador. Os módulos ES6 exigem ser servidos via HTTP.

