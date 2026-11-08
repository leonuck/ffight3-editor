const fs = require('fs');

let html = fs.readFileSync('scratch/updated_part1.html', 'utf8');

// Find and replace render() board generation
const oldBoardHtmlTarget = `  // ===== TABULEIRO VISUAL (2D VIEWPORT) =====
  const arenaW = Math.round(396 * BOARD_ZOOM);
  const arenaH = Math.round(224 * BOARD_ZOOM);
  const screenLeft = Math.round(70 * BOARD_ZOOM);
  const screenW = Math.round(256 * BOARD_ZOOM);

  const waveTabs = [\`<span class="pill wave-pill \${ACTIVE_WAVE==='all'?'active':''}" data-w="all">Todas as Ondas</span>\`]
    .concat(waves.map((w,i)=>\`<span class="pill wave-pill \${ACTIVE_WAVE===''+w.id?'active':''}" data-w="\${w.id}">\${w.name} (\${w.items.length})</span>\`))
    .join('');

  // Demarcação de todas as portas desta fase no tabuleiro
  const stageDoors = SECRET_CONFIG.enabled ? SECRET_DOORS.filter(d => d.srcStage === (s.row + 1)) : [];
  const doorZoneHtml = stageDoors.map((d, di) => {
    const dLeft = Math.round((d.minX + 70) * BOARD_ZOOM);
    const dW = Math.max(20, Math.round((d.maxX - d.minX) * BOARD_ZOOM));
    const dTop = Math.round(135 * BOARD_ZOOM);
    const dH = Math.max(24, Math.round((d.maxY - 135) * BOARD_ZOOM));
    const destName = areaLabel(d.destStage);
    return \`<div class="arena-door-zone" style="left:\${dLeft}px;width:\${dW}px;top:\${dTop}px;height:\${dH}px">
      <div class="door-tag">🚪 PORTA #\${di+1} (X:\${d.minX}..\${d.maxX}) ➔ \${destName}</div>
    </div>\`;
  }).join('');`;

const newBoardHtmlReplacement = `  // ===== TABULEIRO VISUAL (2D VIEWPORT PANORÂMICO) =====
  let maxTrig = 0;
  s.items.forEach(it => { if(it.t==='rec') maxTrig = Math.max(maxTrig, rec.trig(it.b)/16); });
  const isPano = (BOARD_VIEW_MODE === 'pano');
  const stageLen = isPano ? Math.max(1280, maxTrig + 320) : 396;
  const arenaW = Math.round(stageLen * BOARD_ZOOM);
  const arenaH = Math.round(224 * BOARD_ZOOM);
  const screenLeft = Math.round(70 * BOARD_ZOOM);
  const screenW = Math.round(256 * BOARD_ZOOM);

  const waveTabs = [\`<span class="pill wave-pill \${ACTIVE_WAVE==='all'?'active':''}" data-w="all">Todas as Ondas</span>\`]
    .concat(waves.map((w,i)=>\`<span class="pill wave-pill \${ACTIVE_WAVE===''+w.id?'active':''}" data-w="\${w.id}">\${w.name} (\${w.items.length})</span>\`))
    .join('');

  // Barreiras de onda em modo panorâmico
  let waveBarriersHtml = '';
  if(isPano) {
    s.items.forEach((it, i) => {
      if(it.t==='cmd' && it.b.length===2) {
        let prevTrig = 0;
        for(let j=i-1; j>=0; j--){ if(s.items[j].t==='rec'){ prevTrig = rec.trig(s.items[j].b)/16; break; } }
        const barX = Math.round((prevTrig + 128) * BOARD_ZOOM);
        waveBarriersHtml += \`<div class="arena-wave-barrier" style="left:\${barX}px"><span class="arena-wave-badge">Barreira #\${h2(it.b[1])}</span></div>\`;
      }
    });
  }

  // Demarcação de todas as portas desta fase no tabuleiro com handles de redimensionamento
  const stageDoors = SECRET_CONFIG.enabled ? SECRET_DOORS.filter(d => d.srcStage === (s.row + 1)) : [];
  const doorZoneHtml = stageDoors.map((d, di) => {
    const globalIdx = SECRET_DOORS.indexOf(d);
    const dLeft = Math.round((isPano ? d.minX : (d.minX + 70)) * BOARD_ZOOM);
    const dW = Math.max(24, Math.round((d.maxX - d.minX) * BOARD_ZOOM));
    const dTop = Math.round(135 * BOARD_ZOOM);
    const dH = Math.max(28, Math.round((d.maxY - 135) * BOARD_ZOOM));
    const destName = areaLabel(d.destStage);
    return \`<div class="arena-door-zone" data-door-idx="\${globalIdx}" style="left:\${dLeft}px;width:\${dW}px;top:\${dTop}px;height:\${dH}px" title="Clique e arraste para mover. Puxe as bordas para redimensionar.">
      <div class="door-resize-handle door-handle-l" title="Arrastar para alterar X min"></div>
      <div class="door-resize-handle door-handle-r" title="Arrastar para alterar X max"></div>
      <div class="door-resize-handle door-handle-t" title="Arrastar para alterar Y teto"></div>
      <div class="door-tag">🚪 PORTA #\${di+1} (X:\${d.minX}..\${d.maxX}) ➔ \${destName}</div>
    </div>\`;
  }).join('');`;

