<<<<<<< HEAD
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
=======
# card_creator
criador de cards automatizado
>>>>>>> b105450f70126c80982669550aff63bdfa59c071
