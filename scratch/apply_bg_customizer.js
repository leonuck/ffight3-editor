const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

// 1. Add CSS for Custom Background Panel
const cssMarker = `/* Canvas & View Mode */`;
const customBgCss = `/* Customizador de Cenário da Fase 44 */
.custom-bg-panel{background:var(--panel);border:1px solid rgba(16,185,129,0.4);border-radius:6px;padding:10px 14px;margin-bottom:12px;box-shadow:0 0 14px rgba(16,185,129,0.08)}
.custom-bg-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--line);flex-wrap:wrap;gap:8px}
.custom-bg-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:12px}
.custom-bg-card{background:var(--panel-sub);border:1px solid var(--line);border-radius:5px;padding:8px 10px}
.custom-bg-card h5{margin:0 0 6px 0;font-size:11px;color:var(--ok);display:flex;align-items:center;gap:5px;text-transform:uppercase;letter-spacing:0.5px}
.custom-bg-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:11px}
.custom-bg-row label{flex:1;color:var(--mute)}
.custom-bg-row input[type="range"]{flex:1.4;accent-color:var(--ok)}
.custom-bg-row input[type="text"]{flex:1.4;background:var(--panel);border:1px solid var(--line);color:var(--ink);padding:2px 6px;border-radius:3px;font-size:11px}
.custom-bg-row select{flex:1.4;background:var(--panel);border:1px solid var(--line);color:var(--ink);padding:2px 6px;border-radius:3px;font-size:11px}
.btn-bg-preset{background:var(--chip);border:1px solid var(--line);color:var(--ink);font-size:10.5px;padding:3px 9px;border-radius:4px;cursor:pointer;transition:all .15s}
.btn-bg-preset:hover{background:var(--ok);color:#000;border-color:var(--ok)}

/* Canvas & View Mode */`;

if (!html.includes(cssMarker)) {
  console.error("Could not find cssMarker");
  process.exit(1);
}
html = html.replace(cssMarker, customBgCss);

// 2. Add getInitialBgCustom definition right before drawStageBackground
const fnMarker = `function drawStageBackground(canvas, stage, totalW, totalH, zoom){`;
const helperFn = `function getInitialBgCustom(tplStageId){
  if(tplStageId === 3){
    return {
      type: 'dave',
      windowX: 100,
      windowW: 568,
      deskX: 320,
      deskW: 220,
      lampX: 340,
      carpetColor: '#450a0a',
      wallColor: '#26120b',
      titleText: '⚡ SALA SECRETA 44 · GABINETE EXECUTIVO'
    };
  } else if(tplStageId === 11 || tplStageId === 19 || tplStageId === 21){
    return {
      type: 'china',
      pillarSpacing: 180,
      lanternSpacing: 180,
      wallColor: '#7f1d1d',
      titleText: '⚡ SALA SECRETA 44 · RESTAURANTE CHINÊS'
    };
  } else {
    return {
      type: 'bar',
      counterX: 520,
      counterW: 500,
      neonText: '★ CREEP EATS · SALA SECRETA 44 ★',
      neonColor: '#f43f5e',
      neonBorder: '#ec4899',
      neonX: 160,
      subNeonText: 'COLD BEER',
      subNeonX: 440,
      dartboardX: 110,
      showDartboard: true,
      shelvesStart: 10,
      shelvesEnd: 1050,
      stoolSpacing: 75,
      floorTheme: 'wood'
    };
  }
}

function drawStageBackground(canvas, stage, totalW, totalH, zoom){`;

if (!html.includes(fnMarker)) {
  console.error("Could not find fnMarker");
  process.exit(1);
}
html = html.replace(fnMarker, helperFn);

