# 🎨 Guia VSCode - Card Creator

Este guia mostra como usar o VSCode para desenvolver e testar o Card Creator.

## 🚀 Quick Start

### 1. Instalar Extensões Recomendadas

O VSCode vai sugerir automaticamente. Ou instale manualmente:

- **Live Server** (ritwickdey.liveserver) - Para testar a interface web
- **ESLint** (dbaeumer.vscode-eslint) - Linting de código
- **Prettier** (esbenp.prettier-vscode) - Formatação automática

### 2. Testar Interface Web

#### Método 1: Live Server (Recomendado)

1. Abra `index.html`
2. Clique com botão direito → **"Open with Live Server"**
3. Ou use o atalho: `Alt+L Alt+O`
4. Navegador abre automaticamente em `http://localhost:5500`

#### Método 2: Servidor HTTP Manual

1. Abra o Terminal integrado (`Ctrl+\``)
2. Execute:
   ```bash
   python3 -m http.server 8080
   ```
3. Abra: `http://localhost:8080`

Ou use a **Task pré-configurada**:
- `Ctrl+Shift+P` → **"Tasks: Run Task"** → **"Iniciar Servidor HTTP"**

### 3. Testar CLI

#### Via Terminal Integrado

```bash
# Exemplo básico
node bin/card-creator.js examples/input-example.json

# Com opções
node bin/card-creator.js examples/input-example.json -c 5 -r 1.618

# Testes automatizados
bash test-cli.sh
```

#### Via Tasks (Menu)

**Opção 1: Via Command Palette**
1. `Ctrl+Shift+P`
2. Digite: **"Tasks: Run Task"**
3. Escolha:
   - **"Testar CLI - Exemplo"** - Teste básico
   - **"Testar CLI - Alto Contraste"** - Teste com c=5, r=1.618
   - **"Executar Todos os Testes CLI"** - Suite completa

**Opção 2: Via Atalho**
1. `Ctrl+Shift+B` (Build/Test Task)
2. Executa o teste padrão da CLI

#### Via Debug

1. Vá para a aba **"Run and Debug"** (`Ctrl+Shift+D`)
2. Selecione uma configuração:
   - **"Debug CLI"** - Debug com exemplo padrão
   - **"Debug CLI - Custom Args"** - Debug com argumentos personalizados
3. Pressione `F5` para iniciar debug
4. Use breakpoints para inspecionar o código

## 🔍 Debug

### Debug da CLI

1. Abra `bin/card-creator.js` ou qualquer arquivo do motor
2. Clique na margem esquerda para adicionar **breakpoints**
3. `F5` para iniciar debug
4. Use os controles:
   - `F10` - Step Over
   - `F11` - Step Into
   - `Shift+F11` - Step Out
   - `F5` - Continue

### Debug da Web App

1. Certifique-se que Live Server está rodando
2. Abra a aba **"Run and Debug"**
3. Selecione **"Debug Web App"**
4. `F5` para abrir Chrome com debug
5. Breakpoints no VSCode funcionam no navegador!

## 📂 Estrutura de Arquivos

```
card_creator/
├── .vscode/                      ← Configurações do VSCode
│   ├── extensions.json          ← Extensões recomendadas
│   ├── settings.json            ← Configurações do projeto
│   ├── tasks.json               ← Tasks pré-configuradas
│   ├── launch.json              ← Configurações de debug
│   └── README.md                ← Este arquivo
├── bin/
│   └── card-creator.js          ← CLI executável
├── src/
│   ├── measurement/             ← Abstração de medições
│   ├── engine/                  ← Motor de layout
│   ├── layout/                  ← Algoritmos de layout
│   ├── state/                   ← Gerenciamento de estado
│   └── ui/                      ← Controladores de UI
├── examples/                     ← Exemplos de entrada/saída
├── docs/                         ← Documentação
├── test-cli.sh                   ← Script de testes
└── index.html                    ← Interface web
```

## ⌨️ Atalhos Úteis

| Atalho | Ação |
|--------|------|
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+\`` | Toggle Terminal |
| `Ctrl+Shift+B` | Run Build/Test Task |
| `Ctrl+Shift+D` | Run and Debug |
| `F5` | Start Debug |
| `Ctrl+F5` | Run Without Debug |
| `Alt+L Alt+O` | Open with Live Server |
| `Ctrl+Shift+F` | Search in Files |
| `Ctrl+P` | Quick Open File |

## 🧪 Testing Workflow

### Workflow Recomendado

1. **Desenvolvimento na Web**
   - Abra `index.html` com Live Server
   - Edite arquivos em `src/`
   - Live reload automático no navegador
   - Verifique o console do navegador

2. **Teste da CLI**
   - `Ctrl+Shift+B` para rodar teste rápido
   - Ou `bash test-cli.sh` para suite completa
   - Verifique arquivos de saída em `examples/`

3. **Debug Detalhado**
   - Adicione breakpoints
   - `F5` para debug CLI ou Web
   - Inspecione variáveis na barra lateral
   - Use Debug Console para testar expressões

## 📝 Criando Novos Blocos de Teste

### Via Interface Web

1. Abra a interface web (Live Server)
2. Use os controles na esquerda
3. Adicione blocos com o botão "+"
4. Ajuste sliders de contraste/escala
5. Veja resultado em tempo real

### Via CLI com Novo JSON

1. Crie um novo arquivo JSON:

```bash
cat > meu-teste.json << 'EOF'
{
  "blocks": [
    {
      "id": "1",
      "type": "text",
      "order": 1,
      "content": {
        "type": "text",
        "data": { "text": "Meu Card Personalizado" }
      }
    }
  ]
}
EOF
```

2. Execute:

```bash
node bin/card-creator.js meu-teste.json -o resultado.json -c 4 -r 1.5
```

3. Verifique `resultado.json`

## 🎯 Tasks Disponíveis

Execute via `Ctrl+Shift+P` → "Tasks: Run Task":

1. **Testar CLI - Exemplo**
   - Executa CLI com exemplo padrão
   - Output: `examples/output-test.json`

2. **Testar CLI - Alto Contraste**
   - Executa com c=5, r=1.618 (Golden Ratio)
   - Output: `examples/output-high-contrast.json`

3. **Executar Todos os Testes CLI**
   - Roda `test-cli.sh` com 6 testes
   - Valida todos os cenários

4. **Iniciar Servidor HTTP**
   - Inicia servidor Python na porta 8080
   - Acesse: `http://localhost:8080`

## 🐛 Troubleshooting

### Live Server não funciona

```bash
# Instale a extensão
code --install-extension ritwickdey.liveserver
```

### CLI não funciona

```bash
# Verifique permissões
chmod +x bin/card-creator.js

# Teste manualmente
node bin/card-creator.js -h
```

### Imports não funcionam

- Certifique-se de usar módulos ES6 (`.js` nas importações)
- Verifique que todos os caminhos são relativos corretos

## 📚 Recursos Adicionais

- **Documentação CLI**: `docs/CLI.md`
- **Arquitetura**: Veja comentários em `src/engine/cardLayoutEngine.js`
- **Exemplos**: Pasta `examples/`
- **Testes**: `test-cli.sh`

## 💡 Dicas

1. **Live Reload**: Live Server recarrega automaticamente quando você salva arquivos
2. **Multi-Cursor**: `Alt+Click` para adicionar múltiplos cursores
3. **Format on Save**: Já configurado em `.vscode/settings.json`
4. **Terminal Split**: `Ctrl+Shift+5` para dividir terminal
5. **Zen Mode**: `Ctrl+K Z` para modo focado

---

🚀 **Happy Coding!**
