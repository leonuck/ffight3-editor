const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

const oldGfxScriptFn = `function buildBarGfxLoaderScript(bc, palSnesAddr){
  const bytes = [];
  // 1. Descompacta CHR tiles (4bpp) -> WRAM 7F:0000
  bytes.push(0x4D, 0xE0, 0x6E, 0xC5, 0x00, 0x00, 0x7F);
  // 2. DMA CHR para VRAM 0x0000 (tamanho 0x8000)
  bytes.push(0x44, 0x00, 0x00, 0x7F, 0x00, 0x00, 0x00, 0x80);
  // 3. Descompacta Tilemaps do Bar -> WRAM 7E:8000
  bytes.push(0x4D, 0x80, 0x8A, 0xCA, 0x00, 0x80, 0x7E);
  // 4. DMA BG2 para VRAM 0x4000 (tamanho 0x1000)
  bytes.push(0x44, 0x00, 0xA0, 0x7E, 0x00, 0x40, 0x00, 0x10);
  // 5. DMA BG1 para VRAM 0x4800 (tamanho 0x1000)
  bytes.push(0x44, 0x00, 0x80, 0x7E, 0x00, 0x48, 0x00, 0x10);
  // 6. Descompacta Metatiles -> WRAM 7E:2000
  bytes.push(0x4D, 0xE0, 0xCA, 0xCB, 0x00, 0x20, 0x7E);

  // 7. Se layout === 'arena', apaga as mesas do BG2 em VRAM 0x42AC e 0x46AC usando DMA de bytes zero
  if (bc && bc.layout === 'arena') {
    bytes.push(0x44, 0x00, 0x50, 0xCE, 0xAC, 0x42, 0x40, 0x00);
    bytes.push(0x44, 0x00, 0x50, 0xCE, 0xAC, 0x46, 0x40, 0x00);
  }

  // 8. DMA Paleta CGRAM 0x00C0 (32 bytes)
  const p0 = palSnesAddr & 0xFF;
  const p1 = (palSnesAddr >> 8) & 0xFF;
  const p2 = (palSnesAddr >> 16) & 0xFF;
  bytes.push(0x43, p0, p1, p2, 0xC0, 0x00, 0x20, 0x00);

  // 9. Terminador
  bytes.push(0x45);
  return new Uint8Array(bytes);
}`;

