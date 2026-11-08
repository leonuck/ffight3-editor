const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
console.log('Original size:', html.length);

// 1. Update drawStageBackground call in render()
const oldCall = "drawStageBackground($('#stageBgCanvas'), s.row + 1, arenaW, arenaH, BOARD_ZOOM);";
const newCall = "drawStageBackground($('#stageBgCanvas'), s, arenaW, arenaH, BOARD_ZOOM);";
if (!html.includes(oldCall)) {
  throw new Error("Could not find drawStageBackground call in render()");
}
html = html.replace(oldCall, newCall);
console.log('1. drawStageBackground call updated.');

// 2. Replace drawStageBackground implementation
const oldDrawBgStart = "function drawStageBackground(canvas, stageId, totalW, totalH, zoom){";
const oldDrawBgEnd = "  ctx.restore();\n}";
const oldDrawIdx = html.indexOf(oldDrawBgStart);
const oldDrawEndIdx = html.indexOf(oldDrawBgEnd, oldDrawIdx);

if (oldDrawIdx === -1 || oldDrawEndIdx === -1) {
  throw new Error("Could not find drawStageBackground to replace");
}

const newDrawBg = `function drawStageBackground(canvas, stage, totalW, totalH, zoom){
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

  const isStage1 = (stageId === 1);
  const isBar = (stageId === 7 || (stageId === 44 && (tplStageId === 7 || !tplStageId)));
  const isDave = (stageId === 3 || (stageId === 44 && tplStageId === 3));
  const isChina = (stageId === 11 || (stageId === 44 && tplStageId === 11));
  const isPrison = (stageId === 2 || (stageId === 44 && tplStageId === 2));
  const isPort = (stageId === 4 || (stageId === 44 && tplStageId === 4));

  if(isBar) {
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
    }

  } else if(isChina) {
    // ===== CENÁRIO: RESTAURANTE CHINÊS (FASE 11) =====
    ctx.fillStyle = '#7f1d1d'; ctx.fillRect(0, 0, w, 150);
    for(let px = 40; px < w; px += 180){
      ctx.fillStyle = '#991b1b'; ctx.fillRect(px, 15, 24, 135);
      ctx.fillStyle = '#ca8a04'; ctx.fillRect(px - 2, 15, 28, 6); ctx.fillRect(px - 2, 144, 28, 6);
    }
    for(let lx = 120; lx < w; lx += 180){
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.ellipse(lx, 45, 10, 14, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fef08a'; ctx.fillRect(lx - 3, 42, 6, 6);
    }
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 150, w, 74);
    ctx.strokeStyle = '#44403c'; ctx.lineWidth = 1;
    for(let gx = 0; gx < w; gx += 20){
      for(let gy = 150; gy < 224; gy += 15){
        if((gx + gy) % 30 === 0) ctx.fillStyle = '#292524'; else ctx.fillStyle = '#1c1917';
        ctx.fillRect(gx, gy, 20, 15); ctx.strokeRect(gx, gy, 20, 15);
      }
    }
    if(stageId === 44){
      ctx.fillStyle = '#10b981'; ctx.font = 'bold 9px sans-serif';
      ctx.fillText('⚡ SALA SECRETA ATIVA (FASE 44) · RESTAURANTE CHINÊS', 14, 14);
    }

  } else if(isPrison) {
    // ===== CENÁRIO: PRISÃO / CELAS (FASE 2) =====
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, w, 150);
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1;
    for(let by = 15; by < 150; by += 12){
      ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(w, by); ctx.stroke();
    }
    ctx.fillStyle = '#475569';
    for(let bx = 60; bx < w; bx += 25){
      ctx.fillRect(bx, 20, 4, 130);
    }
    ctx.fillStyle = '#334155'; ctx.fillRect(0, 150, w, 74);
    if(stageId === 44){
      ctx.fillStyle = '#10b981'; ctx.font = 'bold 9px sans-serif';
      ctx.fillText('⚡ SALA SECRETA ATIVA (FASE 44) · CORREDOR DA PRISÃO', 14, 14);
    }

  } else if(isPort) {
    // ===== CENÁRIO: CAIS / PORTO (FASE 4) =====
    const waterGrad = ctx.createLinearGradient(0, 0, 0, 140);
    waterGrad.addColorStop(0, '#030712'); waterGrad.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = waterGrad; ctx.fillRect(0, 0, w, 140);
    ctx.fillStyle = '#075985';
    for(let nx = 80; nx < w; nx += 220){
      ctx.fillRect(nx, 90, 110, 25);
      ctx.fillRect(nx + 35, 55, 12, 35);
    }
    ctx.fillStyle = '#3f2212'; ctx.fillRect(0, 140, w, 84);
    ctx.strokeStyle = '#221108'; ctx.lineWidth = 1.5;
    for(let py = 140; py < 224; py += 12){
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
    }
    if(stageId === 44){
      ctx.fillStyle = '#10b981'; ctx.font = 'bold 9px sans-serif';
      ctx.fillText('⚡ SALA SECRETA ATIVA (FASE 44) · CAIS DO PORTO', 14, 14);
    }

  } else {
    // ===== CENÁRIO EXTERIOR: FASE 1 OU URBANO =====
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 75);
    skyGrad.addColorStop(0, '#090d1c');
    skyGrad.addColorStop(1, '#161d36');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, 75);

    ctx.fillStyle = '#0f1426';
    for(let bx = 0; bx < w; bx += 40){
      const bH = 22 + ((bx * 7) % 35);
      const bW = 24 + ((bx * 13) % 18);
      ctx.fillRect(bx, 75 - bH, bW, bH);
      ctx.fillStyle = ((bx % 3 === 0) ? '#f59e0b' : '#38bdf8');
      for(let wy = 75 - bH + 4; wy < 70; wy += 6){
        if((bx + wy) % 5 === 0) ctx.fillRect(bx + 4, wy, 2, 2);
        if((bx + wy) % 7 === 0) ctx.fillRect(bx + 12, wy, 2, 2);
      }
      ctx.fillStyle = '#0f1426';
    }

    if(isStage1){
      // SEÇÃO A: 0 a 280 px (Delegacia de Metro City)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 15, 280, 120);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for(let y = 20; y < 135; y += 8){
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(280, y); ctx.stroke();
      }
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 25, 180, 20);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 25, 180, 20);
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('METRO POLICE DEPT · PRECINCT 3', 46, 38);

      ctx.fillStyle = '#2563eb';
      ctx.beginPath(); ctx.arc(130, 20, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.beginPath(); ctx.arc(130, 20, 14, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#090d16';
      ctx.fillRect(80, 60, 100, 75);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 60, 100, 75);
      ctx.strokeRect(80, 60, 50, 75);
      ctx.strokeRect(130, 60, 50, 75);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(84, 65, 42, 45);
      ctx.fillRect(134, 65, 42, 45);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(195, 110, 75, 25);
      ctx.fillRect(205, 95, 55, 16);
      ctx.fillStyle = '#ef4444'; ctx.fillRect(228, 91, 5, 4);
      ctx.fillStyle = '#3b82f6'; ctx.fillRect(233, 91, 5, 4);
      ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 7px sans-serif'; ctx.fillText('POLICE', 215, 122);
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(210, 135, 7, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(255, 135, 7, 0, Math.PI*2); ctx.fill();

      // SEÇÃO B: 280 a 520 px (Chinatown Pagode & Restaurante)
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(280, 20, 240, 115);
      ctx.fillStyle = '#450a0a';
      ctx.beginPath();
      ctx.moveTo(270, 25); ctx.lineTo(530, 25); ctx.lineTo(515, 12); ctx.lineTo(285, 12);
      ctx.closePath(); ctx.fill();

      for(let wx = 295; wx < 500; wx += 45){
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(wx, 40, 24, 32);
        ctx.strokeStyle = '#450a0a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(wx, 40, 24, 32);
        ctx.beginPath(); ctx.moveTo(wx + 12, 40); ctx.lineTo(wx + 12, 72); ctx.stroke();
      }

      for(let lx = 310; lx < 510; lx += 60){
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(lx, 25); ctx.lineTo(lx, 35); ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.ellipse(lx, 42, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef08a'; ctx.fillRect(lx - 2, 40, 4, 4);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.beginPath(); ctx.arc(lx, 42, 16, 0, Math.PI * 2); ctx.fill();
      }

      // SEÇÃO C: 520 a 720 px (BAR "CREEP EATS" - A PORTA SECRETA!)
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(520, 25, 200, 110);
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(520, 25, 200, 110);

      ctx.fillStyle = '#09090b';
      ctx.fillRect(540, 30, 160, 24);
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.strokeRect(540, 30, 160, 24);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('★ CREEP EATS ★', 562, 46);
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('BAR & RESTAURANT', 576, 52);

      // === A PORTA DO BAR (X: 550..640) ===
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(550, 58, 90, 77);
      ctx.strokeStyle = '#78716c';
      ctx.lineWidth = 2;
      ctx.strokeRect(550, 58, 90, 77);

      ctx.fillStyle = '#334155';
      ctx.fillRect(554, 62, 82, 73);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for(let sy = 65; sy < 135; sy += 5){
        ctx.beginPath(); ctx.moveTo(554, sy); ctx.lineTo(636, sy); ctx.stroke();
      }
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(595, 95, 18, 12, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 7.5px sans-serif';
      ctx.fillText('⚡ IMPACTO', 574, 98);

      for(let cx = 554; cx < 636; cx += 10){
        ctx.fillStyle = (cx % 20 === 0) ? '#eab308' : '#000';
        ctx.fillRect(cx, 130, 10, 5);
      }

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(650, 65, 55, 50);
      ctx.strokeStyle = '#78716c';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(650, 65, 55, 50);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.fillRect(652, 67, 51, 46);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      for(let by = 70; by < 114; by += 4){
        ctx.beginPath(); ctx.moveTo(652, by); ctx.lineTo(703, by); ctx.stroke();
      }

      // SEÇÃO D: 720 a 1280 px (Continuação da Rua)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(720, 20, 560, 115);
      for(let ax = 740; ax < 1240; ax += 120){
        for(let sw = 0; sw < 70; sw += 14){
          ctx.fillStyle = (sw % 28 === 0) ? '#16a34a' : '#f8fafc';
          ctx.fillRect(ax + sw, 55, 14, 25);
        }
      }
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 15, w, 120);
      for(let bx = 20; bx < w; bx += 80){
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(bx, 40, 45, 60);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(bx, 40, 45, 60);
      }
    }

    const lampXs = [40, 270, 510, 730, 980, 1220];
    lampXs.forEach(lx => {
      if(lx > w) return;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(lx - 2, 35, 4, 100);
      ctx.beginPath(); ctx.arc(lx, 35, 6, 0, Math.PI * 2); ctx.fill();
      const cone = ctx.createRadialGradient(lx, 40, 2, lx, 145, 60);
      cone.addColorStop(0, 'rgba(253, 224, 71, 0.35)');
      cone.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.moveTo(lx, 40); ctx.lineTo(lx - 45, 150); ctx.lineTo(lx + 45, 150);
      ctx.closePath(); ctx.fill();
    });

    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 135, w, 20);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for(let sx = 0; sx < w; sx += 32){
      ctx.beginPath(); ctx.moveTo(sx, 135); ctx.lineTo(sx - 10, 155); ctx.stroke();
    }
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 154, w, 2);

    ctx.fillStyle = '#1e2430';
    ctx.fillRect(0, 156, w, 68);
    ctx.fillStyle = '#eab308';
    for(let rx = 0; rx < w; rx += 50){
      ctx.fillRect(rx, 188, 30, 3);
    }
  }

  ctx.restore();
}`;

