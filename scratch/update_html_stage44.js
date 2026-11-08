const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

// 1. Add Stage 44 to STAGE_NAMES if not present
if (!html.includes('id: 44')) {
  html = html.replace(
    '{ id: 43, name: "MODO DE TREINO (Training Room)" }',
    '{ id: 43, name: "MODO DE TREINO (Training Room)" },\n  { id: 44, name: "ROUND 7 · SALA SECRETA NOVA (Fase 44)" }'
  );
}

// 2. Add Stage 44 compilation logic into buildRom
const oldBuildRomAllocTarget = `  // Alocador simples de scripts nas áreas livres
  const runs=FREE_RUNS.map(r=>({a:r[0],b:r[1],p:r[0]})).filter(r=>isZero(rom,h,r.a,r.b));`;

const newBuildRomAllocReplacement = `  // Suporte a Nova Sala Secreta (Fase 44)
  const s44 = st.stages.find(s => s.id === 44);
  if(s44){
    const tplStageId = s44.templateStage || 7;
    const s44Off = 0x342B3 + h;
    // Lê os 4 ponteiros visuais do template na tabela 0x34000
    let aTpl = 0x34000 + h;
    let curTpl = 1;
    let tplPointers = null;
    while (aTpl < 0x34000 + h + 0x300) {
      const ptrs = [];
      while (rom[aTpl+2] >= 0xC0 && rom[aTpl+2] < 0xF0) {
        ptrs.push(rom[aTpl] | (rom[aTpl+1] << 8) | (rom[aTpl+2] << 16));
        aTpl += 3;
      }
      if (!ptrs.length) break;
      if (curTpl === tplStageId) { tplPointers = ptrs; break; }
      curTpl++;
      if (rom[aTpl] === 0) aTpl++;
    }
    if(tplPointers){
      for(let p = 0; p < 4; p++){
        const v = tplPointers[p];
        rom[s44Off + p*3] = v & 0xFF;
        rom[s44Off + p*3 + 1] = (v >> 8) & 0xFF;
        rom[s44Off + p*3 + 2] = (v >> 16) & 0xFF;
      }
      rom[s44Off + 15] = 0x00; // terminador da tabela
      s44.ptrAt = 0x342B3 + 12; // offset do 5º ponteiro (script)
      
      // Copia os 12 bytes de metadados (música, paleta, gráficos) do template para C0:0F39
      const metaBase = 0x0D35 + h;
      const tplMetaOff = metaBase + (tplStageId - 1) * 12;
      const s44MetaOff = metaBase + (44 - 1) * 12;
      for(let i = 0; i < 12; i++){
        rom[s44MetaOff + i] = rom[tplMetaOff + i];
      }
      log.push('Engine: Fase 44 registrada na tabela C3:42B3 (Template visual: Fase ' + tplStageId + ')');
    }
  }

  // Alocador simples de scripts nas áreas livres
  const runs=FREE_RUNS.map(r=>({a:r[0],b:r[1],p:r[0]})).filter(r=>isZero(rom,h,r.a,r.b));`;

if (!html.includes('const s44 = st.stages.find(s => s.id === 44);')) {
  html = html.replace(oldBuildRomAllocTarget, newBuildRomAllocReplacement);
}

// 3. Update renderSide to add the button
const oldRenderSideTarget = `  $('#side').innerHTML=list.map(s=>{
    const r=recs(s);const names=[...new Set(r.map(x=>sName(x.b[4]&0xBF)))].slice(0,3).join(', ');
    const doorCount = SECRET_CONFIG.enabled ? SECRET_DOORS.filter(d=>d.srcStage===(s.row+1)).length : 0;
    const doorBadge = doorCount > 0 ? \`<span title="\${doorCount} porta(s) secreta(s)">🚪\${doorCount>1?doorCount:''}</span>\` : '';
    return \`<div class="st \${s.row===CUR?'on':''}" data-r="\${s.row}">
      <b>\${areaLabel(s.row+1)} \${doorBadge}</b> \${isMod(s)?'<span class="mod">●</span>':''}
      <small>\${r.length} inimigos · \${names}</small>
    </div>\`;
  }).join('');
  $('#side').querySelectorAll('.st').forEach(e=>e.onclick=()=>{CUR=+e.dataset.r;SELECTED_IDX=null;ACTIVE_WAVE='all';render();});
}`;

const newRenderSideReplacement = `  const hasStage44 = ST.stages.some(s => s.id === 44);
  const stageItemsHtml = list.map(s=>{
    const r=recs(s);const names=[...new Set(r.map(x=>sName(x.b[4]&0xBF)))].slice(0,3).join(', ');
    const doorCount = SECRET_CONFIG.enabled ? SECRET_DOORS.filter(d=>d.srcStage===(s.row+1)).length : 0;
    const doorBadge = doorCount > 0 ? \`<span title="\${doorCount} porta(s) secreta(s)">🚪\${doorCount>1?doorCount:''}</span>\` : '';
    const isNewS44 = (s.id === 44);
    return \`<div class="st \${s.row===CUR?'on':''} \${isNewS44?'is-stage44':''}" data-r="\${s.row}">
      <b>\${areaLabel(s.row+1)} \${doorBadge} \${isNewS44?'<span style=\"color:#10b981;font-size:10px;\">[NOVA]</span>':''}</b> \${isMod(s)?'<span class=\"mod\">●</span>':''}
      <small>\${r.length} inimigos · \${names}</small>
    </div>\`;
  }).join('');

  $('#side').innerHTML = stageItemsHtml + \`
    <div style="padding:10px;border-top:1px solid var(--line);background:var(--panel-sub);position:sticky;bottom:0;">
      <button id="btnCreateStage44" style="width:100%;padding:8px 10px;background:linear-gradient(135deg, #10b981, #059669);border:none;color:#fff;font-weight:700;font-size:11.5px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 2px 8px rgba(16,185,129,0.3)">
        \${hasStage44 ? '✨ Abrir Fase 44 (Sala Secreta)' : '✨ + Criar Nova Sala Secreta (Fase 44)'}
      </button>
    </div>\`;

  $('#side').querySelectorAll('.st').forEach(e=>e.onclick=()=>{CUR=+e.dataset.r;SELECTED_IDX=null;ACTIVE_WAVE='all';render();});

  const bS44 = $('#btnCreateStage44');
  if(bS44){
    bS44.onclick = () => {
      const idx = ST.stages.findIndex(s => s.id === 44);
      if(idx >= 0){
        CUR = ST.stages[idx].row;
        SELECTED_IDX = null;
        ACTIVE_WAVE = 'all';
        render();
      } else {
        createCustomSecretStage();
      }
    };
  }
}`;