const newGfxScriptFn = `function getSoundBankForBgm(bgm){
  if(bgm === 0x04 || bgm === 0x05) return 0x01; // Round 1
  if(bgm === 0x06 || bgm === 0x07) return 0x20; // Round 2
  if(bgm >= 0x08 && bgm <= 0x0F) return 0x21;   // Round 3 / 4A
  if(bgm >= 0x11 && bgm <= 0x1F) return 0x22;   // Round 4B / 5
  if(bgm >= 0x20 && bgm <= 0x24) return 0x23;   // Round 6 / Final
  return 0x20;
}

function getSoundBankForStage(stageId){
  if(stageId <= 3) return 0x01;
  if(stageId <= 7) return 0x20;
  if(stageId <= 18) return 0x21;
  if(stageId <= 35) return 0x22;
  if(stageId <= 42) return 0x23;
  return 0x01;
}

// Hook executado durante a tela preta de transição de fase (C0:0120)
// Gerencia a troca dinâmica do banco de som do APU/SPC700 para qualquer trilha da Fase 44
function buildStage44BgmTransitionHook(s44SoundBank, exitSoundBank){
  const c = [];
  const b = (...v) => c.push(...v);

  // 1. STA $1F03 (instrução original de C0:0120 substituída)
  b(0x8D, 0x03, 0x1F);

  // 2. Está entrando na Fase 44?
  b(0xC9, 44);
  const j_not_enter = c.length; b(0xD0, 0);

  // Entrando na Fase 44: verifica se s44SoundBank já está ativo
  b(0xA9, s44SoundBank);
  b(0xCD, 0x00, 0x1F); // CMP $1F00
  const j_same_enter = c.length; b(0xF0, 0);
  b(0x8D, 0x00, 0x1F); // STA $1F00
  b(0x22, 0x00, 0x00, 0xEC); // JSL $EC0000 (carga de instrumentos no SPC700)
  b(0x9C, 0x0D, 0x1F); // STZ $1F0D (reseta BGM para forçar toque imediato)
  const j_done_enter = c.length; b(0x80, 0);

  // .check_exit:
  const check_exit_addr = c.length;
  c[j_not_enter + 1] = (check_exit_addr - (j_not_enter + 2)) & 0xFF;
  const same_enter_addr = c.length;
  c[j_same_enter + 1] = (same_enter_addr - (j_same_enter + 2)) & 0xFF;

  b(0xAD, 0x00, 0x00); // LDA $0000 (fase anterior)
  b(0xC9, 44);
  const j_not_exit = c.length; b(0xD0, 0);

  // Saindo da Fase 44: restaura o Sound Bank da fase de saída
  b(0xA9, exitSoundBank);
  b(0xCD, 0x00, 0x1F); // CMP $1F00
  const j_same_exit = c.length; b(0xF0, 0);
  b(0x8D, 0x00, 0x1F); // STA $1F00
  b(0x22, 0x00, 0x00, 0xEC); // JSL $EC0000
  b(0x9C, 0x0D, 0x1F); // STZ $1F0D

  const done_addr = c.length;
  c[j_done_enter + 1] = (done_addr - (j_done_enter + 2)) & 0xFF;
  c[j_not_exit + 1] = (done_addr - (j_not_exit + 2)) & 0xFF;
  c[j_same_exit + 1] = (done_addr - (j_same_exit + 2)) & 0xFF;

  // .done: restaura flags para o BPL subsequente
  b(0xAD, 0x03, 0x1F); // LDA $1F03
  b(0xC9, 0x48);       // CMP #$48
  b(0x6B);             // RTL

  return c;
}

function buildBarGfxLoaderScript(bc, palSnesAddr){
  const bytes = [];
  // 1. Descompacta CHR tiles (4bpp) -> WRAM 7F:0000
  bytes.push(0x4D, 0xE0, 0x6E, 0xC5, 0x00, 0x00, 0x7F);
  // 2. DMA CHR para VRAM 0x0000 (tamanho 0x8000)
  bytes.push(0x44, 0x00, 0x00, 0x7F, 0x00, 0x00, 0x00, 0x80);
  // 3. Descompacta Tilemaps do Bar -> WRAM 7E:8000
  bytes.push(0x4D, 0x80, 0x8A, 0xCA, 0x00, 0x80, 0x7E);
  // 4. DMA BG2 para VRAM 0x4000 (tamanho 0x1000)
  bytes.push(0x44, 0x00, 0xA0, 0x7E, 0x00, 0x40, 0x00, 0x10);
  // 5. DMA BG1 para VRAM 0x4800 (tamanho 0x1000)
  bytes.push(0x44, 0x00, 0x80, 0x7E, 0x00, 0x48, 0x00, 0x10);
  // 6. Descompacta Metatiles -> WRAM 7E:2000
  bytes.push(0x4D, 0xE0, 0xCA, 0xCB, 0x00, 0x20, 0x7E);

  // 7. DMA Paleta CGRAM 0x00C0 (32 bytes) com flags/parâmetros 0x0018 originais
  const p0 = palSnesAddr & 0xFF;
  const p1 = (palSnesAddr >> 8) & 0xFF;
  const p2 = (palSnesAddr >> 16) & 0xFF;
  bytes.push(0x43, p0, p1, p2, 0xC0, 0x00, 0x20, 0x00, 0x18, 0x00);

  // 8. Terminador 'E' (0x45)
  bytes.push(0x45);
  return new Uint8Array(bytes);
}`;

if (!html.includes(oldGfxScriptFn)) throw new Error('oldGfxScriptFn not found');
html = html.replace(oldGfxScriptFn, newGfxScriptFn);