html = html.replace(oldBoardHtmlTarget, newBoardHtmlReplacement);

// Replace board header to add View Mode buttons and Add Door Visual button
const oldHeaderTarget = `<div class="board-header">
      <div class="left">
        <b style="font-size:12.5px">🎮 Tabuleiro de Posicionamento</b>
        <span class="hint">Arraste os inimigos pelo tabuleiro (ou use as setas do teclado ← ↑ → ↓)</span>
      </div>
      <div class="right">
        <span class="hint">Zoom:</span>
        <button id="zoom1" class="\${BOARD_ZOOM===1?'pri':''}" style="padding:2px 7px;font-size:11px">1x</button>
        <button id="zoom15" class="\${BOARD_ZOOM===1.5?'pri':''}" style="padding:2px 7px;font-size:11px">1.5x</button>
        <button id="zoom2" class="\${BOARD_ZOOM===2?'pri':''}" style="padding:2px 7px;font-size:11px">2x</button>
      </div>
    </div>`;

const newHeaderReplacement = `<div class="board-header">
      <div class="left" style="display:flex;align-items:center;gap:10px;">
        <b style="font-size:12.5px">🎮 Tabuleiro Visual de Posicionamento</b>
        <div style="display:inline-flex;background:var(--panel);border:1px solid var(--line);border-radius:4px;overflow:hidden;">
          <button id="btnViewPano" class="\${isPano?'pri':''}" style="padding:2px 8px;font-size:11px;border-radius:0;border:none;">🏙️ Rua Panorâmica (1280px)</button>
          <button id="btnViewSingle" class="\${!isPano?'pri':''}" style="padding:2px 8px;font-size:11px;border-radius:0;border:none;">📺 Tela SNES (256px)</button>
        </div>
        <button id="btnAddDoorVisual" class="sec" style="padding:2px 8px;font-size:11px;" title="Cria uma nova porta na área central visível da rua">🚪 + Adicionar Porta no Cenário</button>
      </div>
      <div class="right">
        <span class="hint">Zoom:</span>
        <button id="zoom1" class="\${BOARD_ZOOM===1?'pri':''}" style="padding:2px 7px;font-size:11px">1x</button>
        <button id="zoom15" class="\${BOARD_ZOOM===1.5?'pri':''}" style="padding:2px 7px;font-size:11px">1.5x</button>
        <button id="zoom2" class="\${BOARD_ZOOM===2?'pri':''}" style="padding:2px 7px;font-size:11px">2x</button>
      </div>
    </div>`;

