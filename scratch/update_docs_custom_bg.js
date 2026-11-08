const fs = require('fs');

// 1. Update README.md
const readmePath = 'README.md';
let readme = fs.readFileSync(readmePath, 'utf8');

const readmeSection8 = `
## 8. Customização Modular de Cenário da Sala Secreta (Fase 44)

O editor agora conta com um painel dedicado de **Customização de Cenário em Tempo Real** para a Fase 44, permitindo recombinar os blocos e elementos arquitetônicos da fase clonada sem corromper a paleta ou a VRAM:

### 8.1 Reutilização Inteligente da Paleta e Texturas
- Ao clonar um cenário (ex: Bar Creep Eats ou Gabinete do Dave), o motor do jogo carrega automaticamente na memória todas as texturas de VRAM e as 8 sub-paletas de 16 cores (CGRAM).
- Em vez de desenhar gráficos do zero (o que quebraria as paletas de cores do SNES), o editor permite **manipular os assets e blocos originais da própria sala** como peças modulares.

### 8.2 Elementos e Mobílias Customizáveis (Template Bar)
- **Balcão de Atendimento**: Posição horizontal (X: 40 a 750 px) e Comprimento/Largura (160 a 700 px) com apoio de latão e acabamento em mogno.
- **Banquetas com Assento Acolchoado**: Espaçamento dinâmico (Denso: 60px, Normal: 75px, Espaçado: 110px) alinhadas automaticamente à frente do balcão.
- **Letreiros Neon Luminosos**:
  - Texto principal totalmente editável (ex: *★ CREEP EATS ★*, *★ METRO VIP CLUB ★*, *★ FIGHT CLUB ★*).
  - Posição horizontal X ajustável.
  - Seletor de cores de neon (Rosa Neon, Ciano Elétrico, Âmbar Dourado, Verde Esmeralda, Roxo Violeta).
  - Letreiro secundário independente (ex: *COLD BEER*, *PIZZA & BEER*, *NO WEAPONS*).
- **Acessórios de Parede e Piso**:
  - Alvo de dardos (Dartboard) com posição X ajustável ou botão para ocultar.
  - Prateleiras de bebidas: modo contínuo (parede inteira) ou concentrado apenas atrás do balcão.
  - Estilo do piso: Assoalho de Madeira Nobre (Parquet), Cerâmica Xadrez ou Concreto Industrial Escuro.

### 8.3 Presets Prontos em Um Clique
- **🍺 Bar Clássico**: Layout original do Bar Creep Eats.
- **🍸 Lounge Central**: Balcão centralizado (300 a 740 px), neons ciano e piso de cerâmica xadrez.
- **🥊 Fight Club Clandestino**: Balcão curto no canto esquerdo (80 px), grande área livre para combate, neon dourado e concreto escuro.
- **💼 Gabinete Executivo**: Skyline noturno de Metro City, mesa presidencial com abajur de banqueiro e carpete personalizável.
`;

if (!readme.includes('## 8. Customização Modular de Cenário')) {
  readme += readmeSection8;
  fs.writeFileSync(readmePath, readme, 'utf8');
  console.log('✓ Appended Section 8 to README.md');
}

// 2. Update Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md
const docPath = 'Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md';
let doc = fs.readFileSync(docPath, 'utf8');

const docSection11_9 = [
  "",
  "### 11.9 Customizador de Cenários Modulares e Manipulação de Assets (Fase 44)",
  "",
  "1. **Arquitetura de Recomposição de Blocos (Metatiles)**:",
  "   - Em consoles de 16-bit como o SNES, o cenário é formado por uma matriz de blocos (metatiles de 16×16 ou 32×32) sobreposta a uma grade de tiles 8×8 com paletas de 16 cores indexadas no CGRAM.",
  "   - Criar gráficos inéditos sem ferramentas de compressão quebraria as restrições da PPU. A abordagem adotada no editor utiliza **a sala clonada como repositório de assets gráficos**, permitindo reorganizar a posição de balcões, paredes, neons e prateleiras com segurança absoluta.",
  "",
  "2. **Física e Preservação do Plano de Caminhada (Y: 155..215 px)**:",
  "   - Em *Final Fight 3*, o plano do chão onde a colisão dos personagens e inimigos é calculada fica rigidamente situado entre Y: 155px e 215px.",
  "   - Elementos de mobília e obstáculos estruturais (como balcão, mesa executiva e letreiros) são mantidos estritamente acima de Y = 150px (plano de fundo da parede), garantindo que a área jogável permaneça 100% desobstruída para o combate fluido de 4 lutadores simultâneos.",
  "",
  "3. **Atualização em Tempo Real (60 FPS)**:",
  "   - Os controles deslizantes (sliders de posição e comprimento do balcão, neons e decorações) operam via eventos nativos `oninput`, redesenhando o canvas instantaneamente sem recarregar o DOM da página.",
  ""
].join('\n');

if (!doc.includes('### 11.9 Customizador de Cenários Modulares')) {
  doc += docSection11_9;
  fs.writeFileSync(docPath, doc, 'utf8');
  console.log('✓ Appended Section 11.9 to Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md');
}
