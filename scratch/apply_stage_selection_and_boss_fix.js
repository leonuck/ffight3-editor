const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
console.log('Original size:', html.length);

// 1. Add Modal CSS before </style>
const modalCss = `
/* Modal Dialog for Stage Cloning */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.78);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.15s ease}
.modal-box{background:var(--panel);border:1px solid var(--line);border-radius:12px;width:92%;max-width:540px;padding:20px;box-shadow:0 16px 40px rgba(0,0,0,0.65);display:flex;flex-direction:column;gap:12px}
.modal-header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding-bottom:10px}
.modal-header h3{margin:0;font-size:15px;color:var(--ok);display:flex;align-items:center;gap:6px}
.modal-close{background:transparent;border:none;color:var(--mute);font-size:22px;cursor:pointer;line-height:1}
.modal-close:hover{color:#fff}
.modal-body{display:flex;flex-direction:column;gap:12px}
.modal-footer{display:flex;justify-content:flex-end;gap:8px;border-top:1px solid var(--line);padding-top:14px;margin-top:4px}
.warn-wall{background:rgba(239,68,68,0.18)!important;color:#fca5a5!important;font-weight:bold}
.btn-reclone{width:100%;padding:6px 10px;background:var(--chip);border:1px solid var(--line);color:var(--ink);font-size:11px;font-weight:600;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:background .15s}
.btn-reclone:hover{background:var(--panel-sub);border-color:var(--warn);color:var(--warn)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
`;

if (!html.includes('.modal-backdrop')) {
  html = html.replace('</style>', modalCss + '\n</style>');
  console.log('1. Modal CSS added.');
}

