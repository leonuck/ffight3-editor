const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

const oldStageNamesStart = `// Configuração padrão da Rota da Porta Secreta
const STAGE_NAMES = [
  { id: 1, name: "ROUND 1 · Fase 1 (Rua da Delegacia)" },`;

const oldStageNamesEnd = `  { id: 43, name: "MODO DE TREINO (Training Room)" },
  { id: 44, name: "ROUND 7 · SALA SECRETA NOVA (Fase 44)" }
];`;

const newStageNames = `// Configuração Oficial da Capcom (Debug All Area Map)
const STAGE_NAMES = [
  { id: 1, name: "ROUND 1 · 01 Police Station (Delegacia)" },
  { id: 2, name: "ROUND 1 · 02 Prison (Celas da Prisão)" },
  { id: 3, name: "ROUND 1 · 03 Gas Station <Chefe Dave>" },
  { id: 4, name: "ROUND 2 · 04 Main Street (Rua do Bar)" },
  { id: 5, name: "ROUND 2 · 05 Back Streett (Armazém / Beco)" },
  { id: 6, name: "ROUND 2 · 06 Back Alley <Chefe Callman A - Telhados>" },
  { id: 7, name: "ROUND 2 · 07 Club Capcom <Chefe Callman B - Bar Secreto>" },
  { id: 8, name: "ROUND 3 · 08 Bus Stop Street (Ponto de Ônibus na Rua)" },
  { id: 9, name: "ROUND 3 · 09 In The Bus (Dentro do Ônibus)" },
  { id: 10, name: "ROUND 4A · 10 Bus Clash (Batida do Ônibus / Navio)" },
  { id: 11, name: "ROUND 3 · 11 Scrap Heap (Depósito de Sucata / Ferro Velho)" },
  { id: 12, name: "ROUND 3 · 12 On The Bus <Chefe Caine / Kain>" },
  { id: 13, name: "ROUND 4A · 13 Iron Bridge (Ponte de Ferro do Navio)" },
  { id: 14, name: "ROUND 4A · 14 Pier (Cais do Porto)" },
  { id: 15, name: "ROUND 4A · 15 Deck (Convés do Navio)" },
  { id: 16, name: "ROUND 4A · 16 Store House (Porão de Carga do Navio)" },
  { id: 17, name: "ROUND 4A · 17 Front Deck <Chefe Drake / Dreik>" },
  { id: 18, name: "BÔNUS 1 · 18 Bonas-A (Destruir o Trator / Bulldozer)" },
  { id: 19, name: "ROUND 4B · 19 Chinatown (Bairro Chinês)" },
  { id: 20, name: "ROUND 4B · 20 Billboard (Painéis / Outdoors)" },
  { id: 21, name: "ROUND 4B · 21 Restaurant (Restaurante Chinês)" },
  { id: 22, name: "ROUND 4B · 22 Kitchen <Chefe Wong / Weng>" },
  { id: 23, name: "ROUND 5 · 23 Underground Passage (Passagem Subterrânea)" },
  { id: 24, name: "ROUND 5 · 24 Chinatown (Rota Alternativa)" },
  { id: 25, name: "ROUND 5 · 25 Billboard (Rota Alternativa)" },
  { id: 26, name: "ROUND 5 · 26 Restaurant (Rota Alternativa)" },
  { id: 27, name: "ROUND 5 · 27 Kitchen <Subchefe Wong / Weng>" },
  { id: 28, name: "ROUND 5 · 28 Enter The Factry (Entrada da Fábrica)" },
  { id: 29, name: "ROUND 5 · 29 Alarm (Setor de Alarme)" },
  { id: 30, name: "ROUND 5 · 30 Research Room-1 (Laboratório Secreto 1)" },
  { id: 31, name: "ROUND 5 · 31 Research Room-2 (Laboratório Secreto 2)" },
  { id: 32, name: "ROUND 5 · 32 Computer Room (Sala de Computadores - Atalho Final!)" },
  { id: 33, name: "ROUND 5 · 33 Hall-way (Corredor Industrial)" },
  { id: 34, name: "ROUND 5 · 34 Crane <Chefe Stray>" },
  { id: 35, name: "BÔNUS 2 · 35 Bonas-B (Destruir Barris / Sala Bônus)" },
  { id: 36, name: "ROUND 6 · 36 Street Of Buildings (Rua dos Edifícios / Skull Cross)" },
  { id: 37, name: "ROUND 6 · 37 Corridor (Corredor do Quartel General)" },
  { id: 38, name: "ROUND 6 · 38 Other Room-1 (Sala Secreta 1)" },
  { id: 39, name: "ROUND 6 · 39 Other Room-2 (Sala Secreta 2)" },
  { id: 40, name: "ROUND 6 · 40 Elevator (Elevador da Torre)" },
  { id: 41, name: "ROUND 6 · 41 President Room (Gabinete Presidencial)" },
  { id: 42, name: "ROUND 6 · 42 Rooftop <Chefe Final Black>" },
  { id: 43, name: "MODO DE TREINO · TR Training Room (Sala de Treino)" },
  { id: 44, name: "ROUND 7 · SALA SECRETA NOVA (Fase 44)" }
];`;

const sIdx = html.indexOf(oldStageNamesStart);
const eIdx = html.indexOf(oldStageNamesEnd);

if (sIdx === -1 || eIdx === -1) {
  console.error("Could not find STAGE_NAMES block");
  process.exit(1);
}

html = html.substring(0, sIdx) + newStageNames + html.substring(eIdx + oldStageNamesEnd.length);

fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('✓ Successfully updated STAGE_NAMES in FF3_Script_Editor.html!');

