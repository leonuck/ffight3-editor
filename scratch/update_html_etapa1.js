const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

// 1. Add CSS rules before /* Drag guides */
const newCss = `
/* Interactive Door Zone & Resizing Handles */
.arena-door-zone{position:absolute;border:2px dashed #f59e0b;background:rgba(245,158,11,0.22);box-shadow:0 0 16px rgba(245,158,11,0.35);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:4px;z-index:8;border-radius:4px;cursor:grab;user-select:none;transition:border-color 0.15s,box-shadow 0.15s;pointer-events:auto!important}
.arena-door-zone:hover,.arena-door-zone.is-selected{border-color:#38bdf8!important;background:rgba(56,189,248,0.28)!important;box-shadow:0 0 20px rgba(56,189,248,0.5)!important;z-index:9!important}
.arena-door-zone:active{cursor:grabbing}
.door-resize-handle{position:absolute;background:#fff;border:1.5px solid #0f172a;border-radius:2px;z-index:11}
.door-handle-l{left:-5px;top:25%;bottom:25%;width:8px;cursor:ew-resize}
.door-handle-r{right:-5px;top:25%;bottom:25%;width:8px;cursor:ew-resize}
.door-handle-t{top:-5px;left:25%;right:25%;height:8px;cursor:ns-resize}

/* Canvas & View Mode */
#stageBgCanvas{position:absolute;left:0;top:0;pointer-events:none;image-rendering:pixelated;z-index:1}
.board-viewport{overflow-x:auto;overflow-y:hidden;background:#090b10;border-radius:6px;scrollbar-width:thin}
.board-viewport::-webkit-scrollbar{height:10px}
.board-viewport::-webkit-scrollbar-thumb{background:#334155;border-radius:5px}

/* Wave barrier in pano mode */
.arena-wave-barrier{position:absolute;top:0;bottom:0;width:2px;border-left:2px dashed rgba(239,68,68,0.6);pointer-events:none;z-index:3}
.arena-wave-badge{position:absolute;top:4px;left:4px;background:#ef4444;color:#fff;font-size:8.5px;font-weight:800;padding:1px 4px;border-radius:3px;white-space:nowrap}

/* Camera box indicator */
.arena-camera-box{position:absolute;top:0;bottom:0;border:2px solid rgba(16,185,129,0.7);background:rgba(16,185,129,0.04);pointer-events:none;z-index:2}
.arena-camera-tag{position:absolute;top:4px;left:6px;font-size:8.5px;color:#10b981;font-weight:700;letter-spacing:0.5px}

/* Avatar SVGs inside tokens */
.token-avatar svg{display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5))}
`;

if (!html.includes('.door-resize-handle')) {
  html = html.replace('/* Drag guides */', newCss + '\n/* Drag guides */');
}

