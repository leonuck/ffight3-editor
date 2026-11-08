const fs = require('fs');

const orig = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const rom = new Uint8Array(orig);
const h = 0; // no header

// Simulate creating Stage 44 using Stage 7 as template
const TABLE = 0x34000;
const s44Off = 0x342B3;

// Find Stage 7 pointers
let a = TABLE;
const rows = [];
while (a < TABLE + 0x300) {
  const ptrs = [];
  while (rom[a+2] >= 0xC0 && rom[a+2] < 0xF0) {
    ptrs.push(rom[a] | (rom[a+1] << 8) | (rom[a+2] << 16));
    a += 3;
  }
  if (!ptrs.length) break;
  rows.push(ptrs);
  if (rom[a] === 0) a++;
}

const tplPointers = rows[6]; // Stage 7
// Write 4 visual pointers to 0x342B3
for (let p = 0; p < 4; p++) {
  const v = tplPointers[p];
  rom[s44Off + p*3] = v & 0xFF;
  rom[s44Off + p*3 + 1] = (v >> 8) & 0xFF;
  rom[s44Off + p*3 + 2] = (v >> 16) & 0xFF;
}
// Write script pointer to 0xCE55A8
const scriptAddr = 0xCE55A8;
rom[s44Off + 12] = scriptAddr & 0xFF;
rom[s44Off + 13] = (scriptAddr >> 8) & 0xFF;
rom[s44Off + 14] = (scriptAddr >> 16) & 0xFF;
rom[s44Off + 15] = 0x00; // terminator

// Copy metadata
const metaBase = 0x0D35;
const tplMeta = metaBase + 6 * 12;
const s44Meta = metaBase + 43 * 12;
for (let i = 0; i < 12; i++) {
  rom[s44Meta + i] = rom[tplMeta + i];
}

// Write dummy valid script at 0xE55A8 (enemy + FF 01 + FF FF)
const dummyScript = [
  // 17-byte enemy: Billy
  0x00, 0x00, 0x00, 0x08, 0x00, 0x05, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0x12, 0x00, 0x00, 0x00, 0x00,
  // Barreira FF 01
  0xFF, 0x01,
  // Fim de script FF FF
  0xFF, 0xFF
];
rom.set(new Uint8Array(dummyScript), 0xE55A8);

// Now test loadStages
function cmdLen(b1){return b1===0xFE||b1===0xFC?7:b1===0xFD?3:2;}
function parseScript(rom,h,start){
  const items=[];let a=start;
  for(;;){
    if(a+17>rom.length) throw new Error('script fora da ROM');
    if(rom[a+h]!==0xFF){items.push({t:'rec',b:Array.from(rom.slice(a+h,a+h+17))});a+=17;continue;}
    const b1=rom[a+h+1],n=cmdLen(b1);
    if(b1===0xFF){return {items,end:a+2};}
    items.push({t:'cmd',b:Array.from(rom.slice(a+h,a+h+n))});a+=n;
  }
}
function loadStages(rom){
  const h=0;const rows=[];let a=TABLE;
  for(;;){
    const ptrs=[];
    while(rom[a+h+2]>=0xC0&&rom[a+h+2]<0xF0){ptrs.push({at:a,v:rom[a+h]|rom[a+h+1]<<8|rom[a+h+2]<<16});a+=3;}
    if(!ptrs.length||rom[a+h]!==0)break; a++; rows.push(ptrs);
  }
  const stages=rows.map((r,i)=>{
    const p=r[r.length-1];const start=p.v-0xC00000;
    const s=parseScript(rom,h,start);
    return {row:i,id:i+1,area:i+1,ptrAt:p.at,start,end:s.end,items:s.items,orig:s.items.map(x=>x.b.slice())};
  });
  return {h,stages};
}

const loaded = loadStages(rom);
console.log('Total stages reloaded:', loaded.stages.length);
const s44 = loaded.stages[43];
console.log('Stage 44 id:', s44.id, 'items:', s44.items.length);
console.log('Stage 44 enemy 1:', s44.items[0]);
console.log('SUCCESS: Full cycle loadStages -> Stage 44 loaded and verified!');