// 3. Update drawStageBackground to use stage.bgCustom in isBar and isDave
const oldBarDaveBlock = `  if(isBar) {
    // ===== CENÁRIO: BAR "CREEP EATS" (INTERIOR) =====
    // Parede de madeira escura com iluminação âmbar
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 150);
    wallGrad.addColorStop(0, '#150c07');
    wallGrad.addColorStop(1, '#2c180e');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, 150);

    // Painéis de madeira e boiserie na parede
    ctx.strokeStyle = '#180d07';
    ctx.lineWidth = 2;
    for(let px = 0; px < w; px += 64){
      ctx.strokeRect(px + 4, 15, 56, 120);
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(px + 8, 19, 48, 112);
    }

    // Prateleiras de bebidas ao fundo
    for(let sy of [42, 78, 114]){
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, sy, w, 5);
      ctx.fillStyle = '#1c0a02';
      ctx.fillRect(0, sy + 5, w, 2);

      // Garrafas coloridas (Whisky, Vinho, Cerveja, Licor)
      const bottleCols = ['#ef4444', '#10b981', '#f59e0b', '#38bdf8', '#a855f7', '#fbbf24', '#06b6d4'];
      for(let bx = 12; bx < w - 16; bx += 14){
        if((bx + sy) % 7 === 0) continue;
        const col = bottleCols[(bx + sy) % bottleCols.length];
        const bH = 14 + ((bx * 3) % 8);
        ctx.fillStyle = col;
        ctx.fillRect(bx, sy - bH, 7, bH);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(bx + 2, sy - bH - 3, 3, 3);
      }
    }

    // Balcão de atendimento corrido (X: 520 a 1050)
    ctx.fillStyle = '#3b1706';
    ctx.fillRect(520, 115, 500, 32);
    ctx.fillStyle = '#5c2409';
    ctx.fillRect(518, 112, 504, 5);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(520, 142, 500, 3);

    // Banquetes de Bar com assento vermelho acolchoado
    for(let stX = 550; stX <= 1000; stX += 75){
      ctx.fillStyle = '#991b1b';
      ctx.beginPath(); ctx.ellipse(stX, 115, 14, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#64748b'; ctx.fillRect(stX - 2, 121, 4, 25);
      ctx.fillStyle = '#334155'; ctx.beginPath(); ctx.ellipse(stX, 146, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Letreiro Neon Principal no Bar
    ctx.fillStyle = '#0f0502';
    ctx.fillRect(160, 20, 240, 26);
    ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 2;
    ctx.strokeRect(160, 20, 240, 26);
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(stageId === 44 ? '★ CREEP EATS · SALA SECRETA 44 ★' : '★ CREEP EATS · VIP LOUNGE ★', 172, 37);

    // Neon secundário "COLD BEER"
    ctx.fillStyle = '#000';
    ctx.fillRect(440, 24, 90, 18);
    ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 1.5;
    ctx.strokeRect(440, 24, 90, 18);
    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 8px sans-serif';
    ctx.fillText('COLD BEER', 454, 36);

    // Alvo de dardos (Dartboard) na parede
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(110, 65, 18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = '#dc2626'; ctx.strokeRect(102, 57, 16, 16);
    ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(110, 65, 3, 0, Math.PI * 2); ctx.fill();

    // Lustres pendentes com cone de luz quente
    const barLamps = [120, 300, 480, 660, 840, 1020, 1200];
    barLamps.forEach(lx => {
      if(lx > w) return;
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(lx - 1, 0, 2, 28);
      ctx.beginPath(); ctx.arc(lx, 30, 8, Math.PI, 0); ctx.fill();
      const glow = ctx.createRadialGradient(lx, 32, 2, lx, 140, 65);
      glow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
      glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.moveTo(lx, 32); ctx.lineTo(lx - 55, 150); ctx.lineTo(lx + 55, 150); ctx.closePath(); ctx.fill();
    });

    // Piso de Assoalho de Madeira Nobre / Parquet (Y: 150..224)
    ctx.fillStyle = '#221109';
    ctx.fillRect(0, 150, w, 74);
    ctx.strokeStyle = '#140a05'; ctx.lineWidth = 1;
    for(let py = 150; py < 224; py += 10){
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
    }
    for(let px = 0; px < w; px += 45){
      for(let py = 150; py < 224; py += 20){
        ctx.beginPath(); ctx.moveTo(px + ((py % 20 === 0) ? 0 : 22), py); ctx.lineTo(px + ((py % 20 === 0) ? 0 : 22), py + 10); ctx.stroke();
      }
    }

    if(stageId === 44){
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.fillRect(0, 0, w, 224);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('⚡ SALA SECRETA ATIVA (FASE 44) · CENÁRIO INTERIOR', 14, 14);
    }

  } else if(isDave) {
    // ===== CENÁRIO: GABINETE DO CHEFE DAVE (FASE 3) =====
    const nightSky = ctx.createLinearGradient(0, 0, 0, 110);
    nightSky.addColorStop(0, '#020617'); nightSky.addColorStop(1, '#0f172a');
    ctx.fillStyle = nightSky; ctx.fillRect(100, 15, w - 200, 95);
    ctx.fillStyle = '#1e293b';
    for(let bx = 120; bx < w - 220; bx += 35){
      const bH = 30 + ((bx * 7) % 45);
      ctx.fillRect(bx, 110 - bH, 24, bH);
      ctx.fillStyle = '#fef08a';
      if(bx % 2 === 0) ctx.fillRect(bx + 6, 110 - bH + 8, 3, 3);
      ctx.fillStyle = '#1e293b';
    }
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4;
    ctx.strokeRect(100, 15, w - 200, 95);

    ctx.fillStyle = '#26120b'; ctx.fillRect(0, 0, 100, 150); ctx.fillRect(w - 100, 0, 100, 150);
    ctx.fillStyle = '#451a03'; ctx.fillRect(320, 90, 220, 40);
    ctx.fillStyle = '#15803d'; ctx.fillRect(340, 85, 18, 10);
    ctx.fillStyle = '#450a0a'; ctx.fillRect(0, 150, w, 74);
    ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 1;
    for(let cy = 150; cy < 224; cy += 8){
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    }
    if(stageId === 44){
      ctx.fillStyle = '#10b981'; ctx.font = 'bold 9px sans-serif';
      ctx.fillText('⚡ SALA SECRETA ATIVA (FASE 44) · GABINETE DO CHEFE DAVE', 14, 14);
    }`;

