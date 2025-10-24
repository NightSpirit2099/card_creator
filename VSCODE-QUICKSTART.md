# 🚀 VSCode Quick Start - Card Creator

## 📋 Checklist Rápido

### ✅ Setup Inicial (1 minuto)

1. **Abrir o projeto no VSCode**
   ```bash
   code /home/user/card_creator
   ```

2. **Instalar extensões recomendadas**
   - VSCode vai mostrar notificação automática
   - Ou pressione `Ctrl+Shift+X` e procure "Live Server"

### ✅ Testar Interface Web (30 segundos)

**Método 1: Live Server** ⭐ Recomendado
1. Abra `index.html` no explorer
2. Clique direito → **"Open with Live Server"**
3. Pronto! Navegador abre automaticamente

**Método 2: Servidor Python**
1. Pressione `Ctrl+Shift+P`
2. Digite: **"Tasks: Run Task"**
3. Selecione: **"Iniciar Servidor HTTP"**
4. Abra: `http://localhost:8080`

### ✅ Testar CLI (30 segundos)

**Via Atalho:**
1. Pressione `Ctrl+Shift+B`
2. Veja o resultado no terminal integrado

**Via Menu:**
1. `Ctrl+Shift+P`
2. **"Tasks: Run Task"**
3. Escolha uma das tasks disponíveis

**Via Terminal:**
1. Pressione ``Ctrl+` `` (abre terminal)
2. Execute:
   ```bash
   node bin/card-creator.js examples/input-example.json
   ```

---

## 🎯 3 Formas Rápidas de Testar

### 1. Interface Web + Live Reload
```
1. Abrir index.html
2. Botão direito → "Open with Live Server"
3. Editar arquivos em src/ → Reload automático!
```

### 2. CLI com Task
```
1. Ctrl+Shift+B
2. Ver resultado no terminal
3. Conferir examples/output-test.json
```

### 3. Debug Completo
```
1. F5 (ou Ctrl+Shift+D)
2. Escolher "Debug CLI"
3. Adicionar breakpoints
4. Inspecionar variáveis
```

---

## 🔥 Atalhos Essenciais

| Teclas | Ação |
|--------|------|
| `Ctrl+Shift+P` | **Command Palette** (tudo começa aqui!) |
| ``Ctrl+` `` | **Toggle Terminal** |
| `Ctrl+Shift+B` | **Run Test** (CLI) |
| `F5` | **Start Debug** |
| `Ctrl+P` | **Quick Open** arquivo |
| `Ctrl+Shift+F` | **Search** no projeto |
| `Alt+L Alt+O` | **Live Server** |

---

## 📊 Tasks Disponíveis

Pressione `Ctrl+Shift+P` → Digite "run task":

```
✅ Testar CLI - Exemplo            → Teste rápido
✅ Testar CLI - Alto Contraste     → c=5, r=1.618
✅ Executar Todos os Testes CLI    → Suite completa (6 testes)
✅ Iniciar Servidor HTTP           → Python server porta 8080
```

---

## 🐛 Debug em 3 Passos

### Debug CLI:
1. Abra `bin/card-creator.js`
2. Clique à esquerda do número da linha → breakpoint vermelho
3. Pressione `F5` → Debug inicia!

### Debug Web:
1. Live Server rodando
2. `F5` → "Debug Web App"
3. Breakpoints funcionam no navegador!

---

## 💡 Dicas Rápidas

**Edição Múltipla:**
- `Alt+Click` → múltiplos cursores
- `Ctrl+D` → selecionar próxima ocorrência
- `Ctrl+Shift+L` → selecionar todas ocorrências

**Navegação:**
- `Ctrl+P` → Abrir arquivo rápido
- `Ctrl+G` → Ir para linha
- `F12` → Ir para definição
- `Alt+←` / `Alt+→` → Voltar/Avançar

**Terminal:**
- ``Ctrl+` `` → Toggle terminal
- `Ctrl+Shift+5` → Split terminal
- `Ctrl+C` → Parar processo

---

## 🎨 Interface Web - O que Testar

Quando Live Server abrir:

✅ Página carrega sem erros
✅ Console mostra: "Card Creator v4.1 inicializado"
✅ Você vê 3 blocos de texto pré-carregados
✅ Preview do card aparece à direita
✅ Pode adicionar/remover blocos com botão +/-
✅ Sliders de contraste e escala funcionam
✅ Preview atualiza em tempo real

**Verificar Console do Navegador (F12):**
```
✅ Card Creator v4.1 (Refatorado) inicializado com sucesso
✅ Layout Engine: { type: 'DOMMeasurementProvider', isReady: true }
✅ Plugins disponíveis: ['text', 'image']
```

---

## 💻 CLI - O que Testar

**Teste 1: Help**
```bash
node bin/card-creator.js -h
```
Deve mostrar ajuda completa.

**Teste 2: Exemplo Básico**
```bash
node bin/card-creator.js examples/input-example.json
```
Deve processar e mostrar resultados.

**Teste 3: Suite Completa**
```bash
bash test-cli.sh
```
Deve passar 6/6 testes.

---

## 📁 Arquivos Importantes

```
📂 .vscode/
   ├── README.md              ← Guia detalhado
   ├── tasks.json             ← Tasks pré-configuradas
   ├── launch.json            ← Debug configs
   ├── settings.json          ← Configurações
   └── card-creator.code-snippets  ← Snippets úteis

📂 src/
   ├── measurement/           ← Medições (DOM/Node)
   ├── engine/                ← Motor de layout
   └── ...

📄 index.html                 ← Interface web (abra com Live Server)
📄 bin/card-creator.js        ← CLI
📄 test-cli.sh                ← Testes automatizados
```

---

## 🎬 Workflow Completo

```mermaid
1. Abrir VSCode
   ↓
2. Live Server no index.html
   ↓
3. Editar código em src/
   ↓
4. Ver mudanças instantâneas no navegador
   ↓
5. Testar CLI (Ctrl+Shift+B)
   ↓
6. Verificar output em examples/
   ↓
7. Debug se necessário (F5)
```

---

## 📚 Precisa de Mais Ajuda?

- **Guia Detalhado**: `.vscode/README.md`
- **Documentação CLI**: `docs/CLI.md`
- **Snippets**: Digite `card-input` em arquivo JSON
- **Tasks**: `Ctrl+Shift+P` → "Tasks: Run Task"

---

## 🎉 Pronto para Começar!

```bash
# 1. Abrir projeto
code /home/user/card_creator

# 2. Instalar extensões (notificação automática)

# 3. Testar!
# - Interface: Abrir index.html → Botão direito → "Open with Live Server"
# - CLI: Ctrl+Shift+B

# 4. Happy coding! 🚀
```

---

**💡 Dica:** Pressione `Ctrl+K Ctrl+T` para mudar o tema do VSCode!