html = html.substring(0, oldDrawIdx) + newDrawBg + html.substring(oldDrawEndIdx + oldDrawBgEnd.length);
console.log('2. drawStageBackground implementation replaced.');

// 3. Update createCustomSecretStage
const createIdx = html.indexOf("function createCustomSecretStage(){");
const vramIdx = html.indexOf("function vramWarn(s){", createIdx);

if (createIdx === -1 || vramIdx === -1) {
  throw new Error("Could not find createCustomSecretStage boundary to replace");
}

const newCreateStage = `function createCustomSecretStage(){
  if(!ST || !ST.stages) {
    alert("Por favor, carregue uma ROM primeiro antes de criar a Fase 44.");
    return;
  }
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
  const tplStage = ST.stages.find(s => s.id === tplStageId);

  // Clona os inimigos diretamente do cenário template para garantir compatibilidade 100% de VRAM, chão e spawners
  let starterItems = [];
  if(tplStage && tplStage.items && tplStage.items.length > 0){
    starterItems = tplStage.items.map(it => ({
      t: it.t,
      b: it.b.slice()
    }));
  } else {
    // Fallback seguro caso o template não possua itens
    starterItems = [
      { t: 'rec', b: [0, 0, 0x00, 0x08, 5, 2, 0x82, 35, 0, 0, 0, 0x30, 0x11, 0x80, 0x0B, 0, 0] },
      { t: 'rec', b: [0, 0, 0x00, 0x08, 6, 2, 0x82, 35, 0, 0, 0, 0xD0, 0xFD, 0x00, 0x0C, 0, 0] },
      { t: 'cmd', b: [0xFF, 0x01] },
      { t: 'rec', b: [0, 0, 0x80, 0x1A, 21, 4, 0x8A, 215, 0, 0, 1, 0x00, 0x2D, 0x00, 0x09, 0, 0] },
      { t: 'cmd', b: [0xFF, 0x02] }
    ];
  }

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
  const enemyCount = starterItems.filter(x => x.t === 'rec').length;
  alert("✨ Sala Secreta 44 criada com sucesso!\\n\\nBase clonada: Fase " + tplStageId + "\\nInimigos clonados: " + enemyCount + " (todos com VRAM e coordenadas válidas!)\\n\\nVocê pode arrastar os inimigos pelo tabuleiro, editar seus atributos e salvar a ROM normalmente.");
}`;