const newBarDaveBlock = `  if(isBar) {
    const cfg = (stage && stage.id === 44 && stage.bgCustom && stage.bgCustom.type === 'bar')
      ? stage.bgCustom
      : {
          counterX: 520, counterW: 500,
          neonText: (stageId === 44 ? '★ CREEP EATS · SALA SECRETA 44 ★' : '★ CREEP EATS · VIP LOUNGE ★'),
          neonColor: '#f43f5e', neonBorder: '#ec4899', neonX: 160,
          subNeonText: 'COLD BEER', subNeonX: 440,
          dartboardX: 110, showDartboard: true,
          shelvesStart: 10, shelvesEnd: w, stoolSpacing: 75, floorTheme: 'wood'
        };

    // Parede de madeira escura com iluminação âmbar
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 150);
    wallGrad.addColorStop(0, '#150c07');
    wallGrad.addColorStop(1, '#2c180e');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, 150);

    // Painéis de madeira e boiserie na parede
    ctx.strokeStyle = '#180d07';
    ctx.lineWidth = 2;
    for(let px = 0; px < w; px += 64){
      ctx.strokeRect(px + 4, 15, 56, 120);
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(px + 8, 19, 48, 112);
    }

    // Prateleiras de bebidas ao fundo
    const shStart = Math.max(0, cfg.shelvesStart || 0);
    const shEnd = Math.min(w, cfg.shelvesEnd || w);
    for(let sy of [42, 78, 114]){
      ctx.fillStyle = '#451a03';
      ctx.fillRect(shStart, sy, shEnd - shStart, 5);
      ctx.fillStyle = '#1c0a02';
      ctx.fillRect(shStart, sy + 5, shEnd - shStart, 2);

      // Garrafas coloridas (Whisky, Vinho, Cerveja, Licor)
      const bottleCols = ['#ef4444', '#10b981', '#f59e0b', '#38bdf8', '#a855f7', '#fbbf24', '#06b6d4'];
      for(let bx = shStart + 12; bx < shEnd - 16; bx += 14){
        if((bx + sy) % 7 === 0) continue;
        const col = bottleCols[(bx + sy) % bottleCols.length];
        const bH = 14 + ((bx * 3) % 8);
        ctx.fillStyle = col;
        ctx.fillRect(bx, sy - bH, 7, bH);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(bx + 2, sy - bH - 3, 3, 3);
      }
    }

    // Balcão de atendimento corrido
    const cX = cfg.counterX || 520;
    const cW = cfg.counterW || 500;
    ctx.fillStyle = '#3b1706';
    ctx.fillRect(cX, 115, cW, 32);
    ctx.fillStyle = '#5c2409';
    ctx.fillRect(cX - 2, 112, cW + 4, 5);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(cX, 142, cW, 3);

    // Banquetes de Bar com assento vermelho acolchoado
    const stSpacing = cfg.stoolSpacing || 75;
    for(let stX = cX + 30; stX <= cX + cW - 20; stX += stSpacing){
      ctx.fillStyle = '#991b1b';
      ctx.beginPath(); ctx.ellipse(stX, 115, 14, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#64748b'; ctx.fillRect(stX - 2, 121, 4, 25);
      ctx.fillStyle = '#334155'; ctx.beginPath(); ctx.ellipse(stX, 146, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Letreiro Neon Principal no Bar
    const nX = cfg.neonX || 160;
    const nW = Math.max(220, (cfg.neonText ? cfg.neonText.length * 8.5 + 24 : 240));
    ctx.fillStyle = '#0f0502';
    ctx.fillRect(nX, 20, nW, 26);
    ctx.strokeStyle = cfg.neonBorder || '#ec4899'; ctx.lineWidth = 2;
    ctx.strokeRect(nX, 20, nW, 26);
    ctx.fillStyle = cfg.neonColor || '#f43f5e';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(cfg.neonText || '★ CREEP EATS ★', nX + 12, 37);

    // Neon secundário "COLD BEER"
    if(cfg.subNeonText){
      const sX = cfg.subNeonX || 440;
      const sW = Math.max(70, cfg.subNeonText.length * 8 + 20);
      ctx.fillStyle = '#000';
      ctx.fillRect(sX, 24, sW, 18);
      ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 1.5;
      ctx.strokeRect(sX, 24, sW, 18);
      ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 8px sans-serif';
      ctx.fillText(cfg.subNeonText, sX + 10, 36);
    }

    // Alvo de dardos (Dartboard) na parede
    if(cfg.showDartboard !== false){
      const dX = cfg.dartboardX || 110;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(dX, 65, 18, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.strokeStyle = '#dc2626'; ctx.strokeRect(dX - 8, 57, 16, 16);
      ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(dX, 65, 3, 0, Math.PI * 2); ctx.fill();
    }

    // Lustres pendentes com cone de luz quente
    const barLamps = cfg.lamps || [120, 300, 480, 660, 840, 1020, 1200];
    barLamps.forEach(lx => {
      if(lx > w) return;
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(lx - 1, 0, 2, 28);
      ctx.beginPath(); ctx.arc(lx, 30, 8, Math.PI, 0); ctx.fill();
      const glow = ctx.createRadialGradient(lx, 32, 2, lx, 140, 65);
      glow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
      glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.moveTo(lx, 32); ctx.lineTo(lx - 55, 150); ctx.lineTo(lx + 55, 150); ctx.closePath(); ctx.fill();
    });

    // Piso (Floor)
    if(cfg.floorTheme === 'tile'){
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 150, w, 74);
      for(let gx = 0; gx < w; gx += 24){
        for(let gy = 150; gy < 224; gy += 16){
          if((gx/24 + gy/16) % 2 === 0){
            ctx.fillStyle = '#27272a';
            ctx.fillRect(gx, gy, 24, 16);
          }
          ctx.strokeStyle = '#09090b'; ctx.lineWidth = 1;
          ctx.strokeRect(gx, gy, 24, 16);
        }
      }
    } else if(cfg.floorTheme === 'dark'){
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 150, w, 74);
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
      for(let py = 150; py < 224; py += 12){
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#221109';
      ctx.fillRect(0, 150, w, 74);
      ctx.strokeStyle = '#140a05'; ctx.lineWidth = 1;
      for(let py = 150; py < 224; py += 10){
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
      }
      for(let px = 0; px < w; px += 45){
        for(let py = 150; py < 224; py += 20){
          ctx.beginPath(); ctx.moveTo(px + ((py % 20 === 0) ? 0 : 22), py); ctx.lineTo(px + ((py % 20 === 0) ? 0 : 22), py + 10); ctx.stroke();
        }
      }
    }

    if(stageId === 44){
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.fillRect(0, 0, w, 224);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('⚡ SALA SECRETA ATIVA (FASE 44) · CENÁRIO CUSTOMIZADO', 14, 14);
    }

  } else if(isDave) {
    const cfg = (stage && stage.id === 44 && stage.bgCustom && stage.bgCustom.type === 'dave')
      ? stage.bgCustom
      : {
          windowX: 100, windowW: 568, deskX: 320, deskW: 220, lampX: 340,
          carpetColor: '#450a0a', wallColor: '#26120b', titleText: 'GABINETE EXECUTIVO'
        };

    const winX = cfg.windowX || 100;
    const winW = cfg.windowW || (w - 200);

    const nightSky = ctx.createLinearGradient(0, 0, 0, 110);
    nightSky.addColorStop(0, '#020617'); nightSky.addColorStop(1, '#0f172a');
    ctx.fillStyle = nightSky; ctx.fillRect(winX, 15, winW, 95);
    ctx.fillStyle = '#1e293b';
    for(let bx = winX + 20; bx < winX + winW - 20; bx += 35){
      const bH = 30 + ((bx * 7) % 45);
      ctx.fillRect(bx, 110 - bH, 24, bH);
      ctx.fillStyle = '#fef08a';
      if(bx % 2 === 0) ctx.fillRect(bx + 6, 110 - bH + 8, 3, 3);
      ctx.fillStyle = '#1e293b';
    }
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4;
    ctx.strokeRect(winX, 15, winW, 95);

    ctx.fillStyle = cfg.wallColor || '#26120b';
    ctx.fillRect(0, 0, winX, 150);
    ctx.fillRect(winX + winW, 0, w - (winX + winW), 150);

    const dX = cfg.deskX || 320;
    const dW = cfg.deskW || 220;
    ctx.fillStyle = '#451a03'; ctx.fillRect(dX, 90, dW, 40);
    ctx.fillStyle = '#5c2409'; ctx.fillRect(dX - 2, 88, dW + 4, 4);

    const lpX = cfg.lampX || (dX + 20);
    ctx.fillStyle = '#15803d'; ctx.fillRect(lpX, 85, 18, 10);
    ctx.fillStyle = '#ca8a04'; ctx.fillRect(lpX + 7, 95, 4, 5);

    ctx.fillStyle = cfg.carpetColor || '#450a0a'; ctx.fillRect(0, 150, w, 74);
    ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 1;
    for(let cy = 150; cy < 224; cy += 8){
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    }
    if(stageId === 44){
      ctx.fillStyle = '#10b981'; ctx.font = 'bold 9px sans-serif';
      ctx.fillText(cfg.titleText || '⚡ SALA SECRETA ATIVA (FASE 44) · GABINETE DO CHEFE DAVE', 14, 14);
    }`;