// 2. Add functions before // ===== Estado da Interface =====
const functionsCode = `
// ===== Gerador de Sprites e Avatares Vetoriais dos Inimigos =====
function getEnemyAvatarSvg(type){
  const t = type & 0x3F;
  if(t === 20){ // Dave (Chefe Policial)
    return \`<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M6 10 Q16 4 26 10 L28 14 L4 14 Z" fill="#1e3a8a"/>
      <ellipse cx="16" cy="11" rx="3" ry="2" fill="#f59e0b"/>
      <rect x="7" y="14" width="18" height="12" rx="3" fill="#fbcfe8"/>
      <rect x="9" y="16" width="6" height="3" rx="1" fill="#0f172a"/>
      <rect x="17" y="16" width="6" height="3" rx="1" fill="#0f172a"/>
      <rect x="14" y="17" width="4" height="1" fill="#0f172a"/>
      <path d="M12 22 Q16 25 20 22" stroke="#991b1b" stroke-width="1.5" fill="none"/>
      <rect x="5" y="25" width="22" height="7" fill="#1e3a8a"/>
      <polygon points="16,25 14,32 18,32" fill="#dc2626"/>
    </svg>\`;
  }
  if(t === 21){ // Callman (Chefe do Bar)
    return \`<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M7 6 Q16 2 25 6 L26 12 L6 12 Z" fill="#18181b"/>
      <rect x="8" y="12" width="16" height="13" rx="3" fill="#fed7aa"/>
      <rect x="9" y="14" width="6" height="3.5" rx="1" fill="#09090b"/>
      <rect x="17" y="14" width="6" height="3.5" rx="1" fill="#09090b"/>
      <line x1="15" y1="15" x2="17" y2="15" stroke="#09090b" stroke-width="1.5"/>
      <path d="M13 21 Q16 22 19 21" stroke="#78350f" stroke-width="1.5" fill="none"/>
      <path d="M6 25 L26 25 L28 32 L4 32 Z" fill="#27272a"/>
      <polygon points="16,25 14,32 18,32" fill="#ef4444"/>
    </svg>\`;
  }
  if(t === 7){ // Andore (Gigante)
    return \`<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M13 3 L19 3 L18 10 L14 10 Z" fill="#dc2626"/>
      <rect x="6" y="9" width="20" height="14" rx="4" fill="#fcd34d"/>
      <circle cx="11" cy="13" r="2" fill="#000"/>
      <circle cx="21" cy="13" r="2" fill="#000"/>
      <path d="M10 18 Q16 22 22 18" stroke="#000" stroke-width="2" fill="none"/>
      <path d="M4 23 L28 23 L30 32 L2 32 Z" fill="#b91c1c"/>
      <line x1="4" y1="23" x2="16" y2="32" stroke="#000" stroke-width="2"/>
    </svg>\`;
  }
  if(t === 6){ // May (Lutadora)
    return \`<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M7 6 Q16 2 25 6 L27 12 L5 12 Z" fill="#9333ea"/>
      <circle cx="26" cy="14" r="5" fill="#581c87"/>
      <rect x="9" y="11" width="14" height="12" rx="3" fill="#fbcfe8"/>
      <circle cx="12" cy="14" r="1.5" fill="#3b82f6"/>
      <circle cx="20" cy="14" r="1.5" fill="#3b82f6"/>
      <path d="M13 19 Q16 21 19 19" stroke="#db2777" stroke-width="1.5" fill="none"/>
      <path d="M7 23 L25 23 L27 32 L5 32 Z" fill="#a855f7"/>
      <polygon points="27,20 31,18 29,24" fill="#cbd5e1"/>
    </svg>\`;
  }
  if(t === 5){ // Billy
    return \`<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M8 8 Q16 4 24 8 L24 12 L8 12 Z" fill="#fde047"/>
      <rect x="8" y="11" width="16" height="12" rx="3" fill="#fed7aa"/>
      <circle cx="12" cy="14" r="1.5" fill="#000"/>
      <circle cx="20" cy="14" r="1.5" fill="#000"/>
      <path d="M12 18 Q16 20 20 18" stroke="#000" stroke-width="1.5" fill="none"/>
      <path d="M6 23 L26 23 L28 32 L4 32 Z" fill="#78350f"/>
    </svg>\`;
  }
  if(t === 8 || t === 9 || t === 10){ // Dirk / Hunter / G
    return \`<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M6 6 Q16 2 26 6 L26 13 L6 13 Z" fill="#15803d"/>
      <rect x="8" y="12" width="16" height="12" rx="3" fill="#fed7aa"/>
      <circle cx="12" cy="14" r="1.5" fill="#000"/>
      <circle cx="20" cy="14" r="1.5" fill="#000"/>
      <path d="M12 18 Q16 20 20 18" stroke="#000" stroke-width="1.5" fill="none"/>
      <path d="M5 23 L27 23 L29 32 L3 32 Z" fill="#166534"/>
    </svg>\`;
  }
  if(t === 14 || t === 19){ // Fat Jack / Arby
    return \`<svg viewBox="0 0 32 32" width="28" height="28">
      <ellipse cx="16" cy="8" rx="10" ry="4" fill="#3b82f6"/>
      <ellipse cx="16" cy="14" rx="9" ry="8" fill="#fed7aa"/>
      <circle cx="12" cy="13" r="1.5" fill="#000"/>
      <circle cx="20" cy="13" r="1.5" fill="#000"/>
      <path d="M13 18 Q16 20 19 18" stroke="#000" stroke-width="2" fill="none"/>
      <ellipse cx="16" cy="28" rx="14" ry="7" fill="#ec4899"/>
    </svg>\`;
  }
  if(t >= 27 && t <= 31){ // Barril / Caixa / Vaso
    return \`<svg viewBox="0 0 32 32" width="28" height="28">
      <rect x="5" y="6" width="22" height="22" rx="3" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      <line x1="5" y1="12" x2="27" y2="12" stroke="#78350f" stroke-width="1.5"/>
      <line x1="5" y1="22" x2="27" y2="22" stroke="#78350f" stroke-width="1.5"/>
      <line x1="5" y1="6" x2="27" y2="28" stroke="#451a03" stroke-width="1.5"/>
    </svg>\`;
  }
  return \`<svg viewBox="0 0 32 32" width="28" height="28">
    <circle cx="16" cy="10" r="7" fill="#fcd34d"/>
    <rect x="8" y="17" width="16" height="15" rx="3" fill="#2563eb"/>
    <circle cx="13" cy="10" r="1.5" fill="#000"/>
    <circle cx="19" cy="10" r="1.5" fill="#000"/>
    <path d="M13 14 Q16 16 19 14" stroke="#000" stroke-width="1.5" fill="none"/>
  </svg>\`;
}

// ===== Renderizador de Cenário Pixel-Art do Jogo (Canvas) =====
function drawStageBackground(canvas, stageId, totalW, totalH, zoom){
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  if(!ctx) return;

  canvas.width = totalW;
  canvas.height = totalH;

  ctx.save();
  ctx.scale(zoom, zoom);
  const w = totalW / zoom;
  const h = totalH / zoom;

  // Céu noturno com gradiente
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 75);
  skyGrad.addColorStop(0, '#090d1c');
  skyGrad.addColorStop(1, '#161d36');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, 75);

  // Silhueta de edifícios distantes com janelas acesas
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

  // Se for Fase 1 (Delegacia / Chinatown 1):
  if(stageId === 1){
    // SEÇÃO A: 0 a 280 px (Delegacia de Metro City)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 15, 280, 120);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    for(let y = 20; y < 135; y += 8){
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(280, y); ctx.stroke();
    }
    // Letreiro da Delegacia
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(40, 25, 180, 20);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 25, 180, 20);
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('METRO POLICE DEPT · PRECINCT 3', 46, 38);

    // Giroflex azul da delegacia
    ctx.fillStyle = '#2563eb';
    ctx.beginPath(); ctx.arc(130, 20, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.beginPath(); ctx.arc(130, 20, 14, 0, Math.PI * 2); ctx.fill();

    // Portas duplas de entrada da Delegacia (Porta 1: 60..180)
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

    // Carro de Polícia estacionado (X: 195..270)
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

    // Janelas orientais iluminadas
    for(let wx = 295; wx < 500; wx += 45){
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(wx, 40, 24, 32);
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(wx, 40, 24, 32);
      ctx.beginPath(); ctx.moveTo(wx + 12, 40); ctx.lineTo(wx + 12, 72); ctx.stroke();
    }

    // Lanternas chinesas vermelhas brilhando
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

    // Letreiro Neon: CREEP EATS
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

    // Porta Metálica de Enrolar (Shutter)
    ctx.fillStyle = '#334155';
    ctx.fillRect(554, 62, 82, 73);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for(let sy = 65; sy < 135; sy += 5){
      ctx.beginPath(); ctx.moveTo(554, sy); ctx.lineTo(636, sy); ctx.stroke();
    }
    // Dano de impacto / rachadura onde o inimigo bate
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.ellipse(595, 95, 18, 12, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 7.5px sans-serif';
    ctx.fillText('⚡ IMPACTO', 574, 98);

    // Faixas de alerta zebradas amarelo/preto
    for(let cx = 554; cx < 636; cx += 10){
      ctx.fillStyle = (cx % 20 === 0) ? '#eab308' : '#000';
      ctx.fillRect(cx, 130, 10, 5);
    }

    // Janela com persianas ao lado (X: 650..705)
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
    // Cenário genérico para outras fases (Galpão / Prédio Urbano)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 15, w, 120);
    for(let bx = 20; bx < w; bx += 80){
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(bx, 40, 45, 60);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(bx, 40, 45, 60);
    }
  }

  // Postes de iluminação de rua
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

  // Calçada / Passeio (Y: 135..155)
  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 135, w, 20);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  for(let sx = 0; sx < w; sx += 32){
    ctx.beginPath(); ctx.moveTo(sx, 135); ctx.lineTo(sx - 10, 155); ctx.stroke();
  }
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 154, w, 2); // meio-fio

  // Pista de Asfalto (Y: 155..224)
  ctx.fillStyle = '#1e2430';
  ctx.fillRect(0, 156, w, 68);
  ctx.fillStyle = '#eab308';
  for(let rx = 0; rx < w; rx += 50){
    ctx.fillRect(rx, 188, 30, 3); // faixa amarela
  }

  ctx.restore();
}
`;

if (!html.includes('drawStageBackground')) {
  html = html.replace('// ===== Estado da Interface =====', functionsCode + '\n// ===== Estado da Interface =====');
}

// 3. Add BOARD_VIEW_MODE to state
html = html.replace("let BOARD_ZOOM=1.5;", "let BOARD_ZOOM=1.5;\nlet BOARD_VIEW_MODE='pano';\nlet DRAGGING_DOOR=null;");

fs.writeFileSync('scratch/updated_part1.html', html);
console.log('Part 1 updated successfully');

