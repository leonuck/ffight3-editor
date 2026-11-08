const fs = require('fs');
let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

const target = `  if(!s44){
    if(rom[0x000120+h]===0x22&&rom[0x000121+h]===0x80&&rom[0x000122+h]===0xF3&&rom[0x000123+h]===0xC0){
      rom[0x000120+h]=0x8D;rom[0x000121+h]=0x03;rom[0x000122+h]=0x1F;rom[0x000123+h]=0xC9;rom[0x000124+h]=0x48;
      log.push('Engine: Gerenciador de Áudio/APU desativado (C0:0120 restaurado)');
    }
  }

  // Alocador simples de scripts nas áreas livres
  const runs = FREE_RUNS.map(r=>({a:r[0],b:r[1],p:r[0]})).filter(r=>isZero(rom,h,r.a,r.b));

  // Suporte a Nova Sala Secreta (Fase 44)
  const s44 = st.stages.find(s => s.id === 44);
  if(s44){`;

const replacement = `  // Suporte a Nova Sala Secreta (Fase 44)
  const s44 = st.stages.find(s => s.id === 44);
  if(!s44){
    if(rom[0x000120+h]===0x22&&rom[0x000121+h]===0x80&&rom[0x000122+h]===0xF3&&rom[0x000123+h]===0xC0){
      rom[0x000120+h]=0x8D;rom[0x000121+h]=0x03;rom[0x000122+h]=0x1F;rom[0x000123+h]=0xC9;rom[0x000124+h]=0x48;
      log.push('Engine: Gerenciador de Áudio/APU desativado (C0:0120 restaurado)');
    }
  }

  // Alocador simples de scripts nas áreas livres
  const runs = FREE_RUNS.map(r=>({a:r[0],b:r[1],p:r[0]})).filter(r=>isZero(rom,h,r.a,r.b));

  if(s44){`;

if (!html.includes(target)) {
  throw new Error('target not found');
}
html = html.replace(target, replacement);
fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('✓ s44 declaration order fixed!');