if (!html.includes(oldBarDaveBlock)) {
  console.error("Could not find oldBarDaveBlock");
  process.exit(1);
}
html = html.replace(oldBarDaveBlock, newBarDaveBlock);

// 4. Update createCustomSecretStage to initialize bgCustom
const oldCreateS44 = `  const existingIdx = ST.stages.findIndex(s => s.id === 44);
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
  }`;

const newCreateS44 = `  const existingIdx = ST.stages.findIndex(s => s.id === 44);
  if(existingIdx >= 0){
    ST.stages[existingIdx].templateStage = tplStageId;
    ST.stages[existingIdx].items = starterItems;
    ST.stages[existingIdx].bgCustom = getInitialBgCustom(tplStageId);
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
      orig: [],
      bgCustom: getInitialBgCustom(tplStageId)
    };
    ST.stages.push(newStage);
    CUR = newStage.row;
  }`;

if (!html.includes(oldCreateS44)) {
  console.error("Could not find oldCreateS44");
  process.exit(1);
}
html = html.replace(oldCreateS44, newCreateS44);

// 5. In render(): generate customBgHtml and render in work area, plus add event listeners
const oldBarHtml = `  // Header da Fase
  let html=\`\${secretHtml}
  <div class="bar">
    <b>\${areaLabel(s.area)}</b>
    <span class="pill">\${recs(s).length} inimigos</span>
    <span class="pill">\${s.items.length} entradas</span>
    <button id="addE" class="sec">+ Inimigo</button>
    <button id="addW">+ Barreira (FF xx)</button>
    <button id="syncW" title="Igualar gatilho de câmera do 4º inimigo ao do 3º">⚡ Sincronizar ondas de 4</button>
    <button id="rev">Desfazer esta fase</button>
  </div>\`;`;

