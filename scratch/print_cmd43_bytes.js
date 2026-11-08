const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0x353FE + h;
// Offset of 43 is at start + 42
const slice = rom.slice(start + 42, start + 56);
for (let i = 0; i < slice.length; i++) {
  console.log(`+${i}: 0x${slice[i].toString(16).padStart(2, '0')} (${String.fromCharCode(slice[i])})`);
}