const oldInjection = `      // Injeção de Cenário Customizado da Fase 44 (Club Capcom)
      if(tplStageId === 7 && s44.bgCustom && s44.bgCustom.type === 'bar'){
        const bc = s44.bgCustom;

        // 1. Música BGM no byte 0 de metadados
        if(bc.bgm != null){
          rom[s44MetaOff + 0] = bc.bgm & 0xFF;
          log.push('Cenário Fase 44: Música BGM alterada na ROM para 0x' + (bc.bgm & 0xFF).toString(16).toUpperCase());
        }

        // 2. Paleta CGRAM gravada na ROM
        let palSnesAddr = 0xC36482; // Paleta original
        const palTheme = bc.paletteTheme || 'classic';
        if(palTheme !== 'classic' && BAR_PALETTES[palTheme]){
          const palBytes = new Uint8Array(BAR_PALETTES[palTheme]);
          const runP = runs.find(r => r.b - r.p >= palBytes.length);
          if(runP){
            const atP = runP.p; runP.p += palBytes.length;
            rom.set(palBytes, atP + h);
            palSnesAddr = 0xC00000 + atP;
            log.push(\`Cenário Fase 44: Paleta CGRAM [\${palTheme}] gravada em C\${(atP>>16).toString(16).toUpperCase()}:\${(atP&0xFFFF).toString(16).toUpperCase().padStart(4,'0')}\`);
          }
        }

        // 3. GFX Loader Script gravado na ROM
        const gfxScript = buildBarGfxLoaderScript(bc, palSnesAddr);
        const runS = runs.find(r => r.b - r.p >= gfxScript.length);
        if(runS){
          const atS = runS.p; runS.p += gfxScript.length;
          rom.set(gfxScript, atS + h);
          const scriptSnes = 0xC00000 + atS;
          rom[s44Off + 3] = scriptSnes & 0xFF;
          rom[s44Off + 4] = (scriptSnes >> 8) & 0xFF;
          rom[s44Off + 5] = (scriptSnes >> 16) & 0xFF;
          log.push(\`Cenário Fase 44: GFX Loader script gravado em C\${(atS>>16).toString(16).toUpperCase()}:\${(atS&0xFFFF).toString(16).toUpperCase().padStart(4,'0')}\`);
        }

        // 4. Objetos Interativos (Pointer 2): se modo arena, sala limpa sem mesas
        if(bc.layout === 'arena'){
          rom[s44Off + 6] = 0xB5;
          rom[s44Off + 7] = 0xA8;
          rom[s44Off + 8] = 0xC3; // Aponta para C3:A8B5 (sala limpa de obstáculos)
          log.push('Cenário Fase 44: Modo Arena Livre ativo na ROM (Mesas removidas de VRAM e da colisão física)');
        }
      }`;

