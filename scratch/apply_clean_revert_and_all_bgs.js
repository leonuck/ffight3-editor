const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve('FF3_Script_Editor.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Remove BAR_PALETTES, sound bank helpers, and custom GFX loader script
const pAudioStart = html.indexOf('const BAR_PALETTES = {');
const pAudioEnd = html.indexOf('function buildRom(orig,st,opts){');
if (pAudioStart !== -1 && pAudioEnd !== -1) {
  html = html.slice(0, pAudioStart) + html.slice(pAudioEnd);
  console.log('Removed BAR_PALETTES, sound bank helpers, and custom GFX loader.');
} else {
  console.error('Could not find BAR_PALETTES or buildRom!');
}

// 2. In buildRom, replace the custom bg/sound hook injection for Stage 44
const targetBuildRomStart = 'log.push(\'Engine: Fase 44 registrada na tabela C3:42B3 (Template visual: Fase \' + tplStageId + \')\');';
const targetBuildRomEnd = 'for(const s of st.stages){';
const idxBuildStart = html.indexOf(targetBuildRomStart);
const idxBuildEnd = html.indexOf(targetBuildRomEnd, idxBuildStart);

if (idxBuildStart !== -1 && idxBuildEnd !== -1) {
  const replacement = `log.push('Engine: Fase 44 registrada na tabela C3:42B3 (Cenário e áudio clonados da Fase ' + tplStageId + ')');
    }
  }

  // Restaura C0:0120 para o código original do jogo (STA $1F03 / CMP #$48)
  rom[0x000120 + h] = 0x8D;
  rom[0x000121 + h] = 0x03;
  rom[0x000122 + h] = 0x1F;
  rom[0x000123 + h] = 0xC9;
  rom[0x000124 + h] = 0x48;

  `;
  html = html.slice(0, idxBuildStart) + replacement + html.slice(idxBuildEnd);
  console.log('Reverted Stage 44 buildRom to clean cloning and restored C0:0120.');
} else {
  console.error('Could not find target block in buildRom!');
}

// 3. Complete STAGE_BG_IMAGES with all 42 stages and define STAGE_BG_WIDTHS
const fullStageImagesAndWidths = `const STAGE_BG_IMAGES = {
  1: 'img/round_1_fase_1.png',
  2: 'img/round_1_fase_2.png',
  3: 'img/round_1_fase_3_chefe.png',
  4: 'img/round_2_main_4.png',
  5: 'img/round_2_main_5.png',
  6: 'img/round_2_main_6.png',
  7: 'img/round_2_main_7.png',
  8: 'img/round_3_main_8.png',
  9: 'img/round_3_main_9.png',
  10: 'img/round_4a_main_10.png',
  11: 'img/round_3_main_11.png',
  12: 'img/round_3_main_12.png',
  13: 'img/round_4a_main_13.png',
  14: 'img/round_4a_main_14.png',
  15: 'img/round_4a_main_15.png',
  16: 'img/round_4a_main_16.png',
  17: 'img/round_4a_main_17.png',
  18: 'img/bonus_1-main_18.png',
  19: 'img/round_4b_main_19.png',
  20: 'img/round_4b_main_20.png',
  21: 'img/round_4b_main_21.png',
  22: 'img/round_4b_main_22.png',
  23: 'img/round_4b_main_23.png',
  24: 'img/round_4b_main_24.png',
  25: 'img/round_4b_main_25.png',
  26: 'img/round_4b_main_26.png',
  27: 'img/round_4b_main_27.png',
  28: 'img/round_5_main_28.png',
  29: 'img/round_5_main_29.png',
  30: 'img/round_5_main_30.png',
  31: 'img/round_5_main_31.png',
  32: 'img/round_5_main_32.png',
  33: 'img/round_5_main_33.png',
  34: 'img/round_5_main_34.png',
  35: 'img/bonus_2_main_35.png',
  36: 'img/round_5_main_36.png',
  37: 'img/round_5_main_37.png',
  38: 'img/round_5_main_38.png',
  39: 'img/round_5_main_39.png',
  40: 'img/round_5_main_40.png',
  41: 'img/round_5_main_41.png',
  42: 'img/round_5_main_42.png'
};

const STAGE_BG_WIDTHS = {
  1: 1024,
  2: 1023,
  3: 768,
  4: 768,
  5: 1023,
  6: 768,
  7: 768,
  8: 768,
  9: 512,
  10: 384,
  11: 768,
  12: 512,
  13: 712,
  14: 896,
  15: 512,
  16: 512,
  17: 464,
  18: 436,
  19: 768,
  20: 1017,
  21: 768,
  22: 512,
  23: 1006,
  24: 768,
  25: 1017,
  26: 768,
  27: 512,
  28: 730,
  29: 768,
  30: 256,
  31: 256,
  32: 1024,
  33: 768,
  34: 1280,
  35: 512,
  36: 1104,
  37: 1024,
  38: 328,
  39: 328,
  40: 256,
  41: 1216,
  42: 767
};`;

const idxBgImagesStart = html.indexOf('const STAGE_BG_IMAGES = {');
const idxBgImagesEnd = html.indexOf('const STAGE_BG_CACHE = {};', idxBgImagesStart);

if (idxBgImagesStart !== -1 && idxBgImagesEnd !== -1) {
  html = html.slice(0, idxBgImagesStart) + fullStageImagesAndWidths + '\n' + html.slice(idxBgImagesEnd);
  console.log('Replaced STAGE_BG_IMAGES and added STAGE_BG_WIDTHS.');
} else {
  console.error('Could not find STAGE_BG_IMAGES!');
}

// 4. Remove getInitialBgCustom
const idxGetInitStart = html.indexOf('function getInitialBgCustom(tplStageId){');
const idxGetInitEnd = html.indexOf('function drawStageBackground(canvas, stage, totalW, totalH, zoom){');
if (idxGetInitStart !== -1 && idxGetInitEnd !== -1) {
  html = html.slice(0, idxGetInitStart) + html.slice(idxGetInitEnd);
  console.log('Removed getInitialBgCustom.');
} else {
  console.error('Could not find getInitialBgCustom!');
}

// 5. Clean drawStageBackground to use STAGE_BG_WIDTHS and remove table/palette overlays
const drawBgStart = html.indexOf('function drawStageBackground(canvas, stage, totalW, totalH, zoom){');
const drawBgImgCheck = html.indexOf('if(bgImg && bgImg.complete && bgImg.naturalWidth > 0){', drawBgStart);
const drawBgFallback = html.indexOf('const isStage1 = (stageId === 1);', drawBgImgCheck);

if (drawBgImgCheck !== -1 && drawBgFallback !== -1) {
  const newBgDrawBlock = `if(bgImg && bgImg.complete && bgImg.naturalWidth > 0){
    const isPano = (BOARD_VIEW_MODE === 'pano');
    const imgW = STAGE_BG_WIDTHS[targetImgId] || bgImg.naturalWidth || 1024;
    const imgH = Math.min(bgImg.naturalHeight || 190, 190);

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

      ctx.drawImage(bgImg, camX, 0, 256, imgH, 70, 34, 256, 190);
    }

    ctx.restore();
    return;
  }

  `;
  html = html.slice(0, drawBgImgCheck) + newBgDrawBlock + html.slice(drawBgFallback);
  console.log('Cleaned drawStageBackground.');
} else {
  console.error('Could not find drawStageBackground image block!');
}

// 6. In createCustomSecretStage, clean bgCustom property
html = html.replace('ST.stages[existingIdx].bgCustom = getInitialBgCustom(tplStageId);', '');
html = html.replace('bgCustom: getInitialBgCustom(tplStageId)', '');

// 7. In render(), simplify customBgHtml to clean Stage 44 banner and button
const renderStart = html.indexOf('function render(){');
const customBgStart = html.indexOf('// Painel de Customização de Cenário da Fase 44', renderStart);
const headerStart = html.indexOf('// Header da Fase', customBgStart);

if (customBgStart !== -1 && headerStart !== -1) {
  const newCustomBg = `// Banner Informativo da Fase 44 (Sala Secreta Clonada)
  let customBgHtml = '';
  if(s.id === 44){
    const tplId = s.templateStage || 7;
    const tplName = (STAGE_NAMES.find(st => st.id === tplId) || {}).name || ('Fase ' + tplId);
    customBgHtml = \`
    <div class="secret-panel" style="border-color:rgba(16,185,129,0.5);margin-bottom:12px;background:var(--panel);">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:16px;">⚡</span>
          <div>
            <b style="color:var(--ok)">Sala Secreta Customizada (Fase 44)</b>
            <span class="hint" style="margin-left:8px;">Cenário e áudio clonados da: <b>\${tplName}</b></span>
          </div>
        </div>
        <button id="btnRecloneTop" class="sec" style="font-size:11px;padding:4px 10px;">🔄 Clonar Outra Fase para a Fase 44</button>
      </div>
    </div>\`;
  }

  `;
  html = html.slice(0, customBgStart) + newCustomBg + html.slice(headerStart);
  console.log('Replaced customBgHtml with clean Stage 44 info banner.');
} else {
  console.error('Could not find customBgHtml in render()!');
}

// 8. In render(), update stageLen in panoramic mode to use STAGE_BG_WIDTHS
const targetStageLenStart = 'let stageLen;\n  if(isPano) {';
const targetStageLenEnd = 'const arenaW = Math.round(stageLen * BOARD_ZOOM);';
const idxSLStart = html.indexOf(targetStageLenStart);
const idxSLEnd = html.indexOf(targetStageLenEnd, idxSLStart);

if (idxSLStart !== -1 && idxSLEnd !== -1) {
  const newStageLen = `let stageLen;
  if(isPano) {
    if(targetImgId && STAGE_BG_WIDTHS[targetImgId]) {
      const bgW = STAGE_BG_WIDTHS[targetImgId];
      stageLen = Math.max(bgW, maxTrig + 256);
    } else {
      stageLen = Math.max(1024, maxTrig + 320);
    }
  } else {
    stageLen = 396;
  }
  `;
  html = html.slice(0, idxSLStart) + newStageLen + html.slice(idxSLEnd);
  console.log('Updated stageLen calculation with STAGE_BG_WIDTHS.');
} else {
  console.error('Could not find stageLen calculation!');
}

// 9. Remove bgCustom listeners in render() and add btnRecloneTop
const bgListenersStart = html.indexOf('// Listeners de customização de cenário da Fase 44');
const bgListenersEnd = html.indexOf('// ===== Lógica de Render e Drag dos Tokens no Tabuleiro =====');

if (bgListenersStart !== -1 && bgListenersEnd !== -1) {
  const newListeners = `const bRecloneTop = $('#btnRecloneTop');
  if(bRecloneTop){
    bRecloneTop.onclick = () => {
      openCreateStageModal(true);
    };
  }
}

`;
  html = html.slice(0, bgListenersStart) + newListeners + html.slice(bgListenersEnd);
  console.log('Replaced bgCustom listeners with btnRecloneTop.');
} else {
  console.error('Could not find bgCustom listeners block!');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated FF3_Script_Editor.html');

