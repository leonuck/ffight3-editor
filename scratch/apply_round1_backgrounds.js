const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

// 1. Update CSS for arena floor
const oldFloorCss = `.arena-floor{position:absolute;left:0;right:0;top:150px;height:65px;background:linear-gradient(to bottom, rgba(30,41,59,0.5), rgba(15,23,42,0.8));border-top:1px dashed rgba(245,158,11,0.5);border-bottom:1px solid rgba(245,158,11,0.3);pointer-events:none}
.arena-floor-grid{position:absolute;inset:0;background:repeating-linear-gradient(0deg, transparent, transparent 15px, var(--floor-line) 15px, var(--floor-line) 16px);pointer-events:none}`;

const newFloorCss = `.arena-floor{position:absolute;left:0;right:0;top:150px;height:65px;background:rgba(245,158,11,0.03);border-top:1px dashed rgba(245,158,11,0.45);border-bottom:1px solid rgba(245,158,11,0.3);pointer-events:none}
.arena-floor-grid{position:absolute;inset:0;background:repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(245,158,11,0.06) 15px, rgba(245,158,11,0.06) 16px);pointer-events:none}`;

if (!html.includes(oldFloorCss)) {
  console.error("Could not find oldFloorCss in HTML");
  process.exit(1);
}
html = html.replace(oldFloorCss, newFloorCss);

// 2. Add STAGE_BG_IMAGES and image support in drawStageBackground
const oldDrawTarget = `// ===== Renderizador de Cenário Pixel-Art do Jogo (Canvas) =====
function drawStageBackground(canvas, stage, totalW, totalH, zoom){
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  if(!ctx) return;

  canvas.width = totalW;
  canvas.height = totalH;

  ctx.save();
  ctx.scale(zoom, zoom);
  const w = totalW / zoom;
  const h = totalH / zoom;

  const stageId = (typeof stage === 'number') ? stage : (stage ? stage.id : 1);
  const tplStageId = (stage && stage.templateStage) ? stage.templateStage : stageId;`;

const newDrawTarget = `// ===== Renderizador de Cenário Pixel-Art do Jogo (Canvas) =====
const STAGE_BG_IMAGES = {
  1: 'img/round_1_fase_1.png',
  2: 'img/round_1_fase_2.png',
  3: 'img/round_1_fase_3_chefe.png'
};
const STAGE_BG_CACHE = {};

function getStageBgImage(stageId, onLoaded){
  if(typeof Image === 'undefined') return null;
  const src = STAGE_BG_IMAGES[stageId];
  if(!src) return null;
  if(!STAGE_BG_CACHE[stageId]){
    const img = new Image();
    img.onload = () => {
      if(typeof onLoaded === 'function') onLoaded();
    };
    img.src = src;
    STAGE_BG_CACHE[stageId] = img;
  }
  return STAGE_BG_CACHE[stageId];
}

function drawStageBackground(canvas, stage, totalW, totalH, zoom){
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  if(!ctx) return;

  canvas.width = totalW;
  canvas.height = totalH;

  ctx.save();
  ctx.scale(zoom, zoom);
  const w = totalW / zoom;
  const h = totalH / zoom;

  const stageId = (typeof stage === 'number') ? stage : (stage ? stage.id : 1);
  const tplStageId = (stage && stage.templateStage) ? stage.templateStage : stageId;
  const targetImgId = STAGE_BG_IMAGES[tplStageId] ? tplStageId : (STAGE_BG_IMAGES[stageId] ? stageId : null);

  const bgImg = targetImgId ? getStageBgImage(targetImgId, () => render()) : null;

  if(bgImg && bgImg.complete && bgImg.naturalWidth > 0){
    const isPano = (BOARD_VIEW_MODE === 'pano');
    const imgW = (targetImgId === 3) ? 768 : 1024;

    // SNES Top HUD area (Y: 0..34)
    ctx.fillStyle = '#080a10';
    ctx.fillRect(0, 0, w, 34);
    ctx.strokeStyle = '#1e2436';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 34); ctx.lineTo(w, 34); ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('SNES HUD / STATUS BAR [Y: 0..34 px]', 14, 21);

    if(stageId === 44){
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 9.5px sans-serif';
      ctx.fillText('⚡ SALA SECRETA 44 (CLONADA DA FASE ' + targetImgId + ')', 230, 21);
    }

    if(isPano){
      ctx.drawImage(bgImg, 0, 34, imgW, 190);
      if(w > imgW){
        ctx.fillStyle = '#06070a';
        ctx.fillRect(imgW, 34, w - imgW, 190);
      }
    } else {
      let camX = 0;
      if(ACTIVE_WAVE !== 'all'){
        const wNum = +ACTIVE_WAVE;
        let cW = 0;
        if(stage && stage.items){
          for(const it of stage.items){
            if(it.t === 'cmd') cW++;
            else if(cW === wNum){ camX = rec.trig(it.b) / 16; break; }
          }
        }
      } else if(SELECTED_IDX != null && stage && stage.items && stage.items[SELECTED_IDX] && stage.items[SELECTED_IDX].t === 'rec'){
        camX = rec.trig(stage.items[SELECTED_IDX].b) / 16;
      }
      camX = Math.max(0, Math.min(camX, Math.max(0, imgW - 256)));

      ctx.fillStyle = 'rgba(6, 8, 12, 0.9)';
      ctx.fillRect(0, 34, 70, 190);
      ctx.fillRect(326, 34, 70, 190);

      ctx.drawImage(bgImg, camX, 0, 256, 190, 70, 34, 256, 190);
    }

    ctx.restore();
    return;
  }`;

