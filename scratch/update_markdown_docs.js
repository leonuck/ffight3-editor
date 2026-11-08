const fs = require('fs');

// 1. Update Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md
const docPath = 'Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md';
let doc = fs.readFileSync(docPath, 'utf8');

const docSection = `
### 11.8 Cenários Reais do Jogo (Screenshots Panorâmicos de Alta Fidelidade)

1. **Substituição do Fundo Procedural por Screenshots Autênticos**:
   - As fases do **Round 1** agora utilizam os gráficos originais extraídos diretamente do jogo em screenshots panorâmicos de pixel-art:
     - **Fase 1 (Rua da Delegacia)**: \`img/round_1_fase_1.png\` (1024 × 190 px)
     - **Fase 2 (Prisão / Celas)**: \`img/round_1_fase_2.png\` (1023 × 190 px)
     - **Fase 3 (Gabinete do Dave)**: \`img/round_1_fase_3_chefe.png\` (768 × 190 px)
   - Também suportado automaticamente na **Fase 44** caso ela tenha sido clonada a partir de qualquer uma das fases do Round 1.

2. **Alinhamento e Coordenadas SNES com Precisão Subpixel**:
   - A resolução vertical nativa do SNES é de **224 linhas**:
     - **Linhas 0 a 34 (34px)**: Barra de Status / HUD do SNES (placar, cronômetro, barras de vida dos jogadores e do chefe). O editor renderiza uma barra escura com demarcação técnica.
     - **Linhas 34 a 224 (190px)**: Campo de visão do jogo (*playfield*). As imagens fornecidas possuem exatamente 190px de altura, encaixando-se com perfeição milimétrica ao serem desenhadas a partir de \`Y = 34\`.
   - O plano do chão jogável (\`Y: 155..215 px\`) alinha-se perfeitamente com a calçada, o asfalto, as grades das celas e o tapete do escritório do Dave.

3. **Modos Panorâmico e Tela Única com Janela de Câmera**:
   - **Modo Panorâmico**: O tabuleiro adapta dinamicamente sua largura ao comprimento exato do cenário (1024px para Fases 1 e 2, 768px para Fase 3), eliminando vazios e bordas pretas excedentes.
   - **Modo Tela Única SNES (256px)**: O canvas projeta uma janela de recorte de 256px correspondente ao gatilho de câmera (\`Trig\`) da onda selecionada, com as laterais de entrada fora da tela (70px à esquerda e à direita) suavemente escurecidas.

4. **Portas e Demarcações Interativas sobre o Gráfico Real**:
   - As caixas de gatilho de portas secretas (ex: a porta do bar na Fase 1 em \`X: 550..640\`) agora sobrepõem-se diretamente sobre o desenho da porta no cenário real, permitindo aos modders arrastar e calibrar áreas de transição com retorno visual imediato.
`;

if (!doc.includes('11.8 Cenários Reais do Jogo')) {
  doc += docSection;
  fs.writeFileSync(docPath, doc, 'utf8');
  console.log('✓ Updated Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md');
}

// 2. Update README.md
const readmePath = 'README.md';
let readme = fs.readFileSync(readmePath, 'utf8');

const readmeSection = `
## 7. Cenários Reais do Jogo em Pixel-Art (Screenshots Panorâmicos)

O editor agora suporta a substituição do fundo vetorial por capturas panorâmicas autênticas do jogo diretamente da pasta \`img/\`:

### 7.1 Fases com Screenshots Integrados (Round 1)
- **Fase 1 (Rua da Delegacia)**: \`img/round_1_fase_1.png\` (1024 × 190 px - 4 telas SNES de 256px)
- **Fase 2 (Prisão / Celas)**: \`img/round_1_fase_2.png\` (1023 × 190 px - 4 telas SNES de 256px)
- **Fase 3 (Gabinete do Dave)**: \`img/round_1_fase_3_chefe.png\` (768 × 190 px - 3 telas SNES de 256px)
- **Fase 44 (Sala Secreta)**: Herda automaticamente o screenshot do cenário template se for clonada das Fases 1, 2 ou 3.

### 7.2 Alinhamento Preciso no Sistema de Coordenadas do SNES
- **Y: 0..34 px**: Área reservada para o HUD / Barra de Status do SNES.
- **Y: 34..224 px (190px)**: Área de jogo desenhada com o screenshot real.
- **Y: 155..215 px**: Plano de caminhada dos personagens (asfalto, calçada e piso das salas). As linhas do chão foram refinadas para serem sutis, preservando a nitidez do pixel-art.
- **Portas Secretas Visuais**: A moldura amarela da porta na Fase 1 encaixa-se exatamente sobre a porta física do bar no cenário.
- **Suporte Fácil para Novas Fases**: Conforme novas imagens forem adicionadas à pasta \`img/\`, basta registrá-las no dicionário \`STAGE_BG_IMAGES\` para que qualquer outro Round seja exibido com seu gráfico real.
`;

if (!readme.includes('## 7. Cenários Reais do Jogo em Pixel-Art')) {
  readme += readmeSection;
  fs.writeFileSync(readmePath, readme, 'utf8');
  console.log('✓ Updated README.md');
}