html = html.replace(oldHeaderTarget, newHeaderReplacement);

// Replace arena body to add canvas
const oldArenaBodyTarget = `<div class="board-viewport">
      <div class="board-arena" id="boardArena" style="width:\${arenaW}px;height:\${arenaH}px">
        <div class="arena-side-left" style="width:\${screenLeft}px"></div>
        <div class="arena-side-tag-l">⬅ Entrada Fora (Esq.)</div>
        
        <div class="arena-screen" style="left:\${screenLeft}px;width:\${screenW}px">
          <div class="arena-screen-tag">Área Visível SNES (256 × 224)</div>
        </div>
        
        <div class="arena-side-right" style="width:\${screenLeft}px"></div>
        <div class="arena-side-tag-r">Entrada Fora (Dir.) ➡</div>
        
        <div class="arena-floor" style="top:\${Math.round(150*BOARD_ZOOM)}px;height:\${Math.round(65*BOARD_ZOOM)}px">
          <div class="arena-floor-grid"></div>
        </div>
        <div class="arena-floor-label" style="top:\${Math.round(152*BOARD_ZOOM)}px;left:\${screenLeft+6}px">Plano do Chão (Y: 155..215)</div>

        \${doorZoneHtml}

        <div id="dragGuideX" class="drag-guide-x"></div>
        <div id="dragGuideY" class="drag-guide-y"></div>

        <div id="tokenContainer"></div>
      </div>
    </div>`;

const newArenaBodyReplacement = `<div class="board-viewport">
      <div class="board-arena" id="boardArena" style="width:\${arenaW}px;height:\${arenaH}px">
        <canvas id="stageBgCanvas" width="\${arenaW}" height="\${arenaH}"></canvas>
        \${isPano ? waveBarriersHtml : \`
          <div class="arena-side-left" style="width:\${screenLeft}px"></div>
          <div class="arena-side-tag-l">⬅ Entrada Fora (Esq.)</div>
          
          <div class="arena-screen" style="left:\${screenLeft}px;width:\${screenW}px">
            <div class="arena-screen-tag">Área Visível SNES (256 × 224)</div>
          </div>
          
          <div class="arena-side-right" style="width:\${screenLeft}px"></div>
          <div class="arena-side-tag-r">Entrada Fora (Dir.) ➡</div>
        \`}
        
        <div class="arena-floor" style="top:\${Math.round(150*BOARD_ZOOM)}px;height:\${Math.round(65*BOARD_ZOOM)}px">
          <div class="arena-floor-grid"></div>
        </div>
        <div class="arena-floor-label" style="top:\${Math.round(152*BOARD_ZOOM)}px;left:\${isPano?12:(screenLeft+6)}px">Plano do Chão (Y: 155..215 px)</div>

        \${doorZoneHtml}

        <div id="dragGuideX" class="drag-guide-x"></div>
        <div id="dragGuideY" class="drag-guide-y"></div>

        <div id="tokenContainer"></div>
      </div>
    </div>`;

html = html.replace(oldArenaBodyTarget, newArenaBodyReplacement);

// Update renderBoardTokens: replace emoji and positioning with SVG and isPano
const oldTokenPosTarget = `    const xPx = rec.x(b) / 16;
    const yPx = rec.y(b) / 16;

    const tokenX = (xPx + 70) * BOARD_ZOOM;
    const tokenY = yPx * BOARD_ZOOM;`;

const newTokenPosReplacement = `    const xPx = rec.x(b) / 16;
    const yPx = rec.y(b) / 16;
    const isPano = (BOARD_VIEW_MODE === 'pano');

    const worldX = isPano ? ((rec.trig(b)/16) + xPx) : (xPx + 70);
    const tokenX = worldX * BOARD_ZOOM;
    const tokenY = yPx * BOARD_ZOOM;`;

