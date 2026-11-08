const fs = require('fs');

const docSection = `
### 11.7 Auto-Sanitização de Chefes para Inimigos Comuns e Clonador Modal de Fases

1. **Por que o inimigo comum ficava preso no lugar ao substituir um chefe?**:
   - **Posicionamento Absoluto dos Chefes (\`Pos = 1\`)**: Na engine da Capcom, todos os chefes (Dave, Callman, Caine, Wong, Drake, Stray, Black) possuem \`Pos = 1\` com coordenadas especiais de entrada (\`X\` além da barreira da câmera e \`Y\` entre 128px e 144px no teto, balcão ou mezanino).
   - **Cutscenes de Entrada vs. IA Normal**: Os chefes possuem rotinas de cutscene exclusivas na ROM que desativam a colisão temporariamente durante a animação de entrada. Inimigos comuns (Billy, May, Dirk, Andore, etc.) não possuem cutscene e iniciam direto na rotina de combate. Como o chão jogável de Final Fight 3 exige \`Y >= 155px\`, qualquer inimigo comum em \`Y: 144px\` colide com a parede superior, tendo suas velocidades zeradas (\`VX=0, VY=0\`) e ficando congelado no lugar.
   - **Solução no Editor**: O editor agora possui um auto-sanitizador no dropdown de Tipo: ao trocar um chefe por um capanga comum, ele automaticamente move o ator para o plano do chão (\`Y = 184px\`), converte para posição relativa à câmera (\`Pos = 0, X = 275px\`) e redimensiona a VRAM para 2 ou 3 blocos.

2. **Modal Interativo de Seleção de Cenário (Todas as 43 Fases)**:
   - A criação da Fase 44 foi aprimorada com uma janela modal elegante contendo um menu \`<select>\` com todas as 43 fases originais catalogadas por Round.
   - Permite re-clonar qualquer cenário a qualquer momento pelo botão \`🔄 Clonar Outra Fase para Fase 44\` na barra lateral.
`;

let pDoc = fs.readFileSync('Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md', 'utf8');
if (!pDoc.includes('11.7 Auto-Sanitização de Chefes')) {
  pDoc += docSection;
  fs.writeFileSync('Final Fight 3 (SNES) - Documentação do patch de 4 inimigos.md', pDoc, 'utf8');
  console.log('Patch doc updated.');
}

const readmeSection = `
### 6.4 Seletor Modal de Todas as 43 Fases e Correção de Chefes
- **Modal com Select de 43 Fases**: Substitui a digitação manual por um menu suspenso interativo com todas as fases do jogo (Rounds 1 a 6, Bônus e Sala de Treino).
- **Auto-Alinhamento no Chão (Fim dos Inimigos Presos)**: Ao substituir um chefe por um capanga comum, o editor detecta se o ator está dentro da parede (\`Y < 155px\`) ou com posição absoluta e corrige automaticamente para o centro do chão (\`Y: 184px\`, \`Pos: 0\`, \`X: 275px\`), permitindo que qualquer capanga lute livremente como chefe da sala.
`;

let rDoc = fs.readFileSync('README.md', 'utf8');
if (!rDoc.includes('6.4 Seletor Modal de Todas as 43 Fases')) {
  rDoc += readmeSection;
  fs.writeFileSync('README.md', rDoc, 'utf8');
  console.log('README updated.');
}