html = html.substring(0, createIdx) + newCreateStage + "\n\n" + html.substring(vramIdx);
console.log('3. createCustomSecretStage updated.');

// 4. Update renderBoardTokens: inherit effectiveTrig for curTrig===0 items
const oldTokensStart = "  s.items.forEach((it,i)=>{\n    if(it.t!=='rec')return;\n    const b=it.b;\n    const itemWave=wavesMap[i]||0;\n    const isDimmed = (ACTIVE_WAVE!=='all' && ACTIVE_WAVE!==''+itemWave);\n    const isSel = (SELECTED_IDX===i);\n\n    const xPx = rec.x(b) / 16;\n    const yPx = rec.y(b) / 16;\n    const isPano = (BOARD_VIEW_MODE === 'pano');\n\n    const worldX = isPano ? ((rec.trig(b)/16) + xPx) : (xPx + 70);\n    const tokenX = worldX * BOARD_ZOOM;";

const newTokensStart = `  let lastNonZeroTrig = 0;
  s.items.forEach((it,i)=>{
    if(it.t!=='rec')return;
    const b=it.b;
    const curTrig = rec.trig(b);
    if(curTrig > 0) lastNonZeroTrig = curTrig;
    const effectiveTrig = (curTrig > 0) ? curTrig : lastNonZeroTrig;

    const itemWave=wavesMap[i]||0;
    const isDimmed = (ACTIVE_WAVE!=='all' && ACTIVE_WAVE!==''+itemWave);
    const isSel = (SELECTED_IDX===i);

    const xPx = rec.x(b) / 16;
    const yPx = rec.y(b) / 16;
    const isPano = (BOARD_VIEW_MODE === 'pano');

    const worldX = isPano ? ((effectiveTrig/16) + xPx) : (xPx + 70);
    const tokenX = worldX * BOARD_ZOOM;`;