html = html.replace(oldTokenPosTarget, newTokenPosReplacement);

// Replace token avatar HTML
const oldTokenAvatarTarget = `<div class="token-avatar">\${em}</div>`;
const newTokenAvatarReplacement = `<div class="token-avatar">\${getEnemyAvatarSvg(b[4])}</div>`;
html = html.replace(oldTokenAvatarTarget, newTokenAvatarReplacement);

// Update token coords display
const oldTokenCoordsTarget = `<div class="token-coords">X:\${Math.round(xPx)} Y:\${Math.round(yPx)}</div>`;
const newTokenCoordsReplacement = `<div class="token-coords">\${isPano ? 'Mundo X:' + Math.round(worldX) : 'Tela X:' + Math.round(xPx)} Y:\${Math.round(yPx)}</div>`;
html = html.replace(oldTokenCoordsTarget, newTokenCoordsReplacement);

// Add event handlers for view toggle, add door visual, canvas drawing, and door dragging
const oldRenderEndTarget = `  $('#zoom1').onclick=()=>{BOARD_ZOOM=1;render();};
  $('#zoom15').onclick=()=>{BOARD_ZOOM=1.5;render();};
  $('#zoom2').onclick=()=>{BOARD_ZOOM=2;render();};`;

const newRenderEndReplacement = `  $('#zoom1').onclick=()=>{BOARD_ZOOM=1;render();};
  $('#zoom15').onclick=()=>{BOARD_ZOOM=1.5;render();};
  $('#zoom2').onclick=()=>{BOARD_ZOOM=2;render();};

  const btnPano = $('#btnViewPano');
  if(btnPano) btnPano.onclick=()=>{BOARD_VIEW_MODE='pano';render();};
  const btnSingle = $('#btnViewSingle');
  if(btnSingle) btnSingle.onclick=()=>{BOARD_VIEW_MODE='single';render();};

  const btnAddDoorVis = $('#btnAddDoorVisual');
  if(btnAddDoorVis) btnAddDoorVis.onclick=()=>{
    addDoorAtVisualCenter();
  };

  // Renderiza o cenário da fase no Canvas
  drawStageBackground($('#stageBgCanvas'), s.row + 1, arenaW, arenaH, BOARD_ZOOM);
  setupDoorInteractions();`;

html = html.replace(oldRenderEndTarget, newRenderEndReplacement);

