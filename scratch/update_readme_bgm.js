const fs = require('fs');

let readme = fs.readFileSync('README.md', 'utf8');

const target = `### 6.5 Persistência Real do Cenário da Sala Secreta (Club Capcom) na ROM
O editor salva as alterações visuais e mecânicas da Sala Secreta 44 **diretamente nos bytes binários da ROM SNES**:
1. **Layout do Salão (Arena Livre vs. Bar Clássico)**:
   - **Modo Arena Livre**: No script de carregamento visual da Fase 44, o editor insere comandos DMA (\`CMD 44\`) que transferem 64 bytes de valor zero diretamente sobre as posições das mesas redondas na VRAM do SNES (\`0x42AC\` e \`0x46AC\`). Além disso, o Ponteiro 2 (objetos interativos) é redirecionado para \`C3:A8B5\`, removendo totalmente a colisão das mesas. Com isso, os 4 inimigos lutam em um salão amplo e desobstruído sem ficarem presos no meio do cenário!
   - **Modo Bar Clássico**: Mantém as mesas de madeira quebráveis e o layout original da Fase 7.
2. **Atmosfera & Iluminação (Paleta CGRAM na ROM)**:
   - Permite escolher entre 4 paletas autênticas do SNES: *Club Capcom Clássico (Verde & Roxo)*, *Metro VIP Lounge (Azul Elétrico & Ciano)*, *Underground Blood Club (Carmesim & Vermelho)* e *Golden Palace (Dourado & Âmbar)*.
   - O editor grava a paleta de 32 bytes em \`FREE_RUNS\` (banco \`CE\`) e programa o script GFX para transferi-la via DMA (\`CMD 43\`) direto para a CGRAM \`0x00C0\` no boot da fase.
3. **Música de Fundo (BGM Gravada na ROM)**:
   - Permite selecionar a trilha da sala (*Club Capcom*, *Boss Battle*, *Round 1 Street*, *Dave's Office*, *Round 2 Main Street*).
   - Gravada diretamente no Byte 0 de metadados da Fase 44 (\`C0:0F39\`).
4. **Script GFX Customizado em 65816**:
   - Um script dedicado de 70 bytes é montado e gravado na área livre da ROM, com o Ponteiro 1 da tabela \`0x342B3\` apontando para o seu endereço no banco \`CE\`.`;

const replacement = `### 6.5 Persistência Real do Cenário da Sala Secreta (Club Capcom) na ROM
O editor salva as alterações visuais e mecânicas da Sala Secreta 44 **diretamente nos bytes binários da ROM SNES**:
1. **Layout do Salão (Arena Livre vs. Bar Clássico)**:
   - **Modo Arena Livre**: O Ponteiro 2 (objetos interativos e colisão física) é apontado para \`C3:A8B5\` (layout nativo de sala limpa sem tables ou barris), desobstruindo totalmente o salão para os 4 lutadores sem conflito de colisão.
   - **Modo Bar Clássico**: Aponta para \`C3:A314\`, mantendo as mesas redondas de madeira quebráveis e a iluminação original da Fase 7.
2. **Atmosfera & Iluminação (Paleta CGRAM na ROM)**:
   - Permite escolher entre 4 paletas autênticas do SNES: *Club Capcom Clássico (Verde & Roxo)*, *Metro VIP Lounge (Azul Elétrico & Ciano)*, *Underground Blood Club (Carmesim & Vermelho)* e *Golden Palace (Dourado & Âmbar)*.
   - O editor grava a paleta de 32 bytes em \`FREE_RUNS\` (banco \`CE\`) e programa o script GFX para transferi-la via DMA (\`CMD 43\`) direto para a CGRAM \`0x00C0\` na inicialização da sala.
3. **Música de Fundo (BGM) & Gerenciador Dinâmico de Som (APU / SPC700)**:
   - Permite escolher a trilha musical da sala (*Club Capcom 0x07*, *Boss Battle 0x05*, *Round 1 Street 0x04*, *Round 2 Main Street 0x06*).
   - Gravada no Byte 0 do bloco de metadados do **Ponteiro 0** da Fase 44 (onde a rotina oficial \`C0:1BF7\` do motor lê a trilha).
   - **Gerenciador de Sound Banks (\`C0:0120\` ➔ \`C0:F380\`)**: O chip de som SPC700 carrega os instrumentos de cada Round separadamente (Round 1 = Banco \`0x01\`, Round 2 = Banco \`0x20\`). Ao entrar na sala secreta a partir da Fase 1, o hook dinâmico em \`C0:F380\` carrega o banco correspondente no APU via \`JSL $EC0000\` durante a tela preta de transição e reseta \`$1F0D\`. Ao sair da sala de volta para a Delegacia ou Dave (Round 1), restaura o Banco \`0x01\`, garantindo áudio impecável sem travar nem silenciar.
4. **Script GFX Customizado em 65816 (Prevenção de Tela Preta)**:
   - Montado com 56 bytes e gravado na área livre da ROM com o Ponteiro 1 da tabela \`0x342B3\` apontando para o seu endereço no banco \`CE\`.
   - Inclui a palavra de flags \`0x18, 0x00\` no opcode \`CMD 43\`, finalizando estritamente com \`0x45\` ('E'), prevenindo travamentos e garantindo que o motor do SNES faça o fade-in de brilho (\`$2100\`) normalmente ao entrar na sala.`;

if (!readme.includes(target)) {
  throw new Error('target not found in README.md');
}
readme = readme.replace(target, replacement);
fs.writeFileSync('README.md', readme, 'utf8');
console.log('✓ README.md updated successfully!');

