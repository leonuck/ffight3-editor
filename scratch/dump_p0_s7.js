const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Dump Pointer 0 for Stage 7 (C3:4593)
const off7 = 0x034593 + h;
console.log('Stage 7 Pointer 0 block at C3:4593:');
for (let i = 0; i < 80; i += 16) {
  let s = hex(0xC34593 + i, 6) + ': ';
  for (let j = 0; j < 16; j++) {
    s += hex(rom[off7 + i + j]) + ' ';
  }
  console.log(s);
}

