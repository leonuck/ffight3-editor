const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

// 1. Update renderSide bottom container to add Reclone button
const pSideBtn = html.indexOf('<button id="btnCreateStage44"');
const pSideEnd = html.indexOf('</div>`;', pSideBtn);

if (pSideBtn !== -1 && pSideEnd !== -1) {
  const pSideBoxStart = html.lastIndexOf('<div style="padding:10px;', pSideBtn);
  const newSideBtns = `<div style="padding:10px;border-top:1px solid var(--line);background:var(--panel-sub);position:sticky;bottom:0;display:flex;flex-direction:column;gap:6px;">
      <button id="btnCreateStage44" style="width:100%;padding:8px 10px;background:linear-gradient(135deg, #10b981, #059669);border:none;color:#fff;font-weight:700;font-size:11.5px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 2px 8px rgba(16,185,129,0.3)">
        \${hasStage44 ? '✨ Abrir Fase 44 (Sala Secreta)' : '✨ + Criar Nova Sala Secreta (Fase 44)'}
      </button>
      \${hasStage44 ? \`
        <button id="btnRecloneStage44" class="btn-reclone">
          🔄 Clonar Outro Cenário para Fase 44
        </button>
      \` : ''}
    </div>\`;`;
  html = html.substring(0, pSideBoxStart) + newSideBtns + html.substring(pSideEnd + 8);
  console.log('1. renderSide button container updated with Reclone button.');
}

// 2. Update bS44 and add bReclone click handler
const pBS44 = html.indexOf("const bS44 = $('#btnCreateStage44');");
const pBS44End = html.indexOf("}\n  }\n}", pBS44);

if (pBS44 !== -1 && pBS44End !== -1) {
  const newBS44 = `const bS44 = $('#btnCreateStage44');
    if(bS44){
      bS44.onclick = () => {
        const idx = ST.stages.findIndex(s => s.id === 44);
        if(idx >= 0){
          CUR = ST.stages[idx].row;
          SELECTED_IDX = null;
          ACTIVE_WAVE = 'all';
          render();
        } else {
          openCreateStageModal(false);
        }
      };
    }
    const bReclone = $('#btnRecloneStage44');
    if(bReclone){
      bReclone.onclick = () => {
        openCreateStageModal(true);
      };
    }`;
  html = html.substring(0, pBS44) + newBS44 + html.substring(pBS44End + 6);
  console.log('2. bS44 and bReclone click handlers updated.');
}

// 3. Update table Y input with warning
const pYInp = html.indexOf('data-f="y"');
if (pYInp !== -1) {
  const pTdStart = html.lastIndexOf('<td>', pYInp);
  const pTdEnd = html.indexOf('</td>', pYInp) + 5;
  const newYInp = `\${(()=>{
      const curY = rec.y(b) / 16;
      const isWallTrap = (curY < 155 || curY > 215) && ((b[4] & 0x3F) < 20 || (b[4] & 0x3F) > 26);
      return \`<td title="\${isWallTrap?'⚠️ Atenção: Y fora do chão (155..215px)! Inimigo preso na parede. Clique no botão Chão para corrigir.':''}"><input class="n \${isWallTrap?'warn-wall':''}" data-i="\${i}" data-f="y" value="\${rec.y(b)}" \${isWallTrap?'style="border-color:#ef4444;color:#ef4444;font-weight:bold"':''}></td>\`;
    })()}`;
  html = html.substring(0, pTdStart) + newYInp + html.substring(pTdEnd);
  console.log('3. Table Y input updated with wall trap warning.');
}

fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('Finish patch applied successfully! Size:', html.length);