if (!html.includes('btnCreateStage44')) {
  html = html.replace(oldRenderSideTarget, newRenderSideReplacement);
}

// 4. Add createCustomSecretStage function
const createCustomSecretStageFunction = `
// ===== Criador de Nova Sala Secreta (Fase 44) =====
function createCustomSecretStage(){
  if(!ST || !ST.stages) return;
  const existing = ST.stages.find(s => s.id === 44);
  if(existing){
    CUR = existing.row;
    render();
    return;
  }

  // Pergunta o template visual desejado
  const tplChoice = prompt(
    "Escolha o Cenário Base para a Nova Sala Secreta:\\n\\n" +
    "1 - Bar do Callman (Creep Eats - Fase 7) [Recomendado]\\n" +
    "2 - Gabinete do Chefe Dave (Fase 3)\\n" +
    "3 - Restaurante Chinês (Fase 11)\\n" +
    "4 - Corredor das Celas / Prisão (Fase 2)\\n" +
    "5 - Cais do Porto (Fase 4)\\n\\n" +
    "Digite o número da opção (1 a 5):",
    "1"
  );
  if(!tplChoice) return;

  const tplMap = { '1': 7, '2': 3, '3': 11, '4': 2, '5': 4 };
  const tplStageId = tplMap[tplChoice.trim()] || 7;

  // Encontra o template
  const tplStage = ST.stages.find(s => s.id === tplStageId) || ST.stages[6];

  // Script inicial customizado para a nova sala
  const starterItems = [
    // Onda 1: Dois Billys
    { t: 'rec', b: [0, 0, 0, 0, 5, 0, 0, 80, 0, 45, 0, 180, 0, 0, 0, 0, 0] },
    { t: 'rec', b: [0, 0, 0, 0, 5, 0, 0, 80, 0, 210, 0, 190, 0, 0, 0, 0, 0] },
    // Barreira 1 (FF 01)
    { t: 'cmd', b: [0xFF, 0x01] },
    // Onda 2: May + Andore (Chefe da Sala)
    { t: 'rec', b: [0, 0, 0, 0, 6, 0, 0, 90, 0, 50, 0, 185, 0, 0, 0, 0, 0] },
    { t: 'rec', b: [0, 0, 0, 0, 7, 0, 0, 160, 0, 128, 0, 180, 0, 0, 0, 0, 0] },
    // Caixa de madeira com Comida/Item
    { t: 'rec', b: [0, 0, 0, 0, 29, 0, 6, 1, 0, 180, 0, 165, 0, 0, 0, 0, 0] },
    // Barreira Final (FF 02)
    { t: 'cmd', b: [0xFF, 0x02] }
  ];

  const newStage = {
    row: 43,
    id: 44,
    area: 44,
    name: "ROUND 7 · SALA SECRETA NOVA (Fase 44)",
    templateStage: tplStageId,
    ptrAt: 0x342B3 + 12,
    start: 0xE55A8,
    end: 0xE55A8,
    items: starterItems,
    orig: []
  };

  ST.stages.push(newStage);
  CUR = 43;

  // Garante que STAGE_NAMES inclui a Fase 44
  if(!STAGE_NAMES.some(s => s.id === 44)){
    STAGE_NAMES.push({ id: 44, name: "ROUND 7 · SALA SECRETA NOVA (Fase 44)" });
  }

  // Cria ou sugere automaticamente uma porta que leve para a Fase 44
  if(SECRET_DOORS.length > 0 && !SECRET_DOORS.some(d => d.destStage === 44)){
    const confirmDoor = confirm("Deseja configurar a Porta #1 da Fase 1 para transportar diretamente para a nova Fase 44?");
    if(confirmDoor){
      SECRET_DOORS[0].destStage = 44;
      SECRET_DOORS[0].exitStage = 3; // Ao vencer sai em Dave
    }
  }

  render();
  alert("✨ Sala Secreta 44 criada com sucesso!\\n\\nVocê pode editar os inimigos, posicionar no tabuleiro, e salvar a ROM normalmente.");
}
`;

if (!html.includes('createCustomSecretStage(')) {
  html = html.replace('function selectEnemy(idx){', createCustomSecretStageFunction + '\nfunction selectEnemy(idx){');
}

fs.writeFileSync('scratch/updated_with_stage44.html', html);
console.log('Update with stage 44 written to scratch/updated_with_stage44.html');

