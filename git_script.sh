#!/bin/bash
# =============================================================================
# Card Creator v4.1 - Git Setup Completo
# Configura repositório Git com estrutura profissional
# =============================================================================

set -e  # Para em caso de erro

echo "🚀 Configurando controle de versão para Card Creator v4.1"
echo "============================================================"

# --- 1. Verificações iniciais ---
echo "📋 Verificando estrutura do projeto..."

required_files=(
    "index.html"
    "src/app.js"
    "src/ui/enhancedUIController.js"
    "src/state/enhancedCardState.js"
    "styles/main.css"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Arquivos essenciais não encontrados:"
    printf '%s\n' "${missing_files[@]}"
    echo "   Execute a refatoração primeiro!"
    exit 1
fi

echo "   ✅ Estrutura do projeto verificada"

# --- 2. Inicializar Git ---
echo "🔧 Inicializando repositório Git..."

if [ -d ".git" ]; then
    echo "   ⚠️  Repositório Git já existe"
    read -p "   Deseja continuar? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "   Operação cancelada."
        exit 1
    fi
else
    git init
    echo "   ✅ Repositório Git inicializado"
fi

# --- 3. Criar .gitignore ---
echo "📝 Criando .gitignore..."

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS Files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
*.log
logs/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
*.tgz
*.tar.gz

# Backup files
*.backup
*.bak
*.tmp
card-creator-com-marcacoes.html.backup
extract_modules.py

# Cache
.cache/
.parcel-cache/

# Testing
coverage/
.nyc_output/

# Documentation
.docusaurus/
EOF

echo "   ✅ .gitignore criado"

# --- 4. Configurar Git (se necessário) ---
echo "👤 Verificando configuração Git..."

if ! git config user.name > /dev/null 2>&1; then
    echo "   Configuração de usuário necessária"
    read -p "   Seu nome: " git_name
    read -p "   Seu email: " git_email
    git config user.name "$git_name"
    git config user.email "$git_email"
    echo "   ✅ Usuário configurado"
else
    echo "   ✅ Usuário já configurado: $(git config user.name)"
fi

# --- 5. Criar README.md profissional ---
echo "📚 Criando README.md profissional..."

cat > README.md << 'EOF'
# 🚀 Card Creator v4.1 - Modular Architecture

> Sistema extensível para criação de cards com arquitetura baseada em plugins e princípios SOLID.

![Status](https://img.shields.io/badge/Status-Stable-green)
![Version](https://img.shields.io/badge/Version-4.1.0-blue)
![Architecture](https://img.shields.io/badge/Architecture-Modular-purple)

## ✨ Features

- **🔌 Sistema de Plugins**: Extensível com novos tipos de blocos
- **🎨 Layout Adaptativo**: Engine inteligente de composição 
- **📱 Upload de Imagens**: Local + URL com preview
- **🏗️ Arquitetura SOLID**: Modular e sustentável
- **⚡ ES6 Modules**: Código organizado e performático
- **🎭 Interface Reativa**: Estado gerenciado com observadores

## 📁 Estrutura do Projeto

```
src/
├── analysis/          # 🔍 Análise de conteúdo
│   └── contentAnalyzer.js
├── layout/            # 📐 Composição de layout
│   ├── adaptiveLayoutComposer.js
│   ├── layoutComposer.js
│   └── layoutOptimizer.js
├── plugins/           # 🔌 Sistema de plugins
│   ├── blockPlugin.js
│   ├── imageBlockPlugin.js
│   ├── pluginRegistry.js
│   └── textBlockPlugin.js
├── renderer/          # 🎨 Renderização
│   └── enhancedLayoutRenderer.js
├── state/             # 🗃️ Gerenciamento de estado
│   └── enhancedCardState.js
├── ui/                # 🖥️ Interface do usuário
│   └── enhancedUIController.js
├── utils/             # 🛠️ Utilitários
│   ├── constants.js
│   ├── customErrors.js
│   ├── debouncer.js
│   ├── result.js
│   └── simpleObservable.js
└── app.js             # 🚪 Entry point

styles/main.css        # 🎨 Estilos
index.html            # 📄 HTML principal
```

## 🚀 Como Executar

### Pré-requisitos
- Servidor web local (ES6 modules requerem HTTP)

### Opções de Servidor

**Live Server (VS Code)**
```bash
# Instale a extensão Live Server
# Clique direito em index.html → "Open with Live Server"
```

**Python**
```bash
python3 -m http.server 8000
# Acesse http://localhost:8000
```

**Node.js**
```bash
npx serve .
# ou
npx http-server
```

## 🔧 Desenvolvimento

### Adicionando Novo Plugin

1. **Crie o plugin** em `src/plugins/`:
```javascript
import { BlockPlugin } from './blockPlugin.js';

export class MeuPlugin extends BlockPlugin {
    constructor() {
        super('meutipo', 'Meu Plugin', '🎯');
    }
    
    createBlock(data) {
        // Implementação
    }
    
    // ... outros métodos
}
```

2. **Registre o plugin** em `EnhancedCardState`:
```javascript
this.pluginRegistry.register(new MeuPlugin());
```

### Arquitetura

**Princípios SOLID aplicados:**
- **SRP**: Cada classe tem responsabilidade única
- **OCP**: Extensível via plugins sem modificar core
- **LSP**: Plugins seguem contrato comum
- **ISP**: Interfaces focadas e especializadas  
- **DIP**: Comunicação via observadores

## 📊 Roadmap

- [ ] **v4.2**: Plugin de vídeo
- [ ] **v4.3**: Sistema de temas
- [ ] **v4.4**: Export/Import de configurações
- [ ] **v5.0**: Paradigma funcional (experimento)

## 🤝 Contribuição

### Fluxo de Branches
```bash
main          # 🏠 Versão estável
├── feature/* # ✨ Novas funcionalidades
├── fix/*     # 🐛 Correções
└── experiment/* # 🧪 Experimentos
```

### Commits
Seguimos [Conventional Commits](https://conventionalcommits.org/):
```
🎯 feat: adiciona plugin de vídeo
🐛 fix: corrige upload de imagens grandes  
📚 docs: atualiza README com novos plugins
🔧 refactor: move utils para paradigma funcional
```

## 📜 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🏆 Créditos

Desenvolvido com foco em:
- **Clean Architecture**
- **SOLID Principles** 
- **Modern JavaScript (ES6+)**
- **Responsive Design**
- **Developer Experience**

---

*Arquitetura pensada para desenvolvimento colaborativo com IA* 🤖✨
EOF

echo "   ✅ README.md profissional criado"

# --- 6. Criar estrutura de branches ---
echo "🌿 Configurando branches..."

# Commit inicial
git add .
git commit -m "🎉 v4.1.0: Arquitetura modular estável

✅ Features implementadas:
- Sistema de plugins extensível (texto/imagem)
- Motor de layout adaptativo com estratégias
- Upload de imagens (local + URL)
- Arquitetura SOLID modular
- ES6 modules organizados
- Estado reativo com observadores
- Interface com abas e previews

🏗️  Estrutura:
- src/ com 7 módulos bem organizados
- styles/ separado e responsivo
- Princípios SOLID rigorosamente aplicados
- Separação clara de responsabilidades

🧪 Status: STABLE
📦 Afeta: arquitetura completa
🎯 Pronto para: desenvolvimento colaborativo com IA"

# Tag da versão
git tag -a v4.1.0 -m "🏷️  Card Creator v4.1.0 - Modular Architecture

Primeira versão com arquitetura completamente modular.
Marco histórico do projeto - base sólida para evoluções."

echo "   ✅ Commit inicial e tag v4.1.0 criados"

# --- 7. Criar branches de desenvolvimento ---
echo "🌿 Criando branches de desenvolvimento..."

# Branch para experimentos funcionais
git checkout -b experiment/functional-paradigm
git checkout main

# Branch para novos plugins
git checkout -b feature/video-plugin  
git checkout main

# Branch para temas
git checkout -b feature/themes
git checkout main

# Branch para melhorias de UI
git checkout -b feature/ui-improvements
git checkout main

echo "   ✅ Branches criadas:"
echo "      - experiment/functional-paradigm"
echo "      - feature/video-plugin"
echo "      - feature/themes" 
echo "      - feature/ui-improvements"

# --- 8. Criar template de commit ---
echo "📝 Configurando template de commit..."

cat > .gitmessage << 'EOF'
# 🎯 <tipo>: <descrição breve>
#
# ✅ O que foi feito:
# - 
# - 
#
# 🧪 Status: [STABLE|EXPERIMENTAL|BROKEN]
# 📦 Afeta: [plugins|layout|ui|state|docs]
# 
# Tipos:
# 🎯 feat:     nova funcionalidade
# 🐛 fix:      correção de bug
# 📚 docs:     documentação
# 🎨 style:    formatação, sem mudança de lógica
# 🔧 refactor: refatoração de código
# ⚡ perf:     melhoria de performance
# 🧪 test:     adição/correção de testes
# 📦 build:    mudanças no build/deploy
EOF

git config commit.template .gitmessage
echo "   ✅ Template de commit configurado"

# --- 9. Criar arquivo de configuração de desenvolvimento ---
echo "🔧 Criando configuração de desenvolvimento..."

cat > .gitattributes << 'EOF'
# Auto detect text files and perform LF normalization
* text=auto

# JavaScript
*.js text eol=lf
*.json text eol=lf

# Web files
*.html text eol=lf
*.css text eol=lf
*.md text eol=lf

# Images
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.svg text eol=lf
EOF

git add .gitattributes .gitmessage
git commit -m "🔧 config: adiciona templates e configurações Git

✅ O que foi feito:
- Template de commit estruturado
- Configuração de line endings
- Normalização de arquivos

🧪 Status: STABLE
📦 Afeta: configuração"

# --- 10. Relatório final ---
echo ""
echo "🎉 SETUP CONCLUÍDO COM SUCESSO!"
echo "================================"
echo ""
echo "📊 Status do Repositório:"
echo "   📂 Arquivos: $(git ls-files | wc -l | tr -d ' ') arquivos rastreados"
echo "   🏷️  Tag: v4.1.0 criada"
echo "   🌿 Branches: $(git branch | wc -l | tr -d ' ') branches criadas"
echo "   👤 Usuário: $(git config user.name)"
echo ""
echo "🔥 Próximos passos:"
echo "   1. Para nova feature: git checkout feature/video-plugin"
echo "   2. Para experimento: git checkout experiment/functional-paradigm"
echo "   3. Para volta ao estável: git checkout main"
echo ""
echo "📋 Comandos úteis:"
echo "   git log --oneline          # histórico resumido"
echo "   git log --graph --all      # árvore visual"
echo "   git tag                    # listar tags"
echo "   git branch -a              # listar branches"
echo ""
echo "🤖 Para desenvolvimento com IA:"
echo "   'Baseado no commit $(git rev-parse --short HEAD), optimize o módulo X'"
echo "   'Compare mudanças entre v4.1.0 e HEAD'"
echo ""
echo "✅ Repositório pronto para desenvolvimento profissional!"
