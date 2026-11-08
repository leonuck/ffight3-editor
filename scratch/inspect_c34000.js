const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Let's dump C3:4000 for Stage 1 to 5
const c34000 = 0x034000 + h;
for (let stage = 1; stage <= 8; stage++) {
  const off = c34000 + (stage - 1) * 16;
  let s = `Stage ${stage} (C3:${(0x4000 + (stage-1)*16).toString(16).toUpperCase()}): `;
  for (let j = 0; j < 16; j++) {
    s += hex(rom[off + j]) + ' ';
  }
  console.log(s);
}

console.log('\nAnd what is at Stage 44 (offset 0x34000 + 43*16 = 0x342B0)?');
const off44 = c34000 + 43 * 16;
let s44 = `Stage 44 (C3:${(0x4000 + 43*16).toString(16).toUpperCase()}): `;
for (let j = 0; j < 16; j++) {
  s44 += hex(rom[off44 + j]) + ' ';
}
console.log(s44);