if (!html.includes(oldTokensStart)) {
  throw new Error("Could not find renderBoardTokens start snippet");
}
html = html.replace(oldTokensStart, newTokensStart);
console.log('4. renderBoardTokens updated.');

// 5. Update setupTokenDrag: replace whole function from signature to closing brace before arrow keys
const pDragStart = html.indexOf("function setupTokenDrag(token, s, idx){");
const pDragEnd = html.indexOf("// Suporte a teclas direcionais", pDragStart);

if (pDragStart === -1 || pDragEnd === -1) {
  throw new Error("Could not find setupTokenDrag bounds");
}

const newSetupTokenDrag = `function setupTokenDrag(token, s, idx){
  let dragging=false;
  let startX, startY;
  let initTokenLeft, initTokenTop;

  token.onpointerdown=(ev)=>{
    if(ev.button!==0)return;
    ev.preventDefault();
    selectEnemy(idx);
    dragging=true;
    token.setPointerCapture(ev.pointerId);
    token.classList.add('is-dragging');

    startX=ev.clientX;
    startY=ev.clientY;
    initTokenLeft=parseFloat(token.style.left);
    initTokenTop=parseFloat(token.style.top);

    const guideX=$('#dragGuideX');
    const guideY=$('#dragGuideY');
    if(guideX) guideX.style.display='block';
    if(guideY) guideY.style.display='block';
  };

  token.onpointermove=(ev)=>{
    if(!dragging)return;
    ev.preventDefault();

    const dx=ev.clientX-startX;
    const dy=ev.clientY-startY;

    const curLeft=initTokenLeft+dx;
    const curTop=initTokenTop+dy;

    token.style.left=\`\${curLeft}px\`;
    token.style.top=\`\${curTop}px\`;

    const isPano = (BOARD_VIEW_MODE === 'pano');
    let trigPx = rec.trig(s.items[idx].b) / 16;
    if(trigPx === 0) {
      for(let j=idx-1; j>=0; j--){
        if(s.items[j].t==='rec' && rec.trig(s.items[j].b) > 0){
          trigPx = rec.trig(s.items[j].b) / 16;
          break;
        }
      }
    }
    const curWorldX = curLeft / BOARD_ZOOM;
    const gameXPx = isPano ? Math.round(curWorldX - trigPx) : Math.round(curWorldX - 70);
    const gameYPx = Math.round(curTop / BOARD_ZOOM);

    const coordEl=token.querySelector('.token-coords');
    if(coordEl) coordEl.textContent=\`\${isPano ? 'Mundo X:' + Math.round(curWorldX) : 'Tela X:' + gameXPx} Y:\${gameYPx}\`;

    const guideX=$('#dragGuideX');
    const guideY=$('#dragGuideY');
    if(guideX) guideX.style.left=\`\${curLeft}px\`;
    if(guideY) guideY.style.top=\`\${curTop}px\`;

    const inpX=document.querySelector(\`input[data-i="\${idx}"][data-f="x"]\`);
    const inpY=document.querySelector(\`input[data-i="\${idx}"][data-f="y"]\`);
    if(inpX) inpX.value = gameXPx * 16;
    if(inpY) inpY.value = gameYPx * 16;
  };

  const endDrag=(ev)=>{
    if(!dragging)return;
    dragging=false;
    token.classList.remove('is-dragging');
    try{token.releasePointerCapture(ev.pointerId);}catch(e){}

    const guideX=$('#dragGuideX');
    const guideY=$('#dragGuideY');
    if(guideX) guideX.style.display='none';
    if(guideY) guideY.style.display='none';

    const curLeft=parseFloat(token.style.left);
    const curTop=parseFloat(token.style.top);

    const isPano = (BOARD_VIEW_MODE === 'pano');
    let trigPx = rec.trig(s.items[idx].b) / 16;
    if(trigPx === 0) {
      for(let j=idx-1; j>=0; j--){
        if(s.items[j].t==='rec' && rec.trig(s.items[j].b) > 0){
          trigPx = rec.trig(s.items[j].b) / 16;
          break;
        }
      }
    }
    const curWorldX = curLeft / BOARD_ZOOM;
    const gameXPx = isPano ? Math.round(curWorldX - trigPx) : Math.round(curWorldX - 70);
    const gameYPx = Math.round(curTop / BOARD_ZOOM);

    setW(s.items[idx].b, 11, gameXPx * 16);
    setW(s.items[idx].b, 13, gameYPx * 16);

    renderSide();
    updateSelectedLabel(s);
  };

  token.onpointerup=endDrag;
  token.onpointercancel=endDrag;
}

`;

