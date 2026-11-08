const fs = require('fs');

const origRom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

// Let's test the complete Stage 44 buildRom logic
const TABLE=0x34000;
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

// Stage 44 Starter script items
function createStage44StarterItems() {
  return [
    // Inimigo 1: Billy
    { t: 'rec', b: [0, 0, 0, 0, 5, 0, 0, 80, 0, 50, 0, 180, 0, 0, 0, 0, 0] },
    // Inimigo 2: May
    { t: 'rec', b: [0, 0, 0, 0, 6, 0, 0, 70, 0, 200, 0, 185, 0, 0, 0, 0, 0] },
    // Barreira 1 (FF 01)
    { t: 'cmd', b: [0xFF, 0x01] },
    // Inimigo 3: Andore (Chefe da Sala)
    { t: 'rec', b: [0, 0, 0, 0, 7, 0, 0, 140, 0, 128, 0, 180, 0, 0, 0, 0, 0] },
    // Barreira 2 (FF 02)
    { t: 'cmd', b: [0xFF, 0x02] }
  ];
}

console.log('Starter items length:', createStage44StarterItems().length);
console.log('Serialized bytes length:', serialize(createStage44StarterItems()).length);

