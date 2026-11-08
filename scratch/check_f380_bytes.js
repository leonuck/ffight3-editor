const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

console.log('Bytes at C0:F380 (offset 0x00F380):');
let s = '';
for (let i = 0; i < 64; i++) {
  s += hex(rom[0x00F380 + h + i]) + ' ';
}
console.log(s);