const newBarHtml = `  // Painel de Customização de Cenário da Fase 44
  let customBgHtml = '';
  if(s.id === 44){
    if(!s.bgCustom) s.bgCustom = getInitialBgCustom(s.templateStage || 7);
    const bc = s.bgCustom;
    if(bc.type === 'bar'){
      customBgHtml = \`
      <div class="custom-bg-panel">
        <div class="custom-bg-header">
          <div style="display:flex;align-items:center;gap:10px;">
            <b style="color:var(--ok)">🎨 Customizador de Cenário da Sala Secreta (Fase 44):</b>
            <span class="hint">Reorganize balcão, letreiros, banquetas e decorações com a paleta original</span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <span class="hint" style="align-self:center;">Presets:</span>
            <button class="btn-bg-preset" data-preset="bar-classic">🍺 Bar Clássico</button>
            <button class="btn-bg-preset" data-preset="bar-center">🍸 Lounge Central</button>
            <button class="btn-bg-preset" data-preset="fight-club">🥊 Fight Club</button>
            <button class="btn-bg-preset" data-preset="dave-office">💼 Gabinete Dave</button>
          </div>
        </div>
        <div class="custom-bg-grid">
          <div class="custom-bg-card">
            <h5>🍸 Balcão & Banquetas</h5>
            <div class="custom-bg-row">
              <label>Posição X: <b id="val_counter_x">\${bc.counterX}px</b></label>
              <input type="range" id="rng_counter_x" min="40" max="750" value="\${bc.counterX}">
            </div>
            <div class="custom-bg-row">
              <label>Comprimento: <b id="val_counter_w">\${bc.counterW}px</b></label>
              <input type="range" id="rng_counter_w" min="160" max="700" value="\${bc.counterW}">
            </div>
            <div class="custom-bg-row">
              <label>Espaçamento Banquetas:</label>
              <select id="sel_stool_spacing">
                <option value="60" \${bc.stoolSpacing===60?'selected':''}>Denso (60px)</option>
                <option value="75" \${bc.stoolSpacing===75?'selected':''}>Normal (75px)</option>
                <option value="110" \${bc.stoolSpacing===110?'selected':''}>Espaçado (110px)</option>
              </select>
            </div>
          </div>

          <div class="custom-bg-card">
            <h5>💡 Letreiros Neon Luminosos</h5>
            <div class="custom-bg-row">
              <label>Texto Principal:</label>
              <input type="text" id="inp_neon_text" value="\${bc.neonText||''}" style="width:170px">
            </div>
            <div class="custom-bg-row">
              <label>Posição X: <b id="val_neon_x">\${bc.neonX}px</b></label>
              <input type="range" id="rng_neon_x" min="30" max="850" value="\${bc.neonX}">
            </div>
            <div class="custom-bg-row">
              <label>Cor do Neon:</label>
              <select id="sel_neon_color">
                <option value="#f43f5e" \${bc.neonColor==='#f43f5e'?'selected':''}>Rosa Neon / Pink</option>
                <option value="#38bdf8" \${bc.neonColor==='#38bdf8'?'selected':''}>Ciano Elétrico</option>
                <option value="#f59e0b" \${bc.neonColor==='#f59e0b'?'selected':''}>Âmbar Dourado</option>
                <option value="#10b981" \${bc.neonColor==='#10b981'?'selected':''}>Verde Esmeralda</option>
                <option value="#a855f7" \${bc.neonColor==='#a855f7'?'selected':''}>Roxo Violeta</option>
              </select>
            </div>
            <div class="custom-bg-row">
              <label>Texto Secundário:</label>
              <input type="text" id="inp_sub_neon" value="\${bc.subNeonText||''}" style="width:110px">
              <input type="range" id="rng_sub_neon_x" min="30" max="950" value="\${bc.subNeonX}" title="Posição X">
            </div>
          </div>

          <div class="custom-bg-card">
            <h5>🎯 Paredes, Piso & Acessórios</h5>
            <div class="custom-bg-row">
              <label><input type="checkbox" id="chk_dartboard" \${bc.showDartboard!==false?'checked':''}> Alvo de Dardos</label>
              <input type="range" id="rng_dartboard_x" min="40" max="950" value="\${bc.dartboardX}" title="Posição X">
            </div>
            <div class="custom-bg-row">
              <label>Prateleiras Garrafas:</label>
              <select id="sel_shelves_mode">
                <option value="all" \${bc.shelvesEnd>800?'selected':''}>Parede Inteira (1050px)</option>
                <option value="counter" \${bc.shelvesEnd<=800?'selected':''}>Apenas atrás do Balcão</option>
              </select>
            </div>
            <div class="custom-bg-row">
              <label>Estilo do Piso:</label>
              <select id="sel_floor_theme">
                <option value="wood" \${bc.floorTheme==='wood'?'selected':''}>Assoalho de Madeira (Parquet)</option>
                <option value="tile" \${bc.floorTheme==='tile'?'selected':''}>Piso Cerâmico Xadrez</option>
                <option value="dark" \${bc.floorTheme==='dark'?'selected':''}>Concreto Industrial Escuro</option>
              </select>
            </div>
          </div>
        </div>
      </div>\`;
    } else if(bc.type === 'dave'){
      customBgHtml = \`
      <div class="custom-bg-panel">
        <div class="custom-bg-header">
          <div style="display:flex;align-items:center;gap:10px;">
            <b style="color:var(--ok)">🎨 Customizador do Gabinete Executivo (Fase 44):</b>
            <span class="hint">Configure skyline noturno, mesa executiva, iluminação e carpete</span>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn-bg-preset" data-preset="bar-classic">🍺 Mudar para Bar</button>
            <button class="btn-bg-preset" data-preset="dave-office">💼 Gabinete Padrão</button>
          </div>
        </div>
        <div class="custom-bg-grid">
          <div class="custom-bg-card">
            <h5>🏙️ Janela Panorâmica / Skyline</h5>
            <div class="custom-bg-row">
              <label>Posição X Janela: <b id="val_win_x">\${bc.windowX}px</b></label>
              <input type="range" id="rng_win_x" min="20" max="400" value="\${bc.windowX}">
            </div>
            <div class="custom-bg-row">
              <label>Largura Janela: <b id="val_win_w">\${bc.windowW}px</b></label>
              <input type="range" id="rng_win_w" min="250" max="700" value="\${bc.windowW}">
            </div>
          </div>
          <div class="custom-bg-card">
            <h5>💼 Mesa do Chefe & Abajur</h5>
            <div class="custom-bg-row">
              <label>Posição X Mesa: <b id="val_desk_x">\${bc.deskX}px</b></label>
              <input type="range" id="rng_desk_x" min="50" max="650" value="\${bc.deskX}">
            </div>
            <div class="custom-bg-row">
              <label>Largura Mesa: <b id="val_desk_w">\${bc.deskW}px</b></label>
              <input type="range" id="rng_desk_w" min="140" max="400" value="\${bc.deskW}">
            </div>
          </div>
          <div class="custom-bg-card">
            <h5>🏷️ Título & Cores</h5>
            <div class="custom-bg-row">
              <label>Letreiro:</label>
              <input type="text" id="inp_dave_title" value="\${bc.titleText||''}" style="width:180px">
            </div>
            <div class="custom-bg-row">
              <label>Cor do Carpete:</label>
              <select id="sel_carpet_color">
                <option value="#450a0a" \${bc.carpetColor==='#450a0a'?'selected':''}>Vermelho Carmesim</option>
                <option value="#1e3a8a" \${bc.carpetColor==='#1e3a8a'?'selected':''}>Azul Real</option>
                <option value="#14532d" \${bc.carpetColor==='#14532d'?'selected':''}>Verde Imperial</option>
                <option value="#262626" \${bc.carpetColor==='#262626'?'selected':''}>Cinza Chumbo</option>
              </select>
            </div>
          </div>
        </div>
      </div>\`;
    }
  }

  // Header da Fase
  let html=\`\${secretHtml}
  \${customBgHtml}
  <div class="bar">
    <b>\${areaLabel(s.area)}</b>
    <span class="pill">\${recs(s).length} inimigos</span>
    <span class="pill">\${s.items.length} entradas</span>
    <button id="addE" class="sec">+ Inimigo</button>
    <button id="addW">+ Barreira (FF xx)</button>
    <button id="syncW" title="Igualar gatilho de câmera do 4º inimigo ao do 3º">⚡ Sincronizar ondas de 4</button>
    <button id="rev">Desfazer esta fase</button>
  </div>\`;`;

