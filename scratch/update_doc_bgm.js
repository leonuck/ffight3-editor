const fs = require('fs');

let doc = fs.readFileSync('Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md', 'utf8');

const oldSec10 = `## 11.10 Persistência Binária de Cenário (Club Capcom · Fase 44) na ROM

1. **Arquitetura do Carregador Gráfico (GFX Loader Script em 65816)**:
   - O SNES carrega o visual de cada fase executando um script em bytecode ASCII a partir do Ponteiro 1 da tabela \`0x34000\`:
     - \`'M'\` (\`0x4D\`): Descompacta dados com algoritmo LZSS proprietário da Capcom para a WRAM.
     - \`'D'\` (\`0x44\`): Aciona o canal de DMA do hardware do SNES para transferir dados da WRAM ou ROM para a VRAM (\`$2118/19\`).
     - \`'C'\` (\`0x43\`): Aciona DMA direto para a memória de paletas CGRAM (\`$2122\`).
     - \`'E'\` (\`0x45\`): Finaliza o carregador e entrega o controle para a engine.
   - Para a Fase 44, o editor compila um novo script GFX de 70 bytes gravado na área livre (\`FREE_RUNS\` no banco \`CE\`) e atualiza o Ponteiro 1 da Fase 44 (\`0x342B3 + 3\`) para este endereço.

2. **Patch de VRAM para Arena Desobstruída (Modo Fight Club)**:
   - No modo Arena Livre, o script executa transferências DMA (\`CMD 44\`) enviando 64 bytes de valor zero diretamente sobre os blocos das mesas nas coordenadas de VRAM \`0x42AC\` (Tela 0) e \`0x46AC\` (Tela 1).
   - O Ponteiro 2 (objetos interativos e quebra de móveis) é redirecionado de \`C3:A314\` para \`C3:A8B5\` (sala limpa sem barrels ou tables), eliminando a caixa de colisão física onde inimigos poderiam ficar travados.

3. **Injeção de Paleta CGRAM Dinâmica**:
   - As paletas personalizadas (Azul VIP, Vermelho Sangue, Dourado ou Clássico) são gravadas em \`FREE_RUNS\` e enviadas via DMA para CGRAM \`0x00C0\` (Paleta 6 da PPU) durante a inicialização da sala.

4. **Trilha Sonora BGM Selecionável**:
   - Gravada no Byte 0 do registro de metadados da Fase 44 em \`C0:0F39\` (offset \`0x0F39\` no arquivo), permitindo que a sala secreta toque o tema do Bar (\`0x12\`), tema de Chefe (\`0x0A\`), tema de Rua (\`0x06\`) ou tema do Dave (\`0x1C\`).`;

const newSec10 = `## 11.10 Persistência Binária de Cenário (Club Capcom · Fase 44) na ROM

1. **Arquitetura do Carregador Gráfico (GFX Loader Script em 65816)**:
   - O SNES carrega o visual de cada fase executando um script em bytecode ASCII a partir do Ponteiro 1 da tabela \`0x34000\`:
     - \`'M'\` (\`0x4D\`): Descompacta dados com algoritmo LZSS proprietário da Capcom para a WRAM.
     - \`'D'\` (\`0x44\`): Aciona o canal de DMA do hardware do SNES para transferir dados da WRAM ou ROM para a VRAM (\`$2118/19\`).
     - \`'C'\` (\`0x43\`): Aciona DMA direto para a memória de paletas CGRAM (\`$2122\`). Recebe 9 bytes de argumentos: \`src (3 bytes)\`, \`dest (2 bytes)\`, \`len (2 bytes)\` e \`flags (2 bytes = 0x0018)\`.
     - \`'E'\` (\`0x45\`): Finaliza o carregador e entrega o controle para a engine.
   - **Correção Crítica da Tela Preta**: O opcode \`0x43\` (\`CMD 'C'\`) requer obrigatoriamente a palavra de flags \`0x18, 0x00\` antes do terminador \`0x45\`. Sem esses dois bytes, a engine consumia o terminador \`0x45\` como parâmetro do DMA e lia o byte seguinte (\`0x00\`), caindo em um laço infinito (\`BRA -2\` / \`80 FE\` em \`C0:E0FA\`) antes de abrir o brilho da tela (\`$2100\`). Com o script padrão de 56 bytes perfeitamente alinhado, a tela abre imediatamente sem congelamento.

2. **Física e Desobstrução de Objetos (Modo Arena / Fight Club)**:
   - O Ponteiro 2 da tabela de fases (\`0x342B3 + 6\`) governa os objetos interativos e colisão de móveis.
   - No modo clássico, aponta para \`C3:A314\` (mesas quebráveis do Club Capcom).
   - No modo Arena Livre, é redirecionado para \`C3:A8B5\` (layout nativo de sala limpa sem tables ou barris), eliminando com 100% de estabilidade qualquer risco de inimigos colidirem com mesas invisíveis.

3. **Injeção de Paleta CGRAM Dinâmica**:
   - As paletas personalizadas (Azul VIP, Vermelho Sangue, Dourado ou Clássico) são gravadas em \`FREE_RUNS\` e enviadas via DMA para CGRAM \`0x00C0\` (Paleta 6 da PPU) durante a inicialização da sala.

4. **Arquitetura Oficial de Música BGM e Gerenciador de Áudio/APU**:
   - **Descoberta do Registrador Real de BGM**: A engine de *Final Fight 3* obtém a trilha sonora de cada fase lendo o **Byte 0 dos metadados apontados pelo Ponteiro 0** (\`C0:1BF7: LDA [$00], Y\`), e **não** da tabela de limites de câmera (\`C0:0D35\`).
   - Para a Fase 44, o editor clona o bloco de metadados do Ponteiro 0 (75 bytes) na área livre (\`FREE_RUNS\`), gravando no Byte 0 a trilha BGM selecionada:
     - \`0x07\`: 🎵 Tema Club Capcom (Original do Bar)
     - \`0x05\`: ⚡ Tema de Chefe (Boss Battle / Dave)
     - \`0x04\`: 🎸 Tema da Rua (Round 1 Street)
     - \`0x06\`: 🎷 Tema da Rua (Round 2 Main Street)
   - **Gerenciador de Sound Banks do SPC700 (\`C0:0120\` ➔ \`C0:F380\`)**: O chip de som SPC700 do SNES armazena diferentes bancos de instrumentos para cada Round (Round 1 = Banco \`0x01\`, Round 2 = Banco \`0x20\`). Ao entrar na Fase 44 a partir da Fase 1, o hook dinâmico em \`C0:F380\` carrega o banco correspondente no APU via \`JSL $EC0000\` durante a tela preta de transição e reseta \`$1F0D\`. Ao sair da sala de volta para a Delegacia ou Dave (Round 1), restaura o Banco \`0x01\`, garantindo fidelidade acústica total e transições impecáveis de áudio sem travamentos.`;

if (!doc.includes(oldSec10)) {
  throw new Error('oldSec10 not found');
}
doc = doc.replace(oldSec10, newSec10);
fs.writeFileSync('Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md', doc, 'utf8');
console.log('✓ Documentação técnica atualizada com sucesso!');

