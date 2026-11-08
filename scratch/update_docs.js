const fs = require('fs');

const docSection = `
### 11.6 Correção e Otimização da Fase 44 e Inserção de Inimigos

Durante a criação da Fase 44 e testes de combate, foram identificadas e solucionadas as seguintes particularidades da engine da Capcom:

1. **Alocação de VRAM Obrigatória (\`b[5] >= 2\`)**:
   - Cada inimigo no registro de 17 bytes necessita de um valor de blocos de VRAM não-nulo em \`b[5]\` (2 para Billy/May, 3 para Dirk/Hunter, 4 para Chefes como Callman/Andore/Dave). Se \`b[5] == 0\`, o despachante de sprites falha ao reservar tiles e o ator não é renderizado.
2. **Posição e Plano do Chão (\`b[13..14]\`)**:
   - As coordenadas em Final Fight 3 utilizam 16 subpixels por pixel (\`pixel * 16\`). O plano do chão jogável está entre **Y: 155px e 215px** (2480 a 3440 subpixels). Valores em Y: 0px colocam o ator fora da tela no céu, resultando em cancelamento imediato pelo motor de física.
3. **Clonagem Transparente de Template**:
   - A criação da Fase 44 passou a clonar diretamente os inimigos legítimos do cenário base escolhido (ex: Fase 7 - Bar Creep Eats com Callman, Fritz, Billy e May). Isso garante compatibilidade total de VRAM, gatilhos de câmera e barreiras sem necessidade de configuração manual do zero.
4. **Inserção Segura de Inimigos (\`+ Inimigo\`)**:
   - A função de adicionar inimigo (\`#addE\`) insere os novos atores **antes do terminador da onda / barreira final (\`FF 01\` / \`FF 02\`)** e com atributos válidos garantidos (\`Gfx = 2\`, \`Y = 184px\`, \`HP = 35\`), evitando que comandos após o encerramento do script sejam ignorados.
5. **Cálculo de Drag & Drop no Tabuleiro Panorâmico**:
   - No modo Panorâmico, a movimentação do token calcula a posição relativa à câmera subtraindo o gatilho da onda (\`curWorldX - trigPx\`), garantindo precisão matemática perfeita ao arrastar inimigos.
6. **Cenários de Fundo Temáticos no Editor**:
   - O editor agora desenha cenários personalizados completos para o interior do Bar Creep Eats (estante de garrafas, letreiros neon, balcão de madeira com banquetas, piso de parquet), Gabinete do Dave, Restaurante Chinês, Prisão e Cais.
`;

let pDoc = fs.readFileSync('Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md', 'utf8');
if (!pDoc.includes('11.6 Correção e Otimização da Fase 44')) {
  pDoc += docSection;
  fs.writeFileSync('Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md', pDoc, 'utf8');
  console.log('Patch doc updated.');
}

const readmeSection = `
### 6.3 Correção de Inimigos e Cenário da Fase 44
- **Clonagem Direta de Template**: Inimigos são clonados da fase base (ex: Bar do Callman) com VRAM, vida e coordenadas 100% funcionais.
- **Inserção Segura (\`+ Inimigo\`)**: Novos inimigos são inseridos dentro da onda ativa (antes da barreira final \`FF 02\`), posicionados no plano do chão (\`Y: 184px\`) e com VRAM mínima (\`Gfx: 2\`).
- **Drag & Drop Panorâmico Preciso**: O arrasto visual no tabuleiro leva em conta o gatilho da câmera (\`Trig\`), mantendo as posições sincronizadas entre tela e tabela.
- **Cenários Interiores Detalhados**: O tabuleiro visual desenha o interior autêntico do Bar (balcão, banquetas, garrafas, neon), Gabinete Executivo, Restaurante Chinês, etc.
`;

let rDoc = fs.readFileSync('README.md', 'utf8');
if (!rDoc.includes('6.3 Correção de Inimigos e Cenário da Fase 44')) {
  rDoc += readmeSection;
  fs.writeFileSync('README.md', rDoc, 'utf8');
  console.log('README updated.');
}

