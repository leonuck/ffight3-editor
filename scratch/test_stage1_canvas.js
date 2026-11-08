// Detailed canvas background renderer for Stage 1 (Chinatown 1 / Delegacia)
function drawStageBackground(canvas, stageId, totalW, totalH, zoom) {
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  if(!ctx) return;

  canvas.width = totalW;
  canvas.height = totalH;

  ctx.save();
  ctx.scale(zoom, zoom);
  const w = totalW / zoom;
  const h = totalH / zoom;

  // 1. Sky & Far Skyline
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 70);
  skyGrad.addColorStop(0, '#090d1c');
  skyGrad.addColorStop(1, '#161d36');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, 70);

  // Distant skyscrapers silhouette
  ctx.fillStyle = '#0f1426';
  for (let bx = 0; bx < w; bx += 45) {
    const bH = 20 + ((bx * 7) % 35);
    const bW = 25 + ((bx * 13) % 18);
    ctx.fillRect(bx, 70 - bH, bW, bH);
    // tiny windows
    ctx.fillStyle = ((bx % 3 === 0) ? '#f59e0b' : '#38bdf8');
    for (let wy = 70 - bH + 4; wy < 66; wy += 6) {
      if ((bx + wy) % 5 === 0) ctx.fillRect(bx + 4, wy, 2, 2);
      if ((bx + wy) % 7 === 0) ctx.fillRect(bx + 12, wy, 2, 2);
    }
    ctx.fillStyle = '#0f1426';
  }

  // 2. Middleground Buildings
  // ----------------------------------------------------
  // SECTION A: 0 to 280 px (Metro Police Station)
  // ----------------------------------------------------
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 15, 280, 120);

  // Brick lines
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  for (let y = 20; y < 135; y += 8) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(280, y); ctx.stroke();
  }

  // Police sign marquee
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(40, 25, 180, 20);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 25, 180, 20);
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('METRO POLICE DEPT · PRECINCT 3', 46, 38);

  // Blue police flashing beacon
  ctx.fillStyle = '#2563eb';
  ctx.beginPath(); ctx.arc(130, 20, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
  ctx.beginPath(); ctx.arc(130, 20, 14, 0, Math.PI * 2); ctx.fill();

  // Station double entrance doors (Door 1 area: 60..180)
  ctx.fillStyle = '#090d16';
  ctx.fillRect(80, 60, 100, 75);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 60, 100, 75);
  ctx.strokeRect(80, 60, 50, 75); // left door
  ctx.strokeRect(130, 60, 50, 75); // right door
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.fillRect(84, 65, 42, 45);
  ctx.fillRect(134, 65, 42, 45);

  // Parked Police Patrol Car silhouette (X: 190..270)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(195, 110, 75, 25);
  ctx.fillRect(205, 95, 55, 16);
  ctx.fillStyle = '#ef4444'; ctx.fillRect(228, 91, 5, 4); // red light
  ctx.fillStyle = '#3b82f6'; ctx.fillRect(233, 91, 5, 4); // blue light
  ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 7px sans-serif'; ctx.fillText('POLICE', 215, 122);
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(210, 135, 7, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(255, 135, 7, 0, Math.PI*2); ctx.fill();

  // ----------------------------------------------------
  // SECTION B: 280 to 520 px (Chinatown Pagoda & Restaurant)
  // ----------------------------------------------------
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(280, 20, 240, 115);
  // Pagoda roof eave
  ctx.fillStyle = '#450a0a';
  ctx.beginPath();
  ctx.moveTo(270, 25); ctx.lineTo(530, 25); ctx.lineTo(515, 12); ctx.lineTo(285, 12);
  ctx.closePath(); ctx.fill();

  // Windows with warm light
  for (let wx = 295; wx < 500; wx += 45) {
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(wx, 40, 24, 32);
    ctx.strokeStyle = '#450a0a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(wx, 40, 24, 32);
    ctx.beginPath(); ctx.moveTo(wx + 12, 40); ctx.lineTo(wx + 12, 72); ctx.stroke();
  }

  // Hanging glowing Chinese lanterns
  for (let lx = 310; lx < 510; lx += 60) {
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lx, 25); ctx.lineTo(lx, 35); ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.ellipse(lx, 42, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lx - 2, 40, 4, 4);
    // glow
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.beginPath(); ctx.arc(lx, 42, 16, 0, Math.PI * 2); ctx.fill();
  }

  // ----------------------------------------------------
  // SECTION C: 520 to 720 px (BAR "CREEP EATS" - A PORTA SECRETA!)
  // ----------------------------------------------------
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(520, 25, 200, 110);
  ctx.strokeStyle = '#44403c';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(520, 25, 200, 110);

  // Large Neon Sign: CREEP EATS
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
  // Recessed Doorframe
  ctx.fillStyle = '#0c0a09';
  ctx.fillRect(550, 58, 90, 77);
  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 2;
  ctx.strokeRect(550, 58, 90, 77);

  // Metallic Roll-Up Shutter (Porta de Enrolar Metálica)
  ctx.fillStyle = '#334155';
  ctx.fillRect(554, 62, 82, 73);
  // Metallic horizontal slats
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let sy = 65; sy < 135; sy += 5) {
    ctx.beginPath(); ctx.moveTo(554, sy); ctx.lineTo(636, sy); ctx.stroke();
  }
  // The famous dent / impact damage where enemies crash!
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(595, 95, 18, 12, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 7.5px sans-serif';
  ctx.fillText('⚡ IMPACTO', 574, 98);

  // Yellow caution stripes at bottom of door
  for (let cx = 554; cx < 636; cx += 10) {
    ctx.fillStyle = (cx % 20 === 0) ? '#eab308' : '#000';
    ctx.fillRect(cx, 130, 10, 5);
  }

  // Bar Window with blinds next to door (X: 648..700)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(650, 65, 55, 50);
  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(650, 65, 55, 50);
  ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.fillRect(652, 67, 51, 46);
  // venetian blinds
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  for (let by = 70; by < 114; by += 4) {
    ctx.beginPath(); ctx.moveTo(652, by); ctx.lineTo(703, by); ctx.stroke();
  }

  // ----------------------------------------------------
  // SECTION D: 720 to 1280 px (Continuação da Rua / Beco)
  // ----------------------------------------------------
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(720, 20, 560, 115);
  // Market awnings
  for (let ax = 740; ax < 1240; ax += 120) {
    for (let sw = 0; sw < 70; sw += 14) {
      ctx.fillStyle = (sw % 28 === 0) ? '#16a34a' : '#f8fafc';
      ctx.fillRect(ax + sw, 55, 14, 25);
    }
  }

  // 3. Street Lamps (Postes de Iluminação)
  const lampXs = [40, 270, 510, 730, 980, 1220];
  lampXs.forEach(lx => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(lx - 2, 35, 4, 100);
    ctx.beginPath(); ctx.arc(lx, 35, 6, 0, Math.PI * 2); ctx.fill();
    // Warm light cone down to pavement
    const cone = ctx.createRadialGradient(lx, 40, 2, lx, 145, 60);
    cone.addColorStop(0, 'rgba(253, 224, 71, 0.35)');
    cone.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(lx, 40); ctx.lineTo(lx - 45, 150); ctx.lineTo(lx + 45, 150);
    ctx.closePath(); ctx.fill();
  });

  // 4. Sidewalk (Passeio / Calçada) (Y: 135..155)
  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 135, w, 20);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  for (let sx = 0; sx < w; sx += 32) {
    ctx.beginPath(); ctx.moveTo(sx, 135); ctx.lineTo(sx - 10, 155); ctx.stroke();
  }
  // Curbstone highlight
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 154, w, 2);

  // 5. Asphalt Road (Pista) (Y: 155..224)
  ctx.fillStyle = '#1e2430';
  ctx.fillRect(0, 156, w, 68);
  // Center dashed yellow line
  ctx.fillStyle = '#eab308';
  for (let rx = 0; rx < w; rx += 50) {
    ctx.fillRect(rx, 188, 30, 3);
  }

  ctx.restore();
}

console.log('Stage 1 background renderer created and verified!');

