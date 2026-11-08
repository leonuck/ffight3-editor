const fs = require('fs');

// 1. Update README.md
const readmePath = 'README.md';
let readme = fs.readFileSync(readmePath, 'utf8');
const rLines = readme.split(/\r?\n/);

const tableLines = [
  "## 1. Mapeamento Oficial das 43 Fases do Final Fight 3 (Capcom Debug Map)",
  "",
  "De acordo com o mapa e catálogo original do menu de depuração da Capcom (**ALL AREA MAP / ALL AREA NAME**), o motor do jogo divide as fases em 8 grandes áreas operacionais:",
  "",
  "| ID | Nome Oficial Capcom | Nome Traduzido / Descrição do Cenário | Chefe / Particularidade |",
  "|:---:|---|---|---|",
  "| **01** | 01 POLICE STATION | ROUND 1 · Rua da Delegacia de Metro City | Início da jornada |",
  "| **02** | 02 PRISON | ROUND 1 · Corredor das Celas da Prisão | Interior da delegacia |",
  "| **03** | 03 GAS STATION | ROUND 1 · Posto de Combustíveis | **Chefe Dave** (Policial corrupto) |",
  "| **04** | 04 MAIN STREET | ROUND 2 · Rua Principal do Bar | Área externa |",
  "| **05** | 05 BACK STREETT | ROUND 2 · Beco dos Armazéns (Bifurcação) | Tem a porta de madeira |",
  "| **06** | 06 BACK ALLEY | ROUND 2 · Beco / Telhado (Rota Normal A) | **Chefe Callman A** |",
  "| **07** | 07 CLUB CAPCOM | ROUND 2 · Interior do Bar (Rota Secreta B) | **Chefe Callman B** (Porta de madeira) |",
  "| **08** | 08 BUS STOP STREET | ROUND 3 · Ponto de Ônibus na Rua | **Convergência de 6/7 e Grande Bifurcação** |",
  "| **09** | 09 IN THE BUS | ROUND 3 · Combate Dentro do Ônibus (Rota Esquerda) | Combate nos corredores e bancos |",
  "| **10** | 10 BUS CLASH | ROUND 4A · Batida do Ônibus no Cais | Transição do ônibus batendo no cais |",
  "| **11** | 11 SCRAP HEAP | ROUND 3 · Ferro-Velho / Depósito de Sucata | Pilhas de entulho e tambores |",
  "| **12** | 12 ON THE BUS | ROUND 3 · Teto do Ônibus em Movimento | **Chefe Caine** (Kain) |",
  "| **13** | 13 IRON BRIDGE | ROUND 4A · Ponte de Ferro do Navio (Rota Baixo) | Caminho a pé até o porto |",
  "| **14** | 14 PIER | ROUND 4A · Cais de Embarque | Atracadouro do cargueiro |",
  "| **15** | 15 DECK (ECK) | ROUND 4A · Convés Superior do Navio | Área aberta no navio |",
  "| **16** | 16 STORE HOUSE | ROUND 4A · Porão de Carga do Navio | Galpão interno com caixas |",
  "| **17** | 17 FRONT DECK | ROUND 4A · Proa do Navio Cargueiro | **Chefe Drake** (Dreik) |",
  "| **18** | 18 BONAS-A | BÔNUS 1 · Destruir o Trator / Bulldozer | Fase Bônus A |",
  "| **19** | 19 CHINATOWN | ROUND 4B · Bairro Chinês (Vindo de Caine 12) | Ruas comerciais com letreiros orientais |",
  "| **20** | 20 BILLBOARD | ROUND 4B · Painéis / Outdoors da Cidade | Letreiros luminosos e telhados |",
  "| **21** | 21 RESTAURANT | ROUND 4B · Restaurante Chinês | Mesas e salão interno |",
  "| **22** | 22 KITCHEN | ROUND 4B · Cozinha do Restaurante | **Chefe Wong** (Weng) |",
  "| **23** | 23 UNDERGROUND | ROUND 5 · Passagem Subterrânea (Vindo de Bônus 18)| Galerias sob o porto |",
  "| **24** | 24 CHINATOWN | ROUND 5 · Rota Alternativa - Bairro Chinês | Subsolo / conexão urbana |",
  "| **25** | 25 BILLBOARD | ROUND 5 · Rota Alternativa - Painéis | Telhados de acesso à fábrica |",
  "| **26** | 26 RESTAURANT | ROUND 5 · Rota Alternativa - Restaurante | Interior de apoio |",
  "| **27** | 27 KITCHEN | ROUND 5 · Rota Alternativa - Cozinha | **Subchefe Wong** |",
  "| **28** | 28 ENTER THE FACTRY | ROUND 5 · Entrada Principal da Fábrica | **Ponto de Convergência das Rotas 18 e 22** |",
  "| **29** | 29 ALARM | ROUND 5 · Setor dos Alarmes Industriais | Sala de controle com 3 opções de rota |",
  "| **30** | 30 RESEARCH ROOM-1 | ROUND 5 · Laboratório Secreto de Pesquisa 1 | Sala lateral opcional |",
  "| **31** | 31 RESEARCH ROOM-2 | ROUND 5 · Laboratório Secreto de Pesquisa 2 | Acesso ao atalho do computador |",
  "| **32** | 32 COMPUTER ROOM | ROUND 5 · Sala Central de Computadores | **SUPER ATALHO DIRETO PARA A FASE 36!** |",
  "| **33** | 33 HALL-WAY | ROUND 5 · Corredor Industrial Principal | Acesso ao guindaste |",
  "| **34** | 34 CRANE | ROUND 5 · Pátio do Guindaste Industrial | **Chefe Stray** |",
  "| **35** | 35 BONAS-B | BÔNUS 2 · Destruir os Computadores e Barris | Fase Bônus B |",
  "| **36** | 36 STREET OF BUILDINGS | ROUND 6 · Rua dos Edifícios (Quartel Skull Cross)| Entrada do complexo final |",
  "| **37** | 37 CORRIDOR | ROUND 6 · Corredor de Segurança da Torre | Corredor interno com 2 salas secretas |",
  "| **38** | 38 OTHER ROOM-1 | ROUND 6 · Sala Secreta 1 da Torre | Sala de segurança esquerda |",
  "| **39** | 39 OTHER ROOM-2 | ROUND 6 · Sala Secreta 2 da Torre | Sala de segurança direita |",
  "| **40** | 40 ELEVATOR | ROUND 6 · Elevador Panorâmico da Torre | Subida rumo à cobertura |",
  "| **41** | 41 PRESIDENT ROOM | ROUND 6 · Gabinete Presidencial da Skull Cross | Escritório luxuoso |",
  "| **42** | 42 ROOFTOP | ROUND 6 · Terraço da Torre (Confronto Final) | **Chefe Final Black** |",
  "| **43** | TR TRANING ROOM | MODO DE TREINO · Sala de Treinamento Livre | 56 barris e tambores (Leva à Fase 01) |",
  "",
  "---",
  "",
  "### 1.1 Diagrama Oficial dos Atalhos e Rotas do Jogo",
  "",
  "O mapa do jogo revela a árvore completa de caminhos e atalhos programados pela Capcom:",
  "",
  "```mermaid",
  "flowchart TD",
  "    TR[\"TR (Training Room)\"] --> 01[\"01 Police Station\"]",
  "    01 --> 02[\"02 Prison\"] --> 03[\"03 Gas Station (Dave)\"]",
  "    ",
  "    03 --> 04[\"04 Main Street\"] --> 05[\"05 Back Streett\"]",
  "    ",
  "    subgraph Round2[\"ROUND 2: Bifurcação do Bar\"]",
  "        05 -->|Rota Normal| 06[\"06 Back Alley (Callman A)\"]",
  "        05 -->|Porta de Madeira| 07[\"07 Club Capcom (Callman B)\"]",
  "    end",
  "    ",
  "    06 --> 08[\"08 Bus Stop Street (Ponto de Ônibus)\"]",
  "    07 --> 08",
  "    ",
  "    subgraph EscolhaRotas[\"ROUND 3 & 4: Grande Escolha de Caminhos\"]",
  "        08 -->|Rota do Ônibus (Esquerda)| 09[\"09 In The Bus\"]",
  "        09 --> 11[\"11 Scrap Heap (Ferro Velho)\"] --> 12[\"12 On The Bus (Caine)\"]",
  "        12 --> 19[\"19 Chinatown\"] --> 20[\"20 Billboard\"] --> 21[\"21 Restaurant\"] --> 22[\"22 Kitchen (Wong)\"]",
  "        ",
  "        08 -->|Rota da Ponte e Navio (Baixo)| 13[\"13 Iron Bridge\"]",
  "        13 --> 14[\"14 Pier\"] --> 10[\"10 Bus Clash\"] --> 15[\"15 Deck\"] --> 16[\"16 Store House\"] --> 17[\"17 Front Deck (Drake)\"] --> 18[\"18 Bonas-A (Trator)\"]",
  "        18 --> 23[\"23 Underground\"] --> 24[\"24 Chinatown Alt\"] --> 25[\"25 Billboard Alt\"] --> 26[\"26 Restaurant Alt\"] --> 27[\"27 Kitchen (Wong Alt)\"]",
  "    end",
  "    ",
  "    22 --> 28[\"28 Enter The Factry\"]",
  "    27 --> 28",
  "    ",
  "    subgraph Fabrica[\"ROUND 5: Atalhos da Fábrica\"]",
  "        28 --> 29[\"29 Alarm\"]",
  "        29 -->|Caminho Normal| 33[\"33 Hall-way\"] --> 34[\"34 Crane (Stray)\"] --> 35[\"35 Bonas-B (Barris)\"] --> 36[\"36 Street Of Buildings\"]",
  "        29 -->|Sala Secreta 1| 30[\"30 Research Room-1\"] --> 33",
  "        29 -->|Atalho do Computador| 31[\"31 Research Room-2\"] --> 32[\"32 Computer Room\"]",
  "        32 -.->|⚡ PULA O CHEFE STRAY!| 36",
  "    end",
  "    ",
  "    subgraph Final[\"ROUND 6: Quartel Skull Cross\"]",
  "        36 --> 37[\"37 Corridor\"]",
  "        37 -->|Sala Opcional 1| 38[\"38 Other Room-1\"] --> 40[\"40 Elevator\"]",
  "        37 -->|Sala Opcional 2| 39[\"39 Other Room-2\"] --> 40",
  "        37 -->|Caminho Direto| 40",
  "        40 --> 41[\"41 President Room\"] --> 42[\"42 Rooftop (Chefe Black)\"]",
  "    end",
  "```"
];

