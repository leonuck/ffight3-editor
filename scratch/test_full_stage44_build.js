const fs = require('fs');

const origRom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const rom = new Uint8Array(origRom);
const h = 0;

const TABLE = 0x34000;
const FREE_RUNS=[[0xE55A8,0xE7E00],[0x0BEA20,0xC0000],[0x04254A,0x43000],[0x0336B6,0x34000]];
function isZero(rom,h,a,b){for(let i=a;i<b;i++)if(rom[i+h]!==0&&rom[i+h]!==255)return false;return true;}
function serialize(items){const out=[];for(const it of items)out.push(...it.b);out.push(0xFF,0xFF);return Uint8Array.from(out);}
function checksum(rom,h){
  const d=rom.subarray(h);let sum=0;
  if(d.length===0x300000){let a=0,b=0;for(let i=0;i<0x200000;i++)a+=d[i];for(let i=0x200000;i<d.length;i++)b+=d[i];sum=(a+2*b)&0xFFFF;}
  else{for(let i=0;i<d.length;i++)sum+=d[i];sum&=0xFFFF;}
  return sum;
}
function fixChecksum(rom,h){
  const c=checksum(rom,h);const a=0xFFDC+h;
  rom[a]=(c^0xFFFF)&255;rom[a+1]=((c^0xFFFF)>>8)&255;rom[a+2]=c&255;rom[a+3]=c>>8;return c;
}

// Stage 44 object
const stage44 = {
  row: 43,
  id: 44,
  area: 44,
  name: "SALA SECRETA (Fase 44)",
  templateStage: 7, // Bar Creep Eats
  ptrAt: 0x342B3 + 12,
  start: 0xE55A8,
  end: 0xE55A8,
  items: [
    { t: 'rec', b: [0, 0, 0, 0, 5, 0, 0, 80, 0, 50, 0, 180, 0, 0, 0, 0, 0] },
    { t: 'rec', b: [0, 0, 0, 0, 6, 0, 0, 70, 0, 200, 0, 185, 0, 0, 0, 0, 0] },
    { t: 'cmd', b: [0xFF, 0x01] },
    { t: 'rec', b: [0, 0, 0, 0, 7, 0, 0, 140, 0, 128, 0, 180, 0, 0, 0, 0, 0] },
    { t: 'cmd', b: [0xFF, 0x02] }
  ],
  orig: []
};

// Simulation of buildRom writing stage 44:
function applyStage44ToRom(rom, h, s44, tplStageId) {
  const s44Off = 0x342B3 + h;
  // Read template pointers
  let a = TABLE + h;
  let curTpl = 1;
  let tplPointers = null;
  while (a < TABLE + h + 0x300) {
    const ptrs = [];
    while (rom[a+2] >= 0xC0 && rom[a+2] < 0xF0) {
      ptrs.push(rom[a] | (rom[a+1] << 8) | (rom[a+2] << 16));
      a += 3;
    }
    if (!ptrs.length) break;
    if (curTpl === tplStageId) {
      tplPointers = ptrs;
      break;
    }
    curTpl++;
    if (rom[a] === 0) a++;
  }

  if (!tplPointers) throw new Error('Template stage not found: ' + tplStageId);

  // Write 4 visual pointers to 0x342B3
  for (let p = 0; p < 4; p++) {
    const v = tplPointers[p];
    rom[s44Off + p*3] = v & 0xFF;
    rom[s44Off + p*3 + 1] = (v >> 8) & 0xFF;
    rom[s44Off + p*3 + 2] = (v >> 16) & 0xFF;
  }
  // Terminator at offset 15
  rom[s44Off + 15] = 0x00;

  // Copy 12 bytes metadata from template to C0:0F39
  const metaBase = 0x0D35 + h;
  const tplMetaOff = metaBase + (tplStageId - 1) * 12;
  const s44MetaOff = metaBase + (44 - 1) * 12;
  for (let i = 0; i < 12; i++) {
    rom[s44MetaOff + i] = rom[tplMetaOff + i];
  }
}

applyStage44ToRom(rom, h, stage44, 7);

// Now run allocator on stage44
const runs = FREE_RUNS.map(r => ({ a: r[0], b: r[1], p: r[0] })).filter(r => isZero(rom, h, r.a, r.b));
const bytes = serialize(stage44.items);
const run = runs.find(r => r.b - r.p >= bytes.length);
const dst = run.p; run.p += bytes.length;
rom.set(bytes, dst + h);
const snes = 0xC00000 + dst;
rom[stage44.ptrAt + h] = snes & 255;
rom[stage44.ptrAt + 1 + h] = (snes >> 8) & 255;
rom[stage44.ptrAt + 2 + h] = (snes >> 16) & 255;

fixChecksum(rom, h);

console.log('ROM built with Stage 44!');
console.log('Script written at SNES 0x' + snes.toString(16));
console.log('Checksum fixed: 0x' + checksum(rom, h).toString(16));

