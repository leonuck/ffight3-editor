const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

// 1. Update fallback restore if !s44
const oldFallback = `  } else if(!opts.secretDoor){
    if(rom[0x0012F4+h]===0x20&&rom[0x0012F5+h]===0x60&&rom[0x0012F6+h]===0xF0){
      rom[0x0012F4+h]=0x20;rom[0x0012F5+h]=0x66;rom[0x0012F6+h]=0x22;
      log.push('Engine: Gancho de porta secreta desativado (C0:12F4 restaurado para JSR $2266)');
    }
    if(rom[0x00132A+h]===0x22&&rom[0x00132B+h]===0x40&&rom[0x00132C+h]===0xF3&&rom[0x00132D+h]===0xC0){
      rom[0x00132A+h]=0x22;rom[0x00132B+h]=0x09;rom[0x00132C+h]=0xE0;rom[0x00132D+h]=0xC0;
      log.push('Engine: Gancho de retorno desativado (C0:132A restaurado para JSL $C0E009)');
    }
  }`;

const newFallback = `  } else if(!opts.secretDoor){
    if(rom[0x0012F4+h]===0x20&&rom[0x0012F5+h]===0x60&&rom[0x0012F6+h]===0xF0){
      rom[0x0012F4+h]=0x20;rom[0x0012F5+h]=0x66;rom[0x0012F6+h]=0x22;
      log.push('Engine: Gancho de porta secreta desativado (C0:12F4 restaurado para JSR $2266)');
    }
    if(rom[0x00132A+h]===0x22&&rom[0x00132B+h]===0x40&&rom[0x00132C+h]===0xF3&&rom[0x00132D+h]===0xC0){
      rom[0x00132A+h]=0x22;rom[0x00132B+h]=0x09;rom[0x00132C+h]=0xE0;rom[0x00132D+h]=0xC0;
      log.push('Engine: Gancho de retorno desativado (C0:132A restaurado para JSL $C0E009)');
    }
  }
  if(!s44){
    if(rom[0x000120+h]===0x22&&rom[0x000121+h]===0x80&&rom[0x000122+h]===0xF3&&rom[0x000123+h]===0xC0){
      rom[0x000120+h]=0x8D;rom[0x000121+h]=0x03;rom[0x000122+h]=0x1F;rom[0x000123+h]=0xC9;rom[0x000124+h]=0x48;
      log.push('Engine: Gerenciador de Áudio/APU desativado (C0:0120 restaurado)');
    }
  }`;

if (!html.includes(oldFallback)) {
  throw new Error('oldFallback not found');
}
html = html.replace(oldFallback, newFallback);
console.log('✓ Fallback restore updated!');

// 2. Update initial bgCustom BGM default
html = html.replace('bgm: 0x12,', 'bgm: 0x07,');

// 3. Update BGM dropdown in HTML UI
const oldBgmUi = `<select id="sel_bar_bgm">
                <option value="18" \${(bc.bgm||0x12)===0x12?'selected':''}>🎵 Club Capcom Theme (Original)</option>
                <option value="10" \${(bc.bgm||0x12)===0x0A?'selected':''}>⚡ Boss Battle (Tema de Chefe)</option>
                <option value="6" \${(bc.bgm||0x12)===0x06?'selected':''}>🎸 Round 1 Street (Tema das Ruas)</option>
                <option value="28" \${(bc.bgm||0x12)===0x1C?'selected':''}>💼 Dave's Office (Gabinete Político)</option>
                <option value="14" \${(bc.bgm||0x12)===0x0E?'selected':''}>🎷 Round 2 Main Street</option>
              </select>`;

const newBgmUi = `<select id="sel_bar_bgm">
                <option value="7" \${(bc.bgm||0x07)===0x07?'selected':''}>🎵 Club Capcom Theme (Original do Bar)</option>
                <option value="5" \${(bc.bgm||0x07)===0x05?'selected':''}>⚡ Boss Battle (Tema de Chefe Dave)</option>
                <option value="4" \${(bc.bgm||0x07)===0x04?'selected':''}>🎸 Round 1 Street (Tema das Ruas)</option>
                <option value="6" \${(bc.bgm||0x07)===0x06?'selected':''}>🎷 Round 2 Main Street</option>
              </select>`;

if (!html.includes(oldBgmUi)) {
  throw new Error('oldBgmUi not found');
}
html = html.replace(oldBgmUi, newBgmUi);
console.log('✓ BGM dropdown UI updated!');

// 4. Update presets
const oldPresets = `        if(p === 'bar-classic'){
          s.templateStage = 7;
          s.bgCustom = { type: 'bar', layout: 'classic', paletteTheme: 'classic', bgm: 0x12 };
        } else if(p === 'fight-club'){
          s.templateStage = 7;
          s.bgCustom = { type: 'bar', layout: 'arena', paletteTheme: 'classic', bgm: 0x0A };
        } else if(p === 'vip-lounge'){
          s.templateStage = 7;
          s.bgCustom = { type: 'bar', layout: 'arena', paletteTheme: 'blue', bgm: 0x12 };
        } else if(p === 'blood-club'){
          s.templateStage = 7;
          s.bgCustom = { type: 'bar', layout: 'arena', paletteTheme: 'red', bgm: 0x0A };
        }`;

const newPresets = `        if(p === 'bar-classic'){
          s.templateStage = 7;
          s.bgCustom = { type: 'bar', layout: 'classic', paletteTheme: 'classic', bgm: 0x07 };
        } else if(p === 'fight-club'){
          s.templateStage = 7;
          s.bgCustom = { type: 'bar', layout: 'arena', paletteTheme: 'classic', bgm: 0x05 };
        } else if(p === 'vip-lounge'){
          s.templateStage = 7;
          s.bgCustom = { type: 'bar', layout: 'arena', paletteTheme: 'blue', bgm: 0x07 };
        } else if(p === 'blood-club'){
          s.templateStage = 7;
          s.bgCustom = { type: 'bar', layout: 'arena', paletteTheme: 'red', bgm: 0x05 };
        }`;

if (!html.includes(oldPresets)) {
  throw new Error('oldPresets not found');
}
html = html.replace(oldPresets, newPresets);
console.log('✓ Presets updated!');

fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('★★★ FF3_Script_Editor.html successfully updated! ★★★');
