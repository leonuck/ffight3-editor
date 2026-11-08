const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve('FF3_Script_Editor.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Update CSS for tokens and boss banner
const oldCssStart = '/* Enemy Draggable Tokens */';
const oldCssEnd = '/* Interactive Door Zone & Resizing Handles */';
const idxCssStart = html.indexOf(oldCssStart);
const idxCssEnd = html.indexOf(oldCssEnd, idxCssStart);

if (idxCssStart !== -1 && idxCssEnd !== -1) {
  const newCss = `/* Enemy Draggable Tokens - Real Pixel-Art Sprites */
.enemy-token{position:absolute;transform:translate(-50%, -100%);cursor:grab;z-index:10;display:flex;flex-direction:column;align-items:center;user-select:none;transition:transform .05s linear}
.enemy-token:active{cursor:grabbing}
.enemy-token.is-selected{z-index:25}
.enemy-token.is-boss{z-index:20}
.enemy-token.dimmed{opacity:0.25;pointer-events:none}
.enemy-token.dimmed.is-boss{opacity:0.75;pointer-events:auto;filter:grayscale(30%)}

.token-tag{display:flex;align-items:center;gap:4px;background:rgba(15,23,42,0.92);border:1.5px solid var(--chip);border-radius:4px;padding:1px 6px;box-shadow:0 2px 6px rgba(0,0,0,0.7);margin-bottom:2px;white-space:nowrap;backdrop-filter:blur(2px)}
.enemy-token.is-selected .token-tag{border-color:var(--sel);background:rgba(2,132,199,0.95);box-shadow:0 0 10px var(--sel)}
.enemy-token.is-boss .token-tag{border-color:#f59e0b;background:rgba(120,53,15,0.95);box-shadow:0 0 12px rgba(245,158,11,0.6)}

.token-num{font-size:9.5px;font-weight:800;color:#fff}
.token-name{font-size:9px;font-weight:700;color:#e2e8f0;max-width:85px;overflow:hidden;text-overflow:ellipsis}
.token-hp-bar{width:42px;height:3.5px;background:rgba(0,0,0,0.8);border-radius:2px;overflow:hidden;margin-bottom:2px;border:0.5px solid rgba(255,255,255,0.2)}
.token-hp-fill{height:100%;background:var(--ok)}

.token-sprite-wrap{display:flex;justify-content:center;align-items:flex-end;position:relative}
.token-sprite-img{display:block;image-rendering:pixelated;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.75));transition:filter .15s ease, transform .15s ease;pointer-events:none}
.enemy-token:hover .token-sprite-img{filter:drop-shadow(0 0 6px var(--ok)) drop-shadow(0 4px 8px rgba(0,0,0,0.85))}
.enemy-token.is-selected .token-sprite-img{filter:drop-shadow(0 0 8px var(--sel)) drop-shadow(0 0 2px #fff);transform:scale(1.04)}
.enemy-token.is-boss .token-sprite-img{filter:drop-shadow(0 0 8px #f59e0b) drop-shadow(0 4px 10px rgba(0,0,0,0.9))}

.token-shadow{position:absolute;bottom:-4px;width:38px;height:9px;border-radius:50%;background:radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 75%);z-index:-1;pointer-events:none}
.token-coords{position:absolute;bottom:-18px;font-size:8.5px;white-space:nowrap;background:rgba(0,0,0,0.85);color:#cbd5e1;padding:1px 4px;border-radius:3px;font-family:ui-monospace,Consolas,monospace;pointer-events:none}
.enemy-token.is-selected .token-coords{background:var(--sel);color:#000;font-weight:700}

/* Stage Boss Status Banner */
.stage-boss-banner{background:linear-gradient(90deg, rgba(30,27,75,0.85) 0%, rgba(15,23,42,0.9) 100%);border:1px solid rgba(245,158,11,0.5);border-radius:6px;padding:6px 12px;margin-bottom:10px;display:flex;align-items:center;gap:12px;box-shadow:0 0 14px rgba(245,158,11,0.12)}
.stage-boss-avatar{height:42px;width:auto;image-rendering:pixelated;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.7))}

`;
  html = html.slice(0, idxCssStart) + newCss + html.slice(idxCssEnd);
  console.log('✓ Updated CSS for enemy tokens and boss banner.');
} else {
  console.error('Could not find CSS block for enemy tokens!');
}

// 2. Replace getEnemyAvatarSvg with ENEMY_SPRITE_FILES, ENEMY_SPRITE_DIMS, STAGE_BOSSES, and sprite helpers
const targetSvgStart = '// ===== Gerador de Sprites e Avatares Vetoriais dos Inimigos =====';
const targetSvgEnd = '// ===== Renderizador de Cenário Pixel-Art do Jogo (Canvas) =====';
const idxSvgStart = html.indexOf(targetSvgStart);
const idxSvgEnd = html.indexOf(targetSvgEnd, idxSvgStart);

if (idxSvgStart !== -1 && idxSvgEnd !== -1) {
  const newSpriteCode = `// ===== Banco de Sprites Autênticos (PNG e GIF de img/enemies/) =====
const ENEMY_SPRITE_FILES = {
  // Round 1 palette (Base 0x00)
  5: 'img/enemies/billybrown body.png',
  6: 'img/enemies/MAY purple.png',
  7: 'img/enemies/andore red.png',
  8: 'img/enemies/dirk olive clothes.png',
  9: 'img/enemies/hunter orange.png',
  10: 'img/enemies/G organe clothes.png',
  11: 'img/enemies/JOE black.png',
  14: 'img/enemies/fat jack pink sweater.png',
  15: 'img/enemies/fritz.png',
  16: 'img/enemies/RAY gray.png',
  17: 'img/enemies/RICK black clothes.png',
  18: 'img/enemies/johnny blue.png',
  19: 'img/enemies/arby redbrick.png',
  20: 'img/enemies/dave.gif',
  21: 'img/enemies/callman.gif',
  22: 'img/enemies/caine.png',
  23: 'img/enemies/drake.png',
  24: 'img/enemies/wong.png',
  25: 'img/enemies/Stray.png',
  26: 'img/enemies/black_stand.gif',

  // Round 2 palette (+0x40 = 64)
  69: 'img/enemies/billy white body.png',
  70: 'img/enemies/MAY orange.png',
  71: 'img/enemies/andore brown.png',
  72: 'img/enemies/dirk green body.png',
  73: 'img/enemies/hunter green.png',
  74: 'img/enemies/G gray clothe.png',
  75: 'img/enemies/JOE pink.png',
  78: 'img/enemies/fat jack red sweater.png',
  79: 'img/enemies/fritz.png',
  80: 'img/enemies/RAY orange.png',
  81: 'img/enemies/RICK green body.png',
  82: 'img/enemies/johnny brown.png',
  83: 'img/enemies/arby red.png',
  84: 'img/enemies/dave.gif',
  85: 'img/enemies/callman.gif',
  86: 'img/enemies/caine.png',
  87: 'img/enemies/drake.png',
  88: 'img/enemies/wong.png',
  89: 'img/enemies/Stray.png',
  90: 'img/enemies/black_stand.gif',

  // Round 3 palette (+0x80 = 128)
  133: 'img/enemies/billy orange clolthe.png',
  134: 'img/enemies/MAY gray.png',
  135: 'img/enemies/andore green.png',
  136: 'img/enemies/dirk olivedrab.png',
  137: 'img/enemies/hunter blue.png',
  138: 'img/enemies/G green clothe.png',
  139: 'img/enemies/JOE darkgreen.png',
  142: 'img/enemies/fat jack black sweater.png',
  143: 'img/enemies/fritz.png',
  144: 'img/enemies/RAY gray.png',
  145: 'img/enemies/RICK green clothe.png',
  146: 'img/enemies/johnny gray.png',
  147: 'img/enemies/arby blue.png',
  148: 'img/enemies/dave.gif',
  149: 'img/enemies/callman.gif',
  150: 'img/enemies/caine.png',
  151: 'img/enemies/drake.png',
  152: 'img/enemies/wong.png',
  153: 'img/enemies/Stray.png',
  154: 'img/enemies/black_stand.gif',

  // Round 4/5/6 palette (+0xC0 = 192)
  197: 'img/enemies/billy green clothe.png',
  198: 'img/enemies/MAY blue.png',
  199: 'img/enemies/andore blue.png',
  200: 'img/enemies/dirk blue clothes.png',
  201: 'img/enemies/hunter gray.png',
  202: 'img/enemies/G darkgray clothe.png',
  203: 'img/enemies/JOE green.png',
  206: 'img/enemies/fat jack blue clothes.png',
  207: 'img/enemies/fritz.png',
  208: 'img/enemies/RAY darkgreen.png',
  209: 'img/enemies/RICK blue clothes.png',
  210: 'img/enemies/johnny olive.png',
  211: 'img/enemies/arby green.png',
  212: 'img/enemies/dave.gif',
  213: 'img/enemies/callman.gif',
  214: 'img/enemies/caine.png',
  215: 'img/enemies/drake.png',
  216: 'img/enemies/wong.png',
  217: 'img/enemies/Stray.png',
  218: 'img/enemies/black_stand.gif'
};

const ENEMY_SPRITE_DIMS = {
  "andore blue.png": [50, 104],
  "andore brown.png": [50, 104],
  "andore green.png": [50, 103],
  "andore red.png": [50, 104],
  "arby blue.png": [55, 80],
  "arby green.png": [55, 80],
  "arby red.png": [55, 80],
  "arby redbrick.png": [55, 80],
  "billy green clothe.png": [31, 85],
  "billy orange clolthe.png": [31, 85],
  "billy white body.png": [31, 84],
  "billybrown body.png": [31, 84],
  "black_stand.gif": [103, 109],
  "caine.png": [61, 96],
  "callman.gif": [67, 103],
  "dave.gif": [60, 101],
  "dirk blue clothes.png": [70, 88],
  "dirk green body.png": [62, 89],
  "dirk olive clothes.png": [62, 89],
  "dirk olivedrab.png": [62, 89],
  "drake.png": [86, 98],
  "fat jack black sweater.png": [55, 81],
  "fat jack blue clothes.png": [55, 81],
  "fat jack pink sweater.png": [64, 80],
  "fat jack red sweater.png": [64, 80],
  "fritz.png": [41, 70],
  "G darkgray clothe.png": [42, 77],
  "G gray clothe.png": [42, 78],
  "G green clothe.png": [42, 77],
  "G organe clothes.png": [40, 78],
  "hunter blue.png": [40, 90],
  "hunter gray.png": [40, 91],
  "hunter green.png": [42, 91],
  "hunter orange.png": [42, 91],
  "JOE black.png": [41, 61],
  "JOE darkgreen.png": [47, 58],
  "JOE green.png": [41, 61],
  "JOE pink.png": [41, 61],
  "johnny blue.png": [33, 80],
  "johnny brown.png": [33, 80],
  "johnny gray.png": [33, 79],
  "johnny olive.png": [33, 80],
  "MAY blue.png": [43, 85],
  "MAY gray.png": [42, 85],
  "MAY orange.png": [42, 85],
  "MAY purple.png": [43, 85],
  "RAY darkgreen.png": [31, 85],
  "RAY gray.png": [31, 85],
  "RAY orange.png": [31, 85],
  "RICK black clothes.png": [70, 90],
  "RICK blue clothes.png": [62, 91],
  "RICK green body.png": [70, 90],
  "RICK green clothe.png": [62, 91],
  "Stray.png": [65, 97],
  "wong.png": [58, 100]
};

const STAGE_BOSSES = {
  3: { id: 20, name: 'DAVE', file: 'img/enemies/dave.gif', desc: 'Chefe Policial de Metro City (Round 1)' },
  6: { id: 21, name: 'CALLMAN', file: 'img/enemies/callman.gif', desc: 'Chefe dos Telhados / Back Alley (Round 2)' },
  7: { id: 21, name: 'CALLMAN', file: 'img/enemies/callman.gif', desc: 'Chefe do Club Capcom / Bar Secreto (Round 2)' },
  12: { id: 22, name: 'CAINE', file: 'img/enemies/caine.png', desc: 'Chefe do Teto do Ônibus (Round 3)' },
  17: { id: 23, name: 'DRAKE', file: 'img/enemies/drake.png', desc: 'Chefe do Front Deck do Navio (Round 4A)' },
  22: { id: 24, name: 'WONG', file: 'img/enemies/wong.png', desc: 'Chefe da Cozinha de Chinatown (Round 4B)' },
  27: { id: 24, name: 'WONG', file: 'img/enemies/wong.png', desc: 'Subchefe da Cozinha da Fábrica (Round 5)' },
  34: { id: 25, name: 'STRAY', file: 'img/enemies/Stray.png', desc: 'Chefe do Guindaste da Fábrica (Round 5)' },
  42: { id: 26, name: 'BLACK', file: 'img/enemies/black_stand.gif', desc: 'Líder da Skull Cross / Chefe Final (Round 6)' }
};

function getEnemySpriteImg(type){
  if(ENEMY_SPRITE_FILES[type]) return ENEMY_SPRITE_FILES[type];
  const baseT = type & 0x3F;
  if(ENEMY_SPRITE_FILES[baseT]) return ENEMY_SPRITE_FILES[baseT];
  return null;
}

function getEnemyVisualHtml(type, zoom){
  const file = getEnemySpriteImg(type);
  if(file){
    const baseName = file.replace('img/enemies/', '');
    const dims = ENEMY_SPRITE_DIMS[baseName] || [45, 85];
    const w = Math.round(dims[0] * zoom);
    const h = Math.round(dims[1] * zoom);
    return \`<img src="\${encodeURI(file)}" class="token-sprite-img" style="width:\${w}px;height:\${h}px;" alt="" draggable="false">\`;
  }
  const t = type & 0x3F;
  if(t === 27) return \`<span style="font-size:\${Math.round(26*zoom)}px;line-height:1">🪣</span>\`;
  if(t === 28) return \`<span style="font-size:\${Math.round(26*zoom)}px;line-height:1">🪴</span>\`;
  if(t === 29) return \`<span style="font-size:\${Math.round(26*zoom)}px;line-height:1">📦</span>\`;
  if(t === 30) return \`<span style="font-size:\${Math.round(26*zoom)}px;line-height:1">🏺</span>\`;
  if(t === 31) return \`<span style="font-size:\${Math.round(26*zoom)}px;line-height:1">🛢️</span>\`;
  if(t === 43) return \`<span style="font-size:\${Math.round(26*zoom)}px;line-height:1">🔥🛢️</span>\`;
  return \`<span style="font-size:\${Math.round(22*zoom)}px;line-height:1">🥋</span>\`;
}

function getEnemyVisualTableHtml(type){
  const file = getEnemySpriteImg(type);
  if(file){
    return \`<img src="\${encodeURI(file)}" class="table-sprite-thumb" style="height:24px;width:auto;image-rendering:pixelated;vertical-align:middle;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.8));" alt="">\`;
  }
  const t = type & 0x3F;
  if(t === 27) return '<span style="font-size:16px;">🪣</span>';
  if(t === 28) return '<span style="font-size:16px;">🪴</span>';
  if(t === 29) return '<span style="font-size:16px;">📦</span>';
  if(t === 30) return '<span style="font-size:16px;">🏺</span>';
  if(t === 31) return '<span style="font-size:16px;">🛢️</span>';
  if(t === 43) return '<span style="font-size:16px;">🔥🛢️</span>';
  return '<span style="font-size:14px;">🥋</span>';
}

function getEnemyAvatarSvg(type){
  return getEnemyVisualHtml(type, 1);
}

`;
  html = html.slice(0, idxSvgStart) + newSpriteCode + html.slice(idxSvgEnd);
  console.log('✓ Replaced getEnemyAvatarSvg with authentic sprite system.');
} else {
  console.error('Could not find SVG code block!');
}

// 3. Update renderSide to display crown on boss stages
const sideModTarget = "const doorCount = SECRET_CONFIG.enabled ? SECRET_DOORS.filter(d=>d.srcStage===(s.row+1)).length : 0;";
const idxSideMod = html.indexOf(sideModTarget);
if (idxSideMod !== -1) {
  const replacement = `const doorCount = SECRET_CONFIG.enabled ? SECRET_DOORS.filter(d=>d.srcStage===(s.row+1)).length : 0;
    const stageCurId = s.id || (s.row + 1);
    const bossMeta = STAGE_BOSSES[stageCurId];
    const bossBadge = bossMeta ? \`<span title="Chefe da Fase: \${bossMeta.name}" style="color:#f59e0b;font-size:11px;margin-left:3px;">👑</span>\` : '';`;
  html = html.replace(sideModTarget, replacement);
  html = html.replace('${areaLabel(s.row+1)} ${doorBadge}', '${areaLabel(s.row+1)} ${doorBadge} ${bossBadge}');
  console.log('✓ Updated renderSide with boss crown badges.');
} else {
  console.error('Could not find renderSide target!');
}

// 4. In render(), add Boss Banner and wire table thumbnails and boss actions
const renderTopTarget = "let html=`${secretHtml}\n  ${customBgHtml}";
const idxRenderTop = html.indexOf(renderTopTarget);
if (idxRenderTop !== -1) {
  const bossBannerCode = `// Chefe da Fase (se aplicável para este Round/Fase)
  const curStageId = (s.row != null ? s.row + 1 : s.id);
  const bossMeta = STAGE_BOSSES[curStageId];
  let bossHtml = '';
  if(bossMeta){
    const bossIdx = s.items.findIndex(it => it.t === 'rec' && ((it.b[4] & 0x3F) >= 20 && (it.b[4] & 0x3F) <= 26));
    const bossPresent = (bossIdx >= 0);
    const bossItem = bossPresent ? s.items[bossIdx] : null;
    const bossHp = bossItem ? rec.hp(bossItem.b) : 120;
    const bossX = bossItem ? Math.round(rec.x(bossItem.b)/16) : 0;
    const bossY = bossItem ? Math.round(rec.y(bossItem.b)/16) : 0;

    bossHtml = \`
    <div class="stage-boss-banner">
      <img src="\${encodeURI(bossMeta.file)}" class="stage-boss-avatar" alt="\${bossMeta.name}">
      <div>
        <div style="display:flex;align-items:center;gap:8px;">
          <b style="color:#f59e0b;font-size:12px;">👑 CHEFE DA FASE: \${bossMeta.name}</b>
          \${bossPresent ? \`<span class="pill" style="background:#f59e0b;color:#000;font-weight:bold;font-size:10px;">Ativo no Cenário (#\${bossIdx+1} · HP: \${bossHp} · X:\${bossX} Y:\${bossY})</span>\` : \`<span class="pill" style="background:#64748b;color:#fff;font-size:10px;">Não inserido nesta área</span>\`}
        </div>
        <span class="hint" style="color:#94a3b8;font-size:11px;">\${bossMeta.desc}</span>
      </div>
      <div style="margin-left:auto;display:flex;gap:6px;">
        \${bossPresent ? 
          \`<button id="btnFocusBoss" class="sec" style="font-size:11px;padding:3px 10px;" data-boss-idx="\${bossIdx}">🎯 Focar no Chefe (#\${bossIdx+1})</button>\` :
          \`<button id="btnAddBoss" class="sec" style="font-size:11px;padding:3px 10px;border-color:#f59e0b;color:#f59e0b;">+ Inserir \${bossMeta.name} no Cenário</button>\`
        }
      </div>
    </div>\`;
  }

  let html=\`\${secretHtml}
  \${customBgHtml}
  \${bossHtml}`;
  html = html.replace(renderTopTarget, bossBannerCode);
  console.log('✓ Added stage-boss-banner to render().');
} else {
  console.error('Could not find renderTopTarget!');
}

// 5. In table, add getEnemyVisualTableHtml next to select
const tableSpriteOld = '<td><select data-i="${i}" data-f="type">${spOpts(b[4])}</select></td>';
const tableSpriteNew = `<td style="white-space:nowrap;"><span style="display:inline-flex;align-items:center;gap:6px;">\${getEnemyVisualTableHtml(b[4])}<select data-i="\${i}" data-f="type">\${spOpts(b[4])}</select></span></td>`;
if (html.includes(tableSpriteOld)) {
  html = html.replace(tableSpriteOld, tableSpriteNew);
  console.log('✓ Added sprite thumbnail to table rows.');
} else {
  console.error('Could not find tableSpriteOld!');
}

// 6. In renderBoardTokens, fix absolute coordinate positioning and render real sprites
const oldBoardTokenTargetStart = "const worldX = isPano ? ((effectiveTrig/16) + xPx) : (xPx + 70);";
const oldBoardTokenTargetEnd = "setupTokenDrag(token, s, i);";
const idxBTStart = html.indexOf(oldBoardTokenTargetStart);
const idxBTEnd = html.indexOf(oldBoardTokenTargetEnd, idxBTStart);

if (idxBTStart !== -1 && idxBTEnd !== -1) {
  const newBoardTokenBlock = `const isAbs = (b[10] === 1);
    const isBoss = ((b[4] & 0x3F) >= 20 && (b[4] & 0x3F) <= 26);

    let worldX;
    if(isAbs){
      worldX = isPano ? xPx : (xPx - (effectiveTrig/16) + 70);
    } else {
      worldX = isPano ? ((effectiveTrig/16) + xPx) : (xPx + 70);
    }
    const tokenX = worldX * BOARD_ZOOM;
    const tokenY = yPx * BOARD_ZOOM;

    const token=document.createElement('div');
    token.className=\`enemy-token \${isBoss?'is-boss':''} \${isSel?'is-selected':''} \${isDimmed?'dimmed':''}\`;
    token.style.left=\`\${tokenX}px\`;
    token.style.top=\`\${tokenY}px\`;
    token.dataset.idx=i;

    const col=enemyColor(b[4]);
    const em=enemyEmoji(b[4]);
    const name=sName(b[4]&0xBF);
    const hp=rec.hp(b);
    const maxHp=Math.max(hp, 100);
    const hpPct=Math.min(100, Math.round((hp/maxHp)*100));

    token.innerHTML=\`
      <div class="token-tag">
        <span class="token-num">\${isBoss ? '👑 ' : ''}#\${i+1}</span>
        <span class="token-name" title="\${name}">\${name}</span>
      </div>
      <div class="token-hp-bar">
        <div class="token-hp-fill" style="width:\${hpPct}%;background:\${col}"></div>
      </div>
      <div class="token-sprite-wrap">
        \${getEnemyVisualHtml(b[4], BOARD_ZOOM)}
      </div>
      <div class="token-shadow"></div>
      <div class="token-coords">\${isPano ? (isAbs ? 'Mundo X:' + Math.round(worldX) : 'Mundo X:' + Math.round(worldX)) : 'Tela X:' + Math.round(xPx)} Y:\${Math.round(yPx)}</div>
    \`;

    // Se clicar em um chefe que está em outra onda, foca nele
    if(isBoss && isDimmed){
      token.onclick = (e) => {
        ACTIVE_WAVE = '' + itemWave;
        selectEnemy(i);
        render();
      };
    }

    `;
  html = html.slice(0, idxBTStart) + newBoardTokenBlock + html.slice(idxBTEnd);
  console.log('✓ Updated renderBoardTokens with real standing sprites and fixed absolute coordinates.');
} else {
  console.error('Could not find renderBoardTokens target!');
}

// 7. In setupTokenDrag, fix dragging coordinates for absolute positions
const oldDragMoveStart = 'const curWorldX = curLeft / BOARD_ZOOM;\n    const gameXPx = isPano ? Math.round(curWorldX - trigPx) : Math.round(curWorldX - 70);';
const idxDM = html.indexOf(oldDragMoveStart);
if (idxDM !== -1) {
  const newDragMove = `const isAbs = (s.items[idx].b[10] === 1);
    const curWorldX = curLeft / BOARD_ZOOM;
    const gameXPx = isAbs ? Math.round(curWorldX) : (isPano ? Math.round(curWorldX - trigPx) : Math.round(curWorldX - 70));`;
  html = html.replace(oldDragMoveStart, newDragMove);
  console.log('✓ Updated setupTokenDrag pointermove for absolute positions.');
} else {
  console.error('Could not find oldDragMoveStart!');
}

const oldDragEndStart = 'const curWorldX = curLeft / BOARD_ZOOM;\n    const gameXPx = isPano ? Math.round(curWorldX - trigPx) : Math.round(curWorldX - 70);\n    const gameYPx = Math.round(curTop / BOARD_ZOOM);\n\n    setW(s.items[idx].b, 11, gameXPx * 16);';
const idxDE = html.indexOf(oldDragEndStart);
if (idxDE !== -1) {
  const newDragEnd = `const isAbs = (s.items[idx].b[10] === 1);
    const curWorldX = curLeft / BOARD_ZOOM;
    const gameXPx = isAbs ? Math.round(curWorldX) : (isPano ? Math.round(curWorldX - trigPx) : Math.round(curWorldX - 70));
    const gameYPx = Math.round(curTop / BOARD_ZOOM);

    setW(s.items[idx].b, 11, gameXPx * 16);`;
  html = html.replace(oldDragEndStart, newDragEnd);
  console.log('✓ Updated setupTokenDrag endDrag for absolute positions.');
} else {
  console.error('Could not find oldDragEndStart!');
}

// 8. In updateSelectedLabel, add sprite thumbnail
const oldSelLabelTarget = 'lbl.innerHTML=`Inimigo selecionado: <b style="color:var(--warn)">#${SELECTED_IDX+1} ${name}</b> (X: ${xPx}px, Y: ${yPx}px)`;';
const idxSL = html.indexOf(oldSelLabelTarget);
if (idxSL !== -1) {
  const newSelLabel = `const spriteImg = getEnemySpriteImg(b[4]);
    const isBoss = ((b[4] & 0x3F) >= 20 && (b[4] & 0x3F) <= 26);
    lbl.innerHTML=\`
      <div style="display:flex;align-items:center;gap:10px;">
        \${spriteImg ? \`<img src="\${encodeURI(spriteImg)}" style="height:36px;image-rendering:pixelated;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.8));">\` : ''}
        <div>
          <span>Inimigo selecionado:</span>
          <b style="color:\${isBoss?'#f59e0b':'var(--warn)'}">\${isBoss?'👑 ':''}#\${SELECTED_IDX+1} \${name}</b>
          <span class="hint" style="margin-left:6px;">(X: \${xPx}px, Y: \${yPx}px · Vida: \${rec.hp(b)})</span>
        </div>
      </div>\`;`;
  html = html.replace(oldSelLabelTarget, newSelLabel);
  console.log('✓ Updated updateSelectedLabel with sprite thumbnail.');
} else {
  console.error('Could not find oldSelLabelTarget!');
}

// 9. Add insertBossIntoStage helper and boss button listeners
const listenersEndTarget = "const bRecloneTop = $('#btnRecloneTop');";
const idxLT = html.indexOf(listenersEndTarget);
if (idxLT !== -1) {
  const bossListenerCode = `const bFocus = $('#btnFocusBoss');
  if(bFocus){
    bFocus.onclick = () => {
      const bIdx = +bFocus.dataset.bossIdx;
      selectEnemy(bIdx);
      const bItem = s.items[bIdx];
      if(bItem){
        const isAbs = (bItem.b[10] === 1);
        const trigPx = rec.trig(bItem.b) / 16;
        const xPx = rec.x(bItem.b) / 16;
        const wX = isAbs ? xPx : (trigPx + xPx);
        const vp = $('#boardViewport');
        if(vp) vp.scrollTo({ left: Math.max(0, (wX - 250) * BOARD_ZOOM), behavior: 'smooth' });
      }
    };
  }
  const bAddBoss = $('#btnAddBoss');
  if(bAddBoss && bossMeta){
    bAddBoss.onclick = () => {
      insertBossIntoStage(s, bossMeta);
    };
  }

  const bRecloneTop = $('#btnRecloneTop');`;
  html = html.replace(listenersEndTarget, bossListenerCode);
  console.log('✓ Wired boss focus and add listeners in render().');
} else {
  console.error('Could not find listenersEndTarget!');
}

// Add function insertBossIntoStage right before renderBoardTokens
const rbtTarget = 'function renderBoardTokens(s){';
const idxRBT = html.indexOf(rbtTarget);
if (idxRBT !== -1) {
  const insertBossFunc = `function insertBossIntoStage(s, bossMeta){
  const bossType = bossMeta.id; // 20 Dave, 21 Callman, etc.
  const bgW = STAGE_BG_WIDTHS[s.id] || 768;
  const targetX = Math.max(300, Math.round(bgW - 120));
  const targetY = 176;
  const newBossRec = [0, 0, 0x00, 0x08, bossType, 4, 0x8A, 120, 0, 0, 1, 0, 0, 0, 0, 0, 0];
  setW(newBossRec, 11, targetX * 16);
  setW(newBossRec, 13, targetY * 16);
  setW(newBossRec, 2, Math.max(0, targetX - 250) * 16);
  
  const cmdIdx = s.items.findIndex(it => it.t === 'cmd' && it.b[0] === 0xFF);
  if(cmdIdx >= 0){
    s.items.splice(cmdIdx, 0, { t: 'rec', b: newBossRec });
  } else {
    s.items.push({ t: 'rec', b: newBossRec });
  }
  render();
  const addedIdx = s.items.findIndex(it => it.b === newBossRec);
  if(addedIdx >= 0) selectEnemy(addedIdx);
}

function renderBoardTokens(s){`;
  html = html.replace(rbtTarget, insertBossFunc);
  console.log('✓ Added insertBossIntoStage function.');
} else {
  console.error('Could not find renderBoardTokens function target!');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated FF3_Script_Editor.html with enemy sprites and boss features!');

