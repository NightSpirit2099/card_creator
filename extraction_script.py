#!/usr/bin/env python3
"""
Script de Extração Precisa para Card Creator v4.1
Usa as marcações cirúrgicas para extrair módulos ES6 corretamente.
"""

import os
import re
import shutil
from pathlib import Path

class ModuleExtractor:
    def __init__(self, source_file='card-creator-com-marcacoes.html'):
        self.source_file = source_file
        self.project_root = Path.cwd()
        self.src_dir = self.project_root / 'src'
        self.styles_dir = self.project_root / 'styles'
        
        # Mapa de módulos com suas dependências
        self.modules = {
            # Utils (sem dependências externas)
            'src/utils/result.js': {
                'dependencies': [],
                'exports': ['Result']
            },
            'src/utils/customErrors.js': {
                'dependencies': [],
                'exports': ['CardCreatorError', 'LayoutError', 'ValidationError']
            },
            'src/utils/simpleObservable.js': {
                'dependencies': [],
                'exports': ['SimpleObservable']
            },
            'src/utils/debouncer.js': {
                'dependencies': [],
                'exports': ['Debouncer']
            },
            'src/utils/constants.js': {
                'dependencies': [],
                'exports': ['SCALE_OPTIONS']
            },
            
            # Plugins (dependem de utils)
            'src/plugins/blockPlugin.js': {
                'dependencies': ['../utils/result.js'],
                'exports': ['BlockPlugin']
            },
            'src/plugins/pluginRegistry.js': {
                'dependencies': ['./blockPlugin.js', '../utils/result.js'],
                'exports': ['BlockPluginRegistry']
            },
            'src/plugins/textBlockPlugin.js': {
                'dependencies': ['./blockPlugin.js', '../utils/result.js', '../utils/customErrors.js'],
                'exports': ['TextBlockPlugin']
            },
            'src/plugins/imageBlockPlugin.js': {
                'dependencies': ['./blockPlugin.js', '../utils/result.js', '../utils/customErrors.js'],
                'exports': ['ImageBlockPlugin']
            },
            
            # Analysis
            'src/analysis/contentAnalyzer.js': {
                'dependencies': [],
                'exports': ['ContentAnalyzer']
            },
            
            # Layout (dependem de analysis, utils)
            'src/layout/layoutComposer.js': {
                'dependencies': ['../utils/result.js', '../utils/customErrors.js'],
                'exports': ['LayoutComposer']
            },
            'src/layout/layoutOptimizer.js': {
                'dependencies': ['../utils/result.js', '../utils/customErrors.js'],
                'exports': ['LayoutOptimizer']
            },
            'src/layout/adaptiveLayoutComposer.js': {
                'dependencies': [
                    '../analysis/contentAnalyzer.js',
                    './layoutComposer.js',
                    './layoutOptimizer.js',
                    '../plugins/pluginRegistry.js',
                    '../utils/result.js',
                    '../utils/customErrors.js'
                ],
                'exports': ['LayoutStrategy', 'TextOptimizedStrategy', 'MixedContentStrategy', 'BalancedStrategy', 'AdaptiveLayoutComposer']
            },
            
            # Renderer
            'src/renderer/enhancedLayoutRenderer.js': {
                'dependencies': [
                    '../plugins/textBlockPlugin.js',
                    '../plugins/imageBlockPlugin.js',
                    '../plugins/pluginRegistry.js',
                    '../utils/result.js',
                    '../utils/customErrors.js'
                ],
                'exports': ['EnhancedLayoutRenderer']
            },
            
            # State
            'src/state/enhancedCardState.js': {
                'dependencies': [
                    '../utils/simpleObservable.js',
                    '../utils/debouncer.js',
                    '../plugins/textBlockPlugin.js',
                    '../plugins/imageBlockPlugin.js',
                    '../plugins/pluginRegistry.js',
                    '../layout/adaptiveLayoutComposer.js',
                    '../utils/result.js',
                    '../utils/customErrors.js'
                ],
                'exports': ['EnhancedCardState']
            },
            
            # UI
            'src/ui/enhancedUIController.js': {
                'dependencies': [
                    '../state/enhancedCardState.js',
                    '../renderer/enhancedLayoutRenderer.js',
                    '../utils/debouncer.js',
                    '../utils/constants.js'
                ],
                'exports': ['EnhancedUIController']
            },
            
            # App
            'src/app.js': {
                'dependencies': ['./ui/enhancedUIController.js'],
                'exports': []
            }
        }

    def setup_directories(self):
        """Cria a estrutura de diretórios"""
        print("📁 Criando estrutura de diretórios...")
        
        directories = [
            'src/utils',
            'src/plugins', 
            'src/analysis',
            'src/layout',
            'src/renderer',
            'src/state',
            'src/ui',
            'styles'
        ]
        
        for dir_path in directories:
            (self.project_root / dir_path).mkdir(parents=True, exist_ok=True)
            print(f"   ✓ {dir_path}")

    def backup_original(self):
        """Cria backup do arquivo marcado"""
        if Path(self.source_file).exists():
            backup_name = f"{self.source_file}.backup"
            shutil.copy2(self.source_file, backup_name)
            print(f"🔒 Backup criado: {backup_name}")

    def read_source_file(self):
        """Lê o arquivo fonte com as marcações"""
        try:
            with open(self.source_file, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"❌ Erro: Arquivo '{self.source_file}' não encontrado!")
            print("   Certifique-se de que o arquivo com marcações está no diretório atual.")
            return None

    def extract_css(self, content):
        """Extrai CSS para styles/main.css"""
        print("🎨 Extraindo CSS...")
        
        css_pattern = r'<style>(.*?)</style>'
        css_match = re.search(css_pattern, content, re.DOTALL)
        
        if css_match:
            css_content = css_match.group(1).strip()
            css_file = self.styles_dir / 'main.css'
            
            with open(css_file, 'w', encoding='utf-8') as f:
                f.write(css_content)
            
            print(f"   ✓ styles/main.css criado ({len(css_content)} chars)")
            return True
        
        print("   ❌ CSS não encontrado")
        return False

    def extract_module(self, content, module_path):
        """Extrai um módulo específico usando as marcações"""
        print(f"⚙️  Extraindo {module_path}...")
        
        # Padrão para encontrar o bloco marcado
        start_marker = f"===== CORTE: {module_path} - INÍCIO ====="
        end_marker = f"===== CORTE: {module_path} - FIM ====="
        
        start_idx = content.find(start_marker)
        end_idx = content.find(end_marker)
        
        if start_idx == -1 or end_idx == -1:
            print(f"   ❌ Marcações não encontradas para {module_path}")
            return False
        
        # Extrai o conteúdo entre as marcações
        start_content = start_idx + len(start_marker)
        extracted_content = content[start_content:end_idx].strip()
        
        if not extracted_content:
            print(f"   ❌ Conteúdo vazio para {module_path}")
            return False
        
        # Remove indentação excessiva
        lines = extracted_content.split('\n')
        if lines:
            # Encontra a menor indentação não-vazia
            min_indent = float('inf')
            for line in lines:
                if line.strip():
                    indent = len(line) - len(line.lstrip())
                    min_indent = min(min_indent, indent)
            
            # Remove a indentação comum
            if min_indent != float('inf'):
                lines = [line[min_indent:] if len(line) > min_indent else line for line in lines]
        
        cleaned_content = '\n'.join(lines)
        
        # Gera imports e exports
        module_info = self.modules.get(module_path, {})
        final_content = self.generate_module_content(cleaned_content, module_info)
        
        # Salva o arquivo
        file_path = self.project_root / module_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
        
        lines_count = len(final_content.split('\n'))
        print(f"   ✓ {module_path} criado ({lines_count} linhas)")
        return True

    def generate_module_content(self, extracted_content, module_info):
        """Gera o conteúdo final do módulo com imports e exports"""
        lines = []
        
        # Adiciona imports
        dependencies = module_info.get('dependencies', [])
        if dependencies:
            for dep in dependencies:
                # Determina o que importar baseado no caminho
                import_name = self.get_import_name_from_path(dep)
                lines.append(f"import {{ {import_name} }} from '{dep}';")
            lines.append('')  # Linha em branco após imports
        
        # Adiciona o conteúdo extraído
        lines.append(extracted_content)
        
        # Adiciona exports se necessário
        exports = module_info.get('exports', [])
        if exports:
            lines.append('')  # Linha em branco antes dos exports
            for export in exports:
                # Se a classe já não tem export, adiciona
                if f'export class {export}' not in extracted_content:
                    # Substitui 'class Nome' por 'export class Nome'
                    content_with_exports = '\n'.join(lines[:-1])  # Remove linha vazia
                    content_with_exports = re.sub(
                        rf'\bclass ({export})\b',
                        r'export class \1',
                        content_with_exports
                    )
                    lines = content_with_exports.split('\n')
                    lines.append('')  # Linha em branco no final
                    break
        
        return '\n'.join(lines)

    def get_import_name_from_path(self, dep_path):
        """Determina o que importar baseado no caminho da dependência"""
        import_map = {
            '../utils/result.js': 'Result',
            '../utils/customErrors.js': 'CardCreatorError, LayoutError, ValidationError',
            '../utils/simpleObservable.js': 'SimpleObservable',
            '../utils/debouncer.js': 'Debouncer',
            '../utils/constants.js': 'SCALE_OPTIONS',
            './blockPlugin.js': 'BlockPlugin',
            '../plugins/blockPlugin.js': 'BlockPlugin',
            './pluginRegistry.js': 'BlockPluginRegistry',
            '../plugins/pluginRegistry.js': 'BlockPluginRegistry',
            './textBlockPlugin.js': 'TextBlockPlugin',
            '../plugins/textBlockPlugin.js': 'TextBlockPlugin',
            './imageBlockPlugin.js': 'ImageBlockPlugin',
            '../plugins/imageBlockPlugin.js': 'ImageBlockPlugin',
            '../analysis/contentAnalyzer.js': 'ContentAnalyzer',
            './layoutComposer.js': 'LayoutComposer',
            '../layout/layoutComposer.js': 'LayoutComposer',
            './layoutOptimizer.js': 'LayoutOptimizer',
            '../layout/layoutOptimizer.js': 'LayoutOptimizer',
            './adaptiveLayoutComposer.js': 'LayoutStrategy, TextOptimizedStrategy, MixedContentStrategy, BalancedStrategy, AdaptiveLayoutComposer',
            '../layout/adaptiveLayoutComposer.js': 'AdaptiveLayoutComposer',
            '../renderer/enhancedLayoutRenderer.js': 'EnhancedLayoutRenderer',
            '../state/enhancedCardState.js': 'EnhancedCardState',
            './ui/enhancedUIController.js': 'EnhancedUIController'
        }
        
        return import_map.get(dep_path, 'UnknownImport')

    def create_index_html(self):
        """Cria o novo index.html modular"""
        print("📄 Criando index.html...")
        
        html_content = '''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Card Creator v4.1 - Arquitetura Refatorada</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <div class="app-container">
        <div id="controls-panel" class="controls-panel">
            <h1>Card Creator <span class="version-badge">v4.1 - Refatorado</span><span class="fix-badge">SOLID</span></h1>
            
            <div class="architecture-info">
                <div>
                    <span class="architecture-badge">Plugin System</span>
                    <span class="architecture-badge">Adaptive Engine</span>
                    <span class="architecture-badge">SOLID Principles</span>
                    <span class="architecture-badge">Modular Design</span>
                </div>
                <div style="margin-top: 0.5rem; color: #475569;">
                    Sistema extensível com código modularizado seguindo as melhores práticas de design.
                </div>
            </div>
            
            <div class="system-status">
                <div id="statusIndicator" class="status-indicator"></div>
                <span id="statusText">Sistema Operacional</span>
            </div>
            
            <div class="global-control">
                <h3>Instrumentos de Design</h3>
                <div class="control-group">
                    <label for="scale-slider">Estilo da Escala <span id="scale-label" class="slider-label"></span></label>
                    <div class="slider-control">
                        <span>Suave</span>
                        <input type="range" id="scale-slider" min="1" max="4" step="1" value="1">
                        <span>Dinâmica</span>
                    </div>
                </div>
                <div class="control-group">
                    <label for="contrast-slider">Contraste Global <span id="contrast-label" class="slider-label"></span></label>
                    <div class="slider-control">
                        <span>Pianissimo</span>
                        <input type="range" id="contrast-slider" min="1" max="5" step="1" value="3">
                        <span>Fortissimo</span>
                    </div>
                </div>
            </div>

            <div class="global-control">
                <h3>Adicionar Bloco</h3>
                <div class="plugin-selector" id="pluginSelector">
                    </div>
                <button id="addBlockBtn" class="btn-primary">Adicionar Bloco Selecionado</button>
            </div>
            
            <div id="errorContainer"></div>
            <div id="blocksListContainer"></div>
            
            <div class="debug-panel">
                <h4>Debug Info & Architecture</h4>
                <div id="debugInfo" class="debug-info"></div>
            </div>
        </div>

        <div class="preview-panel">
            <h2>Pré-visualização</h2>
            <div id="cardPreview" class="card">
                <div id="cardContent" class="card-content"></div>
            </div>
        </div>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js"></script>
    <script type="module" src="src/app.js"></script>
</body>
</html>'''
        
        with open(self.project_root / 'index.html', 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print("   ✓ index.html criado")

    def create_readme(self):
        """Cria README.md"""
        print("📚 Criando README.md...")
        
        readme_content = '''# Card Creator v4.1 - Arquitetura Refatorada

Este projeto é uma versão refatorada do Card Creator, com foco em uma arquitetura de software modular, sustentável e escalável, aplicando os princípios de design SOLID, KISS (Keep It Simple, Stupid) e DRY (Don't Repeat Yourself).

## Princípios de Design Aplicados

O código foi reestruturado para seguir as melhores práticas da engenharia de software:

* **Princípio da Responsabilidade Única (SRP)**: Cada classe agora tem uma única responsabilidade.
* **Princípio Aberto/Fechado (OCP)**: O sistema de plugins permite extensão sem modificação.
* **Princípio da Substituição de Liskov (LSP)**: Hierarquia de plugins bem definida.
* **Princípio da Segregação de Interfaces (ISP)**: Classes focadas e especializadas.
* **Princípio da Inversão de Dependência (DIP)**: Comunicação fracamente acoplada.

## Estrutura do Projeto

```
src/
├── analysis/       # Análise de conteúdo
├── layout/         # Composição de layout
├── plugins/        # Sistema de plugins extensível
├── renderer/       # Renderização
├── state/          # Gerenciamento de estado
├── ui/            # Interface do usuário
├── utils/         # Utilitários reutilizáveis
└── app.js         # Ponto de entrada

styles/
└── main.css       # Estilos da aplicação

index.html         # HTML principal
```

## Como Executar

Como a aplicação utiliza Módulos ES6, você precisa de um servidor web local:

### Opção 1: Live Server (VS Code)
1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clique com o botão direito em `index.html` → "Open with Live Server"

### Opção 2: Python
```bash
python3 -m http.server 8000
# Acesse http://localhost:8000
```

### Opção 3: Node.js
```bash
npx serve .
```

## Desenvolvimento

O sistema é altamente modular e extensível. Para adicionar novos tipos de bloco:

1. Crie um novo plugin em `src/plugins/`
2. Registre o plugin no sistema
3. O resto funciona automaticamente!

## Arquitetura

- **Motor Funcional**: Lógica de layout e análise
- **Interface Reativa**: UI com observadores
- **Plugins Extensíveis**: Sistema aberto para novos tipos
- **Estado Centralizado**: Gerenciamento unificado
'''
        
        with open(self.project_root / 'README.md', 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        print("   ✓ README.md criado")

    def run_extraction(self):
        """Executa todo o processo de extração"""
        print("🚀 Iniciando extração modular do Card Creator v4.1")
        print("=" * 60)
        
        # Lê o arquivo fonte
        content = self.read_source_file()
        if not content:
            return False
        
        # Setup inicial
        self.backup_original()
        self.setup_directories()
        
        # Extrai CSS
        self.extract_css(content)
        
        # Extrai módulos na ordem correta (dependências primeiro)
        extraction_order = [
            # Utils primeiro (sem dependências)
            'src/utils/result.js',
            'src/utils/customErrors.js',
            'src/utils/simpleObservable.js',
            'src/utils/debouncer.js', 
            'src/utils/constants.js',
            
            # Plugins (dependem de utils)
            'src/plugins/blockPlugin.js',
            'src/plugins/pluginRegistry.js',
            'src/plugins/textBlockPlugin.js',
            'src/plugins/imageBlockPlugin.js',
            
            # Analysis
            'src/analysis/contentAnalyzer.js',
            
            # Layout (dependem de analysis e utils)
            'src/layout/layoutComposer.js',
            'src/layout/layoutOptimizer.js',
            'src/layout/adaptiveLayoutComposer.js',
            
            # Renderer (depende de plugins)
            'src/renderer/enhancedLayoutRenderer.js',
            
            # State (depende de quase tudo)
            'src/state/enhancedCardState.js',
            
            # UI (depende do state)
            'src/ui/enhancedUIController.js',
            
            # App (entry point)
            'src/app.js'
        ]
        
        extracted_count = 0
        for module_path in extraction_order:
            if self.extract_module(content, module_path):
                extracted_count += 1
        
        # Cria arquivos auxiliares
        self.create_index_html()
        self.create_readme()
        
        print("=" * 60)
        print(f"✅ Extração concluída!")
        print(f"📦 {extracted_count} módulos extraídos com sucesso")
        print(f"📁 Estrutura modular criada")
        print()
        print("🧪 Para testar:")
        print("   1. Execute um servidor local (Live Server, Python, etc.)")
        print("   2. Abra index.html no navegador")
        print("   3. Verifique se os blocos aparecem corretamente")
        
        return True

def main():
    """Função principal"""
    extractor = ModuleExtractor()
    success = extractor.run_extraction()
    
    if success:
        print("\n🎉 Refatoração concluída com sucesso!")
        print("   Sua aplicação agora está modularizada e pronta para desenvolvimento com IA!")
    else:
        print("\n❌ Erro durante a extração.")
        print("   Verifique os arquivos e tente novamente.")

if __name__ == "__main__":
    main()
