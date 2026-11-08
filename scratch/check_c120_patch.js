const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Examine C0:0115 to C0:0135
const c120 = 0x000120 + h;
console.log('Bytes at C0:011E - C0:0130:');
for (let i = -2; i < 16; i++) {
  console.log(`C0:${(0x0120 + i).toString(16).toUpperCase()}: ${hex(rom[c120 + i])}`);
}

