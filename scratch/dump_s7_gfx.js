const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

const s7Gfx = 0x0353FE + h;
console.log('Stage 7 GFX loader script at C3:53FE:');
let s = '';
for (let i = 0; i < 64; i++) {
  const b = rom[s7Gfx + i];
  s += hex(b) + ' ';
  if (b === 0x45) { // 'E'
    console.log(`Found 'E' (0x45) at byte offset ${i}!`);
    break;
  }
}
console.log(s);