if (!html.includes(oldDrawTarget)) {
  console.error("Could not find oldDrawTarget in HTML");
  process.exit(1);
}
html = html.replace(oldDrawTarget, newDrawTarget);

// 3. Update stageLen in render()
const oldStageLenTarget = `  // ===== TABULEIRO VISUAL (2D VIEWPORT PANORÂMICO) =====
  let maxTrig = 0;
  s.items.forEach(it => { if(it.t==='rec') maxTrig = Math.max(maxTrig, rec.trig(it.b)/16); });
  const isPano = (BOARD_VIEW_MODE === 'pano');
  const stageLen = isPano ? Math.max(1280, maxTrig + 320) : 396;`;

const newStageLenTarget = `  // ===== TABULEIRO VISUAL (2D VIEWPORT PANORÂMICO) =====
  let maxTrig = 0;
  s.items.forEach(it => { if(it.t==='rec') maxTrig = Math.max(maxTrig, rec.trig(it.b)/16); });
  const isPano = (BOARD_VIEW_MODE === 'pano');

  const curStageId = (s.row != null ? s.row + 1 : s.id);
  const tplStageId = (s && s.templateStage) ? s.templateStage : curStageId;
  const targetImgId = STAGE_BG_IMAGES[tplStageId] ? tplStageId : (STAGE_BG_IMAGES[curStageId] ? curStageId : null);

  let stageLen;
  if(isPano) {
    if(targetImgId) {
      const bgW = (targetImgId === 3) ? 768 : 1024;
      stageLen = Math.max(bgW, maxTrig + 256);
    } else {
      stageLen = Math.max(1024, maxTrig + 320);
    }
  } else {
    stageLen = 396;
  }`;

if (!html.includes(oldStageLenTarget)) {
  console.error("Could not find oldStageLenTarget in HTML");
  process.exit(1);
}
html = html.replace(oldStageLenTarget, newStageLenTarget);

// 4. Update Panorama Button text
const oldBtnPano = `<button id="btnViewPano" class="\${isPano?'pri':''}" style="padding:2px 8px;font-size:11px;border-radius:0;border:none;">🏙️ Rua Panorâmica (1280px)</button>`;
const newBtnPano = `<button id="btnViewPano" class="\${isPano?'pri':''}" style="padding:2px 8px;font-size:11px;border-radius:0;border:none;">🏙️ Panorâmica (\${stageLen}px)</button>`;

if (!html.includes(oldBtnPano)) {
  console.error("Could not find oldBtnPano in HTML");
  process.exit(1);
}
html = html.replace(oldBtnPano, newBtnPano);

fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('✓ Successfully applied Round 1 Background images and styling to FF3_Script_Editor.html!');