// Add setupDoorInteractions and addDoorAtVisualCenter
const doorInteractionsCode = `
// ===== Interatividade de Arraste e Redimensionamento de Portas no Cenário =====
function setupDoorInteractions(){
  const arena = $('#boardArena');
  if(!arena) return;

  arena.onmousedown = (e) => {
    const handle = e.target.closest('.door-resize-handle');
    const doorBox = e.target.closest('.arena-door-zone');
    if(!doorBox) return;

    const idx = parseInt(doorBox.dataset.doorIdx, 10);
    if(isNaN(idx) || !SECRET_DOORS[idx]) return;

    e.preventDefault();
    e.stopPropagation();

    document.querySelectorAll('.arena-door-zone').forEach(el => el.classList.remove('is-selected'));
    doorBox.classList.add('is-selected');

    document.querySelectorAll('.door-card').forEach((c, ci) => {
      c.style.borderColor = (ci === idx) ? 'var(--warn)' : '';
      if(ci === idx) c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    let mode = 'move';
    if(handle){
      if(handle.classList.contains('door-handle-l')) mode = 'left';
      else if(handle.classList.contains('door-handle-r')) mode = 'right';
      else if(handle.classList.contains('door-handle-t')) mode = 'top';
    }

    const d = SECRET_DOORS[idx];
    DRAGGING_DOOR = {
      idx,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origMinX: d.minX,
      origMaxX: d.maxX,
      origMaxY: d.maxY,
      box: doorBox
    };
  };

  if(!window._doorListenersAdded){
    window._doorListenersAdded = true;
    window.addEventListener('mousemove', (e) => {
      if(!DRAGGING_DOOR) return;
      const { idx, mode, startX, startY, origMinX, origMaxX, origMaxY, box } = DRAGGING_DOOR;
      const dx = Math.round((e.clientX - startX) / BOARD_ZOOM);
      const dy = Math.round((e.clientY - startY) / BOARD_ZOOM);

      const d = SECRET_DOORS[idx];
      if(!d) return;

      if(mode === 'move'){
        const width = origMaxX - origMinX;
        d.minX = Math.max(0, origMinX + dx);
        d.maxX = d.minX + width;
      } else if(mode === 'left'){
        d.minX = Math.max(0, Math.min(origMinX + dx, d.maxX - 16));
      } else if(mode === 'right'){
        d.maxX = Math.max(d.minX + 16, origMaxX + dx);
      } else if(mode === 'top'){
        d.maxY = Math.max(140, Math.min(224, origMaxY + dy));
      }

      const isPano = (BOARD_VIEW_MODE === 'pano');
      const dLeft = Math.round((isPano ? d.minX : (d.minX + 70)) * BOARD_ZOOM);
      const dW = Math.max(24, Math.round((d.maxX - d.minX) * BOARD_ZOOM));
      const dTop = Math.round(135 * BOARD_ZOOM);
      const dH = Math.max(28, Math.round((d.maxY - 135) * BOARD_ZOOM));

      box.style.left = \`\${dLeft}px\`;
      box.style.width = \`\${dW}px\`;
      box.style.top = \`\${dTop}px\`;
      box.style.height = \`\${dH}px\`;

      const tag = box.querySelector('.door-tag');
      if(tag){
        tag.textContent = \`🚪 PORTA #\${idx+1} (X:\${d.minX}..\${d.maxX}) ➔ \${areaLabel(d.destStage)}\`;
      }

      const inpMin = document.querySelector(\`.inp_door_min[data-idx="\${idx}"]\`);
      const inpMax = document.querySelector(\`.inp_door_max[data-idx="\${idx}"]\`);
      const inpY = document.querySelector(\`.inp_door_y[data-idx="\${idx}"]\`);
      if(inpMin) inpMin.value = d.minX;
      if(inpMax) inpMax.value = d.maxX;
      if(inpY) inpY.value = d.maxY;
    });

    window.addEventListener('mouseup', () => {
      if(DRAGGING_DOOR){
        DRAGGING_DOOR = null;
      }
    });
  }
}

function addDoorAtVisualCenter(){
  const s = ST ? ST.stages[CUR] : null;
  const curStage = s ? s.row + 1 : 1;
  const viewport = $('.board-viewport');
  const scrollX = viewport ? viewport.scrollLeft / BOARD_ZOOM : 0;
  const isPano = (BOARD_VIEW_MODE === 'pano');
  const centerX = Math.round(scrollX + (isPano ? 200 : 128));

  const newDoor = {
    id: SECRET_DOORS.length + 1,
    srcStage: curStage,
    destStage: 7, // Bar Creep Eats padrão
    exitStage: 3, // Chefe Dave padrão
    minX: Math.max(0, centerX - 45),
    maxX: centerX + 45,
    maxY: 205
  };

  SECRET_DOORS.push(newDoor);
  render();

  setTimeout(() => {
    const newBox = document.querySelector(\`[data-door-idx="\${SECRET_DOORS.length - 1}"]\`);
    if(newBox) {
      newBox.classList.add('is-selected');
      newBox.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, 60);
}
`;

html = html.replace('function selectEnemy(idx){', doorInteractionsCode + '\nfunction selectEnemy(idx){');

fs.writeFileSync('scratch/updated_full.html', html);
console.log('Full update written to scratch/updated_full.html');