// 2. Add Modal HTML right inside <main>
const modalHtml = `
  <!-- Modal Dialog: Clonador de Fase / Criador da Fase 44 -->
  <div id="modalStageClone" class="modal-backdrop" style="display:none">
    <div class="modal-box">
      <div class="modal-header">
        <h3 id="modalTitle">✨ Criar Nova Sala Secreta (Fase 44)</h3>
        <button class="modal-close" id="btnModalClose">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-size:12px;color:var(--mute);margin:0 0 4px 0;line-height:1.4;">
          Escolha qualquer uma das <b>43 fases do jogo</b> para servir como base visual (gráficos, paletas de cores, música de fundo) e combate:
        </p>
        
        <div>
          <label style="display:block;font-size:11.5px;font-weight:700;margin-bottom:5px;color:var(--ink);">Cenário Base para Clonar:</label>
          <select id="selModalStage" style="width:100%;padding:8px 10px;background:var(--bg);border:1px solid var(--line);border-radius:6px;color:var(--ink);font-size:12.5px;cursor:pointer;"></select>
        </div>

        <div style="background:var(--panel-sub);border:1px solid var(--line);border-radius:8px;padding:10px 12px;">
          <label style="display:flex;align-items:center;gap:8px;font-size:12px;cursor:pointer;margin-bottom:6px;">
            <input type="checkbox" id="chkModalCloneEnemies" checked>
            <span><b>Clonar todos os inimigos originais da fase escolhida</b></span>
          </label>
          <div style="font-size:11px;color:var(--mute);margin-left:22px;line-height:1.4;">
            Se você substituir o chefe por um inimigo comum (Billy, May, Dirk, Andore), o editor <b>ajusta automaticamente o chão e as coordenadas</b> para que ele nunca fique preso na parede!
          </div>
        </div>

        <div style="background:var(--panel-sub);border:1px solid var(--line);border-radius:8px;padding:10px 12px;">
          <label style="display:flex;align-items:center;gap:8px;font-size:12px;cursor:pointer;">
            <input type="checkbox" id="chkModalConnectDoor" checked>
            <span><b>Conectar Porta #1 da Fase 1 nesta sala</b></span>
          </label>
          <div style="font-size:11px;color:var(--mute);margin-left:22px;margin-top:4px;line-height:1.4;">
            Ao entrar na porta da Delegacia, transporta para esta nova fase secreta e, ao vencê-la, segue direto para o Chefe Dave.
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="btnModalCancel" style="padding:7px 14px;background:var(--panel-sub);border:1px solid var(--line);color:var(--ink);border-radius:6px;cursor:pointer;font-size:12px;">Cancelar</button>
        <button id="btnModalConfirm" style="padding:7px 16px;background:linear-gradient(135deg,#10b981,#059669);border:none;color:#fff;font-weight:700;font-size:12px;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(16,185,129,0.35);">✨ Confirmar e Criar</button>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="modalStageClone"')) {
  html = html.replace('<main>', '<main>' + modalHtml);
  console.log('2. Modal HTML added.');
}

// 3. Update renderSide buttons to add Reclone button and open modal
const oldSideBtns = `      <div style="padding:10px;border-top:1px solid var(--line);background:var(--panel-sub);position:sticky;bottom:0;">
        <button id="btnCreateStage44" style="width:100%;padding:8px 10px;background:linear-gradient(135deg, #10b981, #059669);border:none;color:#fff;font-weight:700;font-size:11.5px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 2px 8px rgba(16,185,129,0.3)">
          \${hasStage44 ? '✨ Abrir Fase 44 (Sala Secreta)' : '✨ + Criar Nova Sala Secreta (Fase 44)'}
        </button>
      </div>`;

const newSideBtns = `      <div style="padding:10px;border-top:1px solid var(--line);background:var(--panel-sub);position:sticky;bottom:0;display:flex;flex-direction:column;gap:6px;">
        <button id="btnCreateStage44" style="width:100%;padding:8px 10px;background:linear-gradient(135deg, #10b981, #059669);border:none;color:#fff;font-weight:700;font-size:11.5px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 2px 8px rgba(16,185,129,0.3)">
          \${hasStage44 ? '✨ Abrir Fase 44 (Sala Secreta)' : '✨ + Criar Nova Sala Secreta (Fase 44)'}
        </button>
        \${hasStage44 ? \`
          <button id="btnRecloneStage44" class="btn-reclone">
            🔄 Clonar Outra Fase para Fase 44
          </button>
        \` : ''}
      </div>`;

if (html.includes(oldSideBtns)) {
  html = html.replace(oldSideBtns, newSideBtns);
  console.log('3. renderSide button container updated.');
}

// 4. Update bS44.onclick and add bReclone.onclick in renderSide()
const oldBS44Handler = `    const bS44 = $('#btnCreateStage44');
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
    }`;

const newBS44Handler = `    const bS44 = $('#btnCreateStage44');
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

if (html.includes(oldBS44Handler)) {
  html = html.replace(oldBS44Handler, newBS44Handler);
  console.log('4. bS44 and bReclone click handlers updated.');
}

// 5. Replace createCustomSecretStage with modal integration + direct cloning + boss-to-common auto-fix
const createIdx = html.indexOf("function createCustomSecretStage(");
const vramIdx = html.indexOf("function vramWarn(s){", createIdx);

if (createIdx === -1 || vramIdx === -1) {
  throw new Error("Could not find createCustomSecretStage boundary to replace");
}

const newCreateStageAndModal = `// ===== Modal de Clonagem e Criação da Fase Secreta (Fase 44) =====
function openCreateStageModal(isReclone = false){
  if(!ST || !ST.stages) {
    alert("Por favor, carregue uma ROM primeiro antes de criar a Fase 44.");
    return;
  }
  const modal = $('#modalStageClone');
  if(!modal) return;

  const sel = $('#selModalStage');
  if(sel){
    const curTpl = (isReclone && ST.stages.find(s => s.id === 44)) ? (ST.stages.find(s => s.id === 44).templateStage || 7) : 7;
    sel.innerHTML = STAGE_NAMES.filter(s => s.id <= 43).map(st => {
      const isDef = (st.id === curTpl);
      const isFav = (st.id === 7 || st.id === 3 || st.id === 11 || st.id === 2 || st.id === 4);
      return \`<option value="\${st.id}" \${isDef ? 'selected' : ''}>\${st.id}. \${st.name} \${st.id===7?'⭐ [Recomendado]':''}</option>\`;
    }).join('');
  }

  const titleEl = $('#modalTitle');
  if(titleEl){
    titleEl.textContent = isReclone ? "🔄 Clonar Outro Cenário para a Fase 44" : "✨ Criar Nova Sala Secreta (Fase 44)";
  }

  modal.style.display = 'flex';

  $('#btnModalClose').onclick = () => { modal.style.display = 'none'; };
  $('#btnModalCancel').onclick = () => { modal.style.display = 'none'; };
  modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };

  $('#btnModalConfirm').onclick = () => {
    const tplStageId = +$('#selModalStage').value || 7;
    const cloneEnemies = $('#chkModalCloneEnemies').checked;
    const connectDoor = $('#chkModalConnectDoor').checked;
    modal.style.display = 'none';
    createCustomSecretStage(tplStageId, cloneEnemies, connectDoor);
  };
}

function createCustomSecretStage(tplStageId = 7, cloneEnemies = true, connectDoor = true){
  if(!ST || !ST.stages) return;

  const tplStage = ST.stages.find(s => s.id === tplStageId);
  let starterItems = [];

  if(cloneEnemies && tplStage && tplStage.items && tplStage.items.length > 0){
    starterItems = tplStage.items.map(it => {
      const clone = { t: it.t, b: it.b.slice() };
      return clone;
    });
  } else {
    // Onda balanceada limpa caso prefira começar do zero
    starterItems = [
      { t: 'rec', b: [0, 0, 0x00, 0x08, 5, 2, 0x82, 35, 0, 0, 0, 0x30, 0x11, 0x80, 0x0B, 0, 0] },
      { t: 'rec', b: [0, 0, 0x00, 0x08, 6, 2, 0x82, 35, 0, 0, 0, 0xD0, 0xFD, 0x00, 0x0C, 0, 0] },
      { t: 'cmd', b: [0xFF, 0x01] },
      { t: 'rec', b: [0, 0, 0x00, 0x08, 7, 3, 0x8A, 120, 0, 0, 0, 0x30, 0x11, 0x80, 0x0B, 0, 0] },
      { t: 'rec', b: [0, 0, 0x00, 0x08, 29, 2, 0x06, 1, 0, 0, 0, 0x00, 0x10, 0x60, 0x0B, 0, 0] },
      { t: 'cmd', b: [0xFF, 0x02] }
    ];
  }

  const existingIdx = ST.stages.findIndex(s => s.id === 44);
  if(existingIdx >= 0){
    ST.stages[existingIdx].templateStage = tplStageId;
    ST.stages[existingIdx].items = starterItems;
    CUR = ST.stages[existingIdx].row;
  } else {
    const newStage = {
      row: ST.stages.length,
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
    CUR = newStage.row;
  }

  // Garante que STAGE_NAMES inclui a Fase 44
  if(!STAGE_NAMES.some(s => s.id === 44)){
    STAGE_NAMES.push({ id: 44, name: "ROUND 7 · SALA SECRETA NOVA (Fase 44)" });
  }

  if(connectDoor && SECRET_DOORS.length > 0){
    SECRET_DOORS[0].destStage = 44;
    SECRET_DOORS[0].exitStage = 3; // Ao vencer sai em Dave
  }

  render();
  const enemyCount = starterItems.filter(x => x.t === 'rec').length;
  alert("✨ Fase 44 configurada com sucesso!\\n\\nCenário clonado: Fase " + tplStageId + " (" + areaLabel(tplStageId) + ")\\nInimigos: " + enemyCount + (cloneEnemies ? " (clonados da fase original)" : " (onda balanceada)") + "\\n\\nDica: Se trocar qualquer chefe por um inimigo comum, o editor alinha automaticamente no chão para que ele se mova e lute sem ficar preso na parede!");
}`;

html = html.substring(0, createIdx) + newCreateStageAndModal + "\n\n" + html.substring(vramIdx);
console.log('5. createCustomSecretStage and openCreateStageModal updated.');

// 6. Update $('#tab').onchange to auto-sanitize when changing Type (boss -> common enemy)
const oldTypeHandler = "else if(f==='type')b[4]=+e.value;";
const newTypeHandler = `else if(f==='type') {
      const newType = (+e.value) & 0x3F;
      b[4] = +e.value;
      const isBoss = (newType >= 20 && newType <= 26);
      if(!isBoss){
        // 1. Ajusta VRAM se estava com tamanho de chefe
        if(b[5] > 3 || b[5] === 0){
          const isBig = (newType === 7 || newType === 8 || newType === 9 || newType === 14 || newType === 19);
          b[5] = isBig ? 3 : 2;
        }
        // 2. Se a posição era absoluta (comum em chefes que usam intro especial fora da tela),
        // converte para posição relativa à câmera para o inimigo comum poder andar e lutar
        if(b[10] === 1){
          b[10] = 0; // relativa à câmera
          const curXPx = rec.x(b) / 16;
          if(curXPx > 300 || curXPx < -60){
            setW(b, 11, 275 * 16); // Entrada padrão pela direita
          }
        }
        // 3. Se Y estiver fora do chão jogável (ex: Callman a 144px na parede/balcão, ou Caine a 128px no mezanino)
        const curY = rec.y(b) / 16;
        if(curY < 155 || curY > 215){
          setW(b, 13, 184 * 16); // Alinha no centro do chão (184px) para não travar na colisão
        }
      }
    }`;

if (html.includes(oldTypeHandler)) {
  html = html.replace(oldTypeHandler, newTypeHandler);
  console.log('6. type change auto-sanitizer added.');
} else {
  throw new Error("Could not find oldTypeHandler to replace");
}

// 7. Update #b_floor to also auto-fix position flag and X if common enemy was stuck
const oldBFloor = `$('#b_floor').onclick=()=>{if(SELECTED_IDX!=null) setPos(s,SELECTED_IDX,null,184);};`;
const newBFloor = `$('#b_floor').onclick=()=>{
      if(SELECTED_IDX!=null){
        const it = s.items[SELECTED_IDX];
        if(it && it.t==='rec'){
          setW(it.b, 13, 184 * 16);
          if(it.b[10] === 1 && ((it.b[4] & 0x3F) < 20 || (it.b[4] & 0x3F) > 26)){
            it.b[10] = 0;
            setW(it.b, 11, 275 * 16);
          }
          render();
          selectEnemy(SELECTED_IDX);
        }
      }
    };`;

if (html.includes(oldBFloor)) {
  html = html.replace(oldBFloor, newBFloor);
  console.log('7. b_floor action enhanced.');
}

// 8. In table generation, add visual warning for enemies stuck in wall
const oldYInput = `<td><input class="n" data-i="\${i}" data-f="y" value="\${rec.y(b)}"></td>`;
const newYInput = `\${(()=>{
        const curY = rec.y(b) / 16;
        const isWallTrap = (curY < 155 || curY > 215) && ((b[4] & 0x3F) < 20 || (b[4] & 0x3F) > 26);
        return \`<td title="\${isWallTrap?'⚠️ Atenção: Y fora do chão (155..215px)! Inimigo preso na parede. Clique no botão Chão para corrigir.':''}"><input class="n \${isWallTrap?'warn-wall':''}" data-i="\${i}" data-f="y" value="\${rec.y(b)}" \${isWallTrap?'style=\"border-color:#ef4444;color:#ef4444;font-weight:bold\"':''}></td>\`;
      })()}`;

if (html.includes(oldYInput)) {
  html = html.replace(oldYInput, newYInput);
  console.log('8. Y coordinate wall warning added in table.');
}

fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('ALL FIXES SUCCESSFULLY APPLIED! New size:', html.length);

