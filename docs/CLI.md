# Card Creator CLI

## Desacoplamento do Motor de Layout

O motor de layout foi desacoplado da interface do usuário, permitindo seu uso tanto no navegador quanto via linha de comando.

## Arquitetura

### Camadas de Abstração

1. **IMeasurementProvider** - Interface para medições de texto e imagens
2. **DOMMeasurementProvider** - Implementação usando DOM (navegador)
3. **NodeMeasurementProvider** - Implementação usando node-canvas (CLI)
4. **CardLayoutEngine** - Facade independente do motor de layout

### Estrutura

```
src/
├── measurement/
│   ├── iMeasurementProvider.js       # Interface base
│   ├── domMeasurementProvider.js     # Implementação DOM
│   └── nodeMeasurementProvider.js    # Implementação Node.js
├── engine/
│   └── cardLayoutEngine.js           # Facade do motor
├── layout/
│   ├── adaptiveLayoutComposer.js     # Orquestrador
│   ├── layoutComposer.js             # Algoritmo tipográfico
│   └── layoutOptimizer.js            # Otimização de zoom
└── state/
    └── enhancedCardState.js          # Estado (usa injeção de dependência)
```

## Instalação

```bash
npm install
```

Isso instalará o pacote `canvas` necessário para as medições em Node.js.

## Uso da CLI

### Sintaxe Básica

```bash
card-creator <input.json> [opções]
```

### Opções

- `-o, --output <file>` - Arquivo de saída (padrão: layout.json)
- `-c, --contrast <1-5>` - Nível de contraste global (padrão: 3)
- `-r, --ratio <1.1-2.0>` - Razão da escala tipográfica (padrão: 1.25)
- `-h, --help` - Mostra ajuda

### Exemplos

#### Exemplo Básico

```bash
npm run cli examples/input-example.json
```

#### Com Opções Personalizadas

```bash
card-creator examples/input-example.json -o output.json -c 4 -r 1.5
```

#### Usando Script NPM

```bash
npm run example
```

## Formato de Entrada

O arquivo de entrada deve ser um JSON com a seguinte estrutura:

```json
{
  "blocks": [
    {
      "id": "1",
      "type": "text",
      "order": 1,
      "content": {
        "type": "text",
        "data": {
          "text": "Título do Card"
        }
      }
    },
    {
      "id": "2",
      "type": "text",
      "order": 2,
      "content": {
        "type": "text",
        "data": {
          "text": "Subtítulo ou descrição"
        }
      }
    }
  ]
}
```

### Campos

- `id`: Identificador único do bloco
- `type`: Tipo do bloco (`text` ou `image`)
- `order`: Ordem de exibição
- `content`: Conteúdo do bloco
  - `type`: Tipo do conteúdo
  - `data`: Dados específicos do tipo
    - Para texto: `{ text: "..." }`
    - Para imagem: `{ src: "url", alt: "..." }`

## Formato de Saída

A CLI gera um arquivo JSON com o layout calculado:

```json
{
  "config": {
    "globalContrast": 3,
    "typographicRatio": 1.25
  },
  "layout": {
    "baseFontSize": 10,
    "lineHeight": 1.2,
    "ratio": 1.25,
    "zoom": 0.845,
    "strategy": "text-optimized",
    "analysis": {
      "hasImages": false,
      "hasOnlyText": true,
      "textDensity": 1,
      "totalBlocks": 3
    },
    "blocks": [...]
  }
}
```

## Uso Programático

Você também pode usar o motor de layout diretamente no seu código Node.js:

```javascript
import { NodeMeasurementProvider } from './src/measurement/nodeMeasurementProvider.js';
import { CardLayoutEngine } from './src/engine/cardLayoutEngine.js';

// Criar o provider de medição
const measurementProvider = new NodeMeasurementProvider();

// Criar o motor de layout
const engine = new CardLayoutEngine(measurementProvider);

// Calcular layout
const blocks = [
  {
    id: '1',
    type: 'text',
    order: 1,
    content: {
      type: 'text',
      data: { text: 'Meu título' }
    }
  }
];

const config = {
  globalContrast: 3,
  typographicRatio: 1.25
};

const result = await engine.calculateLayout(blocks, config);

if (result.isSuccess) {
  console.log('Layout:', result.value);
} else {
  console.error('Erro:', result.error);
}
```

## Integração com Navegador

No navegador, use o `DOMMeasurementProvider`:

```javascript
import { DOMMeasurementProvider } from './src/measurement/domMeasurementProvider.js';
import { CardLayoutEngine } from './src/engine/cardLayoutEngine.js';

const measurementProvider = new DOMMeasurementProvider();
const engine = new CardLayoutEngine(measurementProvider);

// Usar o engine...
```

## Testes

Para testar a CLI com o exemplo incluído:

```bash
npm run example
```

Isso processará `examples/input-example.json` e gerará `examples/output-example.json`.

## Benefícios do Desacoplamento

1. **Reutilização** - O motor de layout pode ser usado em qualquer ambiente
2. **Testabilidade** - Fácil criar mocks do measurement provider
3. **Flexibilidade** - Suporta diferentes estratégias de medição
4. **Separação de Responsabilidades** - UI, lógica de layout e medições são independentes
5. **Uso CLI** - Permite automação e integração com pipelines

## Dependências

- **canvas** - Para medições de texto em Node.js
- Node.js >= 14.0.0