const newInjection = `      // Determina a BGM desejada para a Fase 44
      const bc = s44.bgCustom;
      const targetBgm = (bc && bc.bgm != null) ? (bc.bgm & 0xFF) : (rom[(tplPointers[0] - 0xC00000) + h] || 0x07);

      // 1. Clona Pointer 0 (75 bytes) com Byte 0 = targetBgm
      const tplP0Addr = tplPointers[0];
      const tplP0Off = (tplP0Addr - 0xC00000) + h;
      const p0Len = 75;
      const p0Bytes = new Uint8Array(rom.slice(tplP0Off, tplP0Off + p0Len));
      p0Bytes[0] = targetBgm;

      const runP0 = runs.find(r => r.b - r.p >= p0Len);
      if(runP0){
        const atP0 = runP0.p; runP0.p += p0Len;
        rom.set(p0Bytes, atP0 + h);
        const p0Snes = 0xC00000 + atP0;
        rom[s44Off + 0] = p0Snes & 0xFF;
        rom[s44Off + 1] = (p0Snes >> 8) & 0xFF;
        rom[s44Off + 2] = (p0Snes >> 16) & 0xFF;
        log.push(\`Cenário Fase 44: Metadados P0 e BGM (0x\${targetBgm.toString(16).toUpperCase()}) gravados em C\${(atP0>>16).toString(16).toUpperCase()}:\${(atP0&0xFFFF).toString(16).toUpperCase().padStart(4,'0')}\`);
      }

      // 2. Patch de Transição de Áudio em C0:0120 (carrega Sound Bank durante a tela preta)
      const s44SoundBank = getSoundBankForBgm(targetBgm);
      const exitDoor = (opts.secretDoors||[]).find(d => d.destStage === 44);
      const exitStage = (exitDoor && exitDoor.exitStage) ? exitDoor.exitStage : 3;
      const exitSoundBank = getSoundBankForStage(exitStage);

      const bgmHook = buildStage44BgmTransitionHook(s44SoundBank, exitSoundBank);
      for(let i=0; i<0x70; i++) rom[0x00F380 + h + i] = 0xEA;
      rom.set(new Uint8Array(bgmHook), 0x00F380 + h);
      rom[0x000120 + h] = 0x22;
      rom[0x000121 + h] = 0x80;
      rom[0x000122 + h] = 0xF3;
      rom[0x000123 + h] = 0xC0;
      rom[0x000124 + h] = 0xEA;
      log.push(\`Engine: Gerenciador de Áudio/APU instalado em C0:F380 (Entrada: Bank 0x\${s44SoundBank.toString(16).toUpperCase()}, Retorno: Bank 0x\${exitSoundBank.toString(16).toUpperCase()})\`);

      // 3. Customizações Visuais para Club Capcom (Template 7)
      if(tplStageId === 7 && s44.bgCustom && s44.bgCustom.type === 'bar'){
        // Paleta CGRAM gravada na ROM
        let palSnesAddr = 0xC36482; // Paleta original
        const palTheme = bc.paletteTheme || 'classic';
        if(palTheme !== 'classic' && BAR_PALETTES[palTheme]){
          const palBytes = new Uint8Array(BAR_PALETTES[palTheme]);
          const runP = runs.find(r => r.b - r.p >= palBytes.length);
          if(runP){
            const atP = runP.p; runP.p += palBytes.length;
            rom.set(palBytes, atP + h);
            palSnesAddr = 0xC00000 + atP;
            log.push(\`Cenário Fase 44: Paleta CGRAM [\${palTheme}] gravada em C\${(atP>>16).toString(16).toUpperCase()}:\${(atP&0xFFFF).toString(16).toUpperCase().padStart(4,'0')}\`);
          }
        }

        // GFX Loader Script gravado na ROM (56 bytes finalizando com 18 00 45)
        const gfxScript = buildBarGfxLoaderScript(bc, palSnesAddr);
        const runS = runs.find(r => r.b - r.p >= gfxScript.length);
        if(runS){
          const atS = runS.p; runS.p += gfxScript.length;
          rom.set(gfxScript, atS + h);
          const scriptSnes = 0xC00000 + atS;
          rom[s44Off + 3] = scriptSnes & 0xFF;
          rom[s44Off + 4] = (scriptSnes >> 8) & 0xFF;
          rom[s44Off + 5] = (scriptSnes >> 16) & 0xFF;
          log.push(\`Cenário Fase 44: GFX Loader script gravado em C\${(atS>>16).toString(16).toUpperCase()}:\${(atS&0xFFFF).toString(16).toUpperCase().padStart(4,'0')}\`);
        }

        // Objetos Interativos (Pointer 2): se modo arena, sala limpa sem mesas
        if(bc.layout === 'arena'){
          rom[s44Off + 6] = 0xB5;
          rom[s44Off + 7] = 0xA8;
          rom[s44Off + 8] = 0xC3; // Aponta para C3:A8B5 (sala limpa de obstáculos)
          log.push('Cenário Fase 44: Modo Arena Livre ativo na ROM (Mesas removidas de VRAM e da colisão física)');
        }
      }`;

if (!html.includes(oldInjection)) throw new Error('oldInjection not found');
html = html.replace(oldInjection, newInjection);

fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('✓ Successfully applied clean patch to FF3_Script_Editor.html!');