html = html.substring(0, pDragStart) + newSetupTokenDrag + html.substring(pDragEnd);
console.log('5. setupTokenDrag updated.');

// 6. Update $('#addE') and $('#addW')
const addEIdx = html.indexOf("$('#addE').onclick=");
const syncWIdx = html.indexOf("$('#syncW').onclick=", addEIdx);

if (addEIdx === -1 || syncWIdx === -1) {
  throw new Error("Could not find addE or syncW boundary to replace");
}

const newAddEAndW = `$('#addE').onclick=()=>{
    const r=recs(s);
    // Base padrão: Billy (Sprite 5, Gfx 2, HP 35, X: 275px, Y: 184px, Camera Trig: 128px)
    let base = [0, 0, 0x00, 0x08, 5, 2, 0x80, 35, 0, 0, 0, 0x30, 0x11, 0x80, 0x0B, 0, 0];
    
    if (SELECTED_IDX != null && s.items[SELECTED_IDX] && s.items[SELECTED_IDX].t === 'rec') {
      base = s.items[SELECTED_IDX].b.slice();
    } else if (r.length > 0) {
      const validRec = r.slice().reverse().find(x => x.b[5] >= 2) || r[r.length - 1];
      base = validRec.b.slice();
    }
    
    // Garante que campos essenciais nunca sejam 0 ou fora do chão
    if (!base[5] || base[5] === 0) base[5] = 2; // VRAM nunca pode ser 0
    const curY = rec.y(base) / 16;
    if (curY < 155 || curY > 215) setW(base, 13, 184 * 16); // Chão sempre válido (184px)
    if (rec.hp(base) <= 0) setW(base, 7, 35); // HP padrão
    
    // Insere antes do final do script / barreira final para não quebrar a onda
    let insertIdx = s.items.length;
    if (SELECTED_IDX != null && SELECTED_IDX >= 0 && SELECTED_IDX < s.items.length) {
      insertIdx = SELECTED_IDX + 1;
    } else {
      for (let j = s.items.length - 1; j >= 0; j--) {
        if (s.items[j].t === 'cmd') {
          insertIdx = j;
          break;
        }
      }
    }
    s.items.splice(insertIdx, 0, { t: 'rec', b: base });
    render();
    selectEnemy(insertIdx);
  };
  $('#addW').onclick=()=>{
    let insertIdx = s.items.length;
    for (let j = s.items.length - 1; j >= 0; j--) {
      if (s.items[j].t === 'cmd') {
        insertIdx = j;
        break;
      }
    }
    let maxCmdNum = 0;
    s.items.forEach(it => { if(it.t==='cmd' && it.b.length===2) maxCmdNum = Math.max(maxCmdNum, it.b[1]); });
    s.items.splice(insertIdx, 0, { t: 'cmd', b: [0xFF, (maxCmdNum + 1) & 0xFF] });
    render();
  };
  `;

html = html.substring(0, addEIdx) + newAddEAndW + html.substring(syncWIdx);
console.log('6. addE and addW updated.');

fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('ALL FIXES APPLIED SUCCESSFULLY! New file size:', html.length);