if (!html.includes(oldBarHtml)) {
  console.error("Could not find oldBarHtml");
  process.exit(1);
}
html = html.replace(oldBarHtml, newBarHtml);

// 6. Mount event listeners for customBgPanel right after updateButtons()
const listenersMarker = `  updateButtons();
}`;

const customBgListeners = `  updateButtons();

  // Listeners de customização de cenário da Fase 44
  if(s.id === 44 && s.bgCustom){
    const bc = s.bgCustom;
    const rngCX = $('#rng_counter_x');
    if(rngCX) rngCX.oninput = () => { bc.counterX = +rngCX.value; $('#val_counter_x').textContent = bc.counterX + 'px'; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const rngCW = $('#rng_counter_w');
    if(rngCW) rngCW.oninput = () => { bc.counterW = +rngCW.value; $('#val_counter_w').textContent = bc.counterW + 'px'; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const selStool = $('#sel_stool_spacing');
    if(selStool) selStool.onchange = () => { bc.stoolSpacing = +selStool.value; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const inpNeon = $('#inp_neon_text');
    if(inpNeon) inpNeon.oninput = () => { bc.neonText = inpNeon.value; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const rngNX = $('#rng_neon_x');
    if(rngNX) rngNX.oninput = () => { bc.neonX = +rngNX.value; $('#val_neon_x').textContent = bc.neonX + 'px'; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const selNCol = $('#sel_neon_color');
    if(selNCol) selNCol.onchange = () => {
      bc.neonColor = selNCol.value;
      const borderMap = { '#f43f5e': '#ec4899', '#38bdf8': '#06b6d4', '#f59e0b': '#ca8a04', '#10b981': '#059669', '#a855f7': '#7c3aed' };
      bc.neonBorder = borderMap[bc.neonColor] || '#ec4899';
      drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM);
    };
    
    const inpSubNeon = $('#inp_sub_neon');
    if(inpSubNeon) inpSubNeon.oninput = () => { bc.subNeonText = inpSubNeon.value; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const rngSubNX = $('#rng_sub_neon_x');
    if(rngSubNX) rngSubNX.oninput = () => { bc.subNeonX = +rngSubNX.value; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const chkDart = $('#chk_dartboard');
    if(chkDart) chkDart.onchange = () => { bc.showDartboard = chkDart.checked; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const rngDartX = $('#rng_dartboard_x');
    if(rngDartX) rngDartX.oninput = () => { bc.dartboardX = +rngDartX.value; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const selShelves = $('#sel_shelves_mode');
    if(selShelves) selShelves.onchange = () => {
      if(selShelves.value === 'counter'){ bc.shelvesStart = bc.counterX; bc.shelvesEnd = bc.counterX + bc.counterW; }
      else { bc.shelvesStart = 10; bc.shelvesEnd = 1050; }
      drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM);
    };
    
    const selFloor = $('#sel_floor_theme');
    if(selFloor) selFloor.onchange = () => { bc.floorTheme = selFloor.value; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };

    // Dave Office listeners
    const rngWinX = $('#rng_win_x');
    if(rngWinX) rngWinX.oninput = () => { bc.windowX = +rngWinX.value; $('#val_win_x').textContent = bc.windowX + 'px'; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const rngWinW = $('#rng_win_w');
    if(rngWinW) rngWinW.oninput = () => { bc.windowW = +rngWinW.value; $('#val_win_w').textContent = bc.windowW + 'px'; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const rngDeskX = $('#rng_desk_x');
    if(rngDeskX) rngDeskX.oninput = () => { bc.deskX = +rngDeskX.value; $('#val_desk_x').textContent = bc.deskX + 'px'; bc.lampX = bc.deskX + 20; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const rngDeskW = $('#rng_desk_w');
    if(rngDeskW) rngDeskW.oninput = () => { bc.deskW = +rngDeskW.value; $('#val_desk_w').textContent = bc.deskW + 'px'; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const inpDaveTitle = $('#inp_dave_title');
    if(inpDaveTitle) inpDaveTitle.oninput = () => { bc.titleText = inpDaveTitle.value; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };
    
    const selCarpet = $('#sel_carpet_color');
    if(selCarpet) selCarpet.onchange = () => { bc.carpetColor = selCarpet.value; drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM); };

    // Presets
    document.querySelectorAll('.btn-bg-preset').forEach(btn => {
      btn.onclick = () => {
        const p = btn.dataset.preset;
        if(p === 'bar-classic'){
          s.templateStage = 7;
          s.bgCustom = getInitialBgCustom(7);
        } else if(p === 'bar-center'){
          s.templateStage = 7;
          s.bgCustom = {
            type: 'bar', counterX: 300, counterW: 440,
            neonText: '★ METRO VIP CLUB 44 ★', neonColor: '#38bdf8', neonBorder: '#06b6d4', neonX: 340,
            subNeonText: 'COCKTAILS', subNeonX: 800, dartboardX: 120, showDartboard: true,
            shelvesStart: 10, shelvesEnd: 1050, stoolSpacing: 60, floorTheme: 'tile'
          };
        } else if(p === 'fight-club'){
          s.templateStage = 7;
          s.bgCustom = {
            type: 'bar', counterX: 80, counterW: 280,
            neonText: '★ UNDERGROUND FIGHT CLUB ★', neonColor: '#f59e0b', neonBorder: '#ca8a04', neonX: 420,
            subNeonText: 'NO WEAPONS', subNeonX: 780, dartboardX: 880, showDartboard: true,
            shelvesStart: 60, shelvesEnd: 380, stoolSpacing: 75, floorTheme: 'dark'
          };
        } else if(p === 'dave-office'){
          s.templateStage = 3;
          s.bgCustom = getInitialBgCustom(3);
        }
        render();
      };
    });
  }
}`;

if (!html.includes(listenersMarker)) {
  console.error("Could not find listenersMarker");
  process.exit(1);
}
html = html.replace(listenersMarker, customBgListeners);

fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('✓ Successfully applied Background Customizer for Stage 44 to FF3_Script_Editor.html!');
