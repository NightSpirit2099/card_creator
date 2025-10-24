#!/bin/bash

# Script de teste do Card Creator CLI
# Testa diferentes cenários e configurações

echo "🧪 Iniciando testes do Card Creator CLI"
echo "========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para testar um comando
test_command() {
    local name=$1
    local cmd=$2

    echo -e "${BLUE}▶ Teste: $name${NC}"
    if eval $cmd > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Passou${NC}"
        return 0
    else
        echo -e "${RED}✗ Falhou${NC}"
        return 1
    fi
}

# Contador de testes
passed=0
total=0

# Teste 1: Help
total=$((total + 1))
echo -e "\n${BLUE}Teste 1/6: Exibir ajuda${NC}"
node bin/card-creator.js -h > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Passou${NC}"
    passed=$((passed + 1))
else
    echo -e "${RED}✗ Falhou${NC}"
fi

# Teste 2: Exemplo padrão
total=$((total + 1))
echo -e "\n${BLUE}Teste 2/6: Exemplo padrão${NC}"
node bin/card-creator.js examples/input-example.json -o /tmp/test1.json
if [ $? -eq 0 ] && [ -f /tmp/test1.json ]; then
    echo -e "${GREEN}✓ Passou - arquivo gerado em /tmp/test1.json${NC}"
    passed=$((passed + 1))
else
    echo -e "${RED}✗ Falhou${NC}"
fi

# Teste 3: Alto contraste
total=$((total + 1))
echo -e "\n${BLUE}Teste 3/6: Alto contraste (c=5)${NC}"
node bin/card-creator.js examples/input-example.json -o /tmp/test2.json -c 5
if [ $? -eq 0 ] && [ -f /tmp/test2.json ]; then
    echo -e "${GREEN}✓ Passou - arquivo gerado em /tmp/test2.json${NC}"
    passed=$((passed + 1))
else
    echo -e "${RED}✗ Falhou${NC}"
fi

# Teste 4: Golden ratio
total=$((total + 1))
echo -e "\n${BLUE}Teste 4/6: Golden ratio (r=1.618)${NC}"
node bin/card-creator.js examples/input-example.json -o /tmp/test3.json -r 1.618
if [ $? -eq 0 ] && [ -f /tmp/test3.json ]; then
    echo -e "${GREEN}✓ Passou - arquivo gerado em /tmp/test3.json${NC}"
    passed=$((passed + 1))
else
    echo -e "${RED}✗ Falhou${NC}"
fi

# Teste 5: Combinação de opções
total=$((total + 1))
echo -e "\n${BLUE}Teste 5/6: Combinação (c=4, r=1.5)${NC}"
node bin/card-creator.js examples/input-example.json -o /tmp/test4.json -c 4 -r 1.5
if [ $? -eq 0 ] && [ -f /tmp/test4.json ]; then
    echo -e "${GREEN}✓ Passou - arquivo gerado em /tmp/test4.json${NC}"
    passed=$((passed + 1))
else
    echo -e "${RED}✗ Falhou${NC}"
fi

# Teste 6: Arquivo customizado
total=$((total + 1))
echo -e "\n${BLUE}Teste 6/6: Arquivo customizado${NC}"
cat > /tmp/custom-test.json << 'EOF'
{
  "blocks": [
    {
      "id": "1",
      "type": "text",
      "order": 1,
      "content": {
        "type": "text",
        "data": {
          "text": "Motor Desacoplado Funcionando!"
        }
      }
    }
  ]
}
EOF
node bin/card-creator.js /tmp/custom-test.json -o /tmp/test5.json
if [ $? -eq 0 ] && [ -f /tmp/test5.json ]; then
    echo -e "${GREEN}✓ Passou - arquivo gerado em /tmp/test5.json${NC}"
    passed=$((passed + 1))
else
    echo -e "${RED}✗ Falhou${NC}"
fi

# Resultado final
echo ""
echo "========================================="
echo -e "${BLUE}Resultado: $passed/$total testes passaram${NC}"
if [ $passed -eq $total ]; then
    echo -e "${GREEN}🎉 Todos os testes passaram!${NC}"
    exit 0
else
    echo -e "${RED}❌ Alguns testes falharam${NC}"
    exit 1
fi