// In README: replace lines 6 to 54
const rBefore = rLines.slice(0, 6);
const rAfter = rLines.slice(55);
const newReadmeLines = rBefore.concat(tableLines, rAfter);
fs.writeFileSync(readmePath, newReadmeLines.join('\n'), 'utf8');
console.log('✓ Successfully updated README.md with official Capcom map and diagram!');

// 2. Update Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md
const docPath = 'Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md';
let doc = fs.readFileSync(docPath, 'utf8');
const dLines = doc.split(/\r?\n/);

let dStartLine = -1;
let dEndLine = -1;
for (let i = 0; i < dLines.length; i++) {
  if (dLines[i].includes('11.3 Tabela de IDs de Fases Oficiais')) dStartLine = i;
  if (dStartLine !== -1 && dLines[i].includes('### 11.4 Integração no Editor Visual')) {
    dEndLine = i;
    break;
  }
}

if (dStartLine !== -1 && dEndLine !== -1) {
  const dBefore = dLines.slice(0, dStartLine);
  const dAfter = dLines.slice(dEndLine);
  
  const docTableLines = [
    "### 11.3 Tabela Oficial de IDs e Rotas das Fases (Capcom Debug Map)",
    "",
    "De acordo com a tabela original e mapa de depuração da Capcom (**ALL AREA MAP / ALL AREA NAME**), os 43 estágios oficiais e seus chefes são mapeados como:",
    "",
    "| ID | Nome Oficial Capcom | Nome Traduzido / Descrição | Chefe / Particularidade |",
    "|:---:|---|---|---|",
    "| **01** | 01 POLICE STATION | ROUND 1 · Rua da Delegacia de Metro City | Início da jornada |",
    "| **02** | 02 PRISON | ROUND 1 · Corredor das Celas da Prisão | Interior da delegacia |",
    "| **03** | 03 GAS STATION | ROUND 1 · Posto de Combustíveis | **Chefe Dave** |",
    "| **04** | 04 MAIN STREET | ROUND 2 · Rua Principal do Bar | Área externa |",
    "| **05** | 05 BACK STREETT | ROUND 2 · Beco dos Armazéns (Bifurcação) | Porta de madeira |",
    "| **06** | 06 BACK ALLEY | ROUND 2 · Beco / Telhado (Rota Normal A) | **Chefe Callman A** |",
    "| **07** | 07 CLUB CAPCOM | ROUND 2 · Interior do Bar (Rota Secreta B) | **Chefe Callman B** |",
    "| **08** | 08 BUS STOP STREET | ROUND 3 · Ponto de Ônibus na Rua | **Convergência de 6/7 e Grande Escolha de Rota** |",
    "| **09** | 09 IN THE BUS | ROUND 3 · Combate Dentro do Ônibus (Rota Esquerda) | Combate nos corredores e bancos |",
    "| **10** | 10 BUS CLASH | ROUND 4A · Batida do Ônibus no Cais | Transição da batida no cais |",
    "| **11** | 11 SCRAP HEAP | ROUND 3 · Ferro-Velho / Depósito de Sucata | Pilhas de entulho e tambores |",
    "| **12** | 12 ON THE BUS | ROUND 3 · Teto do Ônibus em Movimento | **Chefe Caine** (Kain) |",
    "| **13** | 13 IRON BRIDGE | ROUND 4A · Ponte de Ferro do Navio (Rota Baixo) | Caminho a pé até o porto |",
    "| **14** | 14 PIER | ROUND 4A · Cais de Embarque | Atracadouro do cargueiro |",
    "| **15** | 15 DECK (ECK) | ROUND 4A · Convés Superior do Navio | Área aberta no navio |",
    "| **16** | 16 STORE HOUSE | ROUND 4A · Porão de Carga do Navio | Galpão interno com caixas |",
    "| **17** | 17 FRONT DECK | ROUND 4A · Proa do Navio Cargueiro | **Chefe Drake** |",
    "| **18** | 18 BONAS-A | BÔNUS 1 · Destruir o Trator / Bulldozer | Fase Bônus A |",
    "| **19** | 19 CHINATOWN | ROUND 4B · Bairro Chinês (Vindo de Caine 12) | Bairro Chinês comercial |",
    "| **20** | 20 BILLBOARD | ROUND 4B · Painéis / Outdoors da Cidade | Letreiros luminosos e telhados |",
    "| **21** | 21 RESTAURANT | ROUND 4B · Restaurante Chinês | Mesas e salão interno |",
    "| **22** | 22 KITCHEN | ROUND 4B · Cozinha do Restaurante | **Chefe Wong** |",
    "| **23** | 23 UNDERGROUND | ROUND 5 · Passagem Subterrânea (Vindo de Bônus 18)| Galerias sob o porto |",
    "| **24** | 24 CHINATOWN | ROUND 5 · Rota Alternativa - Bairro Chinês | Subsolo / conexão urbana |",
    "| **25** | 25 BILLBOARD | ROUND 5 · Rota Alternativa - Painéis | Telhados de acesso à fábrica |",
    "| **26** | 26 RESTAURANT | ROUND 5 · Rota Alternativa - Restaurante | Interior de apoio |",
    "| **27** | 27 KITCHEN | ROUND 5 · Rota Alternativa - Cozinha | **Subchefe Wong** |",
    "| **28** | 28 ENTER THE FACTRY | ROUND 5 · Entrada Principal da Fábrica | **Ponto de Convergência das Rotas 18 e 22** |",
    "| **29** | 29 ALARM | ROUND 5 · Setor dos Alarmes Industriais | Sala de controle com 3 opções de rota |",
    "| **30** | 30 RESEARCH ROOM-1 | ROUND 5 · Laboratório Secreto de Pesquisa 1 | Sala lateral opcional |",
    "| **31** | 31 RESEARCH ROOM-2 | ROUND 5 · Laboratório Secreto de Pesquisa 2 | Acesso ao atalho do computador |",
    "| **32** | 32 COMPUTER ROOM | ROUND 5 · Sala Central de Computadores | **SUPER ATALHO DIRETO PARA A FASE 36 (Pula Stray e Bônus)!** |",
    "| **33** | 33 HALL-WAY | ROUND 5 · Corredor Industrial Principal | Acesso ao guindaste |",
    "| **34** | 34 CRANE | ROUND 5 · Pátio do Guindaste Industrial | **Chefe Stray** |",
    "| **35** | 35 BONAS-B | BÔNUS 2 · Destruir os Computadores e Barris | Fase Bônus B |",
    "| **36** | 36 STREET OF BUILDINGS | ROUND 6 · Rua dos Edifícios (Quartel Skull Cross)| Entrada do complexo final |",
    "| **37** | 37 CORRIDOR | ROUND 6 · Corredor de Segurança da Torre | Corredor interno com 2 salas secretas |",
    "| **38** | 38 OTHER ROOM-1 | ROUND 6 · Sala Secreta 1 da Torre | Sala de segurança esquerda |",
    "| **39** | 39 OTHER ROOM-2 | ROUND 6 · Sala Secreta 2 da Torre | Sala de segurança direita |",
    "| **40** | 40 ELEVATOR | ROUND 6 · Elevador Panorâmico da Torre | Subida rumo à cobertura |",
    "| **41** | 41 PRESIDENT ROOM | ROUND 6 · Gabinete Presidencial da Skull Cross | Escritório luxuoso |",
    "| **42** | 42 ROOFTOP | ROUND 6 · Terraço da Torre (Confronto Final) | **Chefe Final Black** |",
    "| **43** | TR TRANING ROOM | MODO DE TREINO · Sala de Treinamento Livre | 56 barris e tambores (Leva à Fase 01) |",
    "",
    "---",
    ""
  ];

  const newDocLines = dBefore.concat(docTableLines, dAfter);
  fs.writeFileSync(docPath, newDocLines.join('\n'), 'utf8');
  console.log('✓ Successfully updated Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md!');
} else {
  console.error("Could not find line boundaries in documentation md:", { dStartLine, dEndLine });
}
