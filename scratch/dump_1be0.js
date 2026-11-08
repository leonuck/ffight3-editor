const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

console.log('ROM dump C0:1BE0 - C0:1C40:');
for (let i = 0x001BE0; i < 0x001C40; i += 16) {
  let s = hex(0xC00000 + i, 6) + ': ';
  for (let j = 0; j < 16 && i+j < 0x001C40; j++) {
    s += hex(rom[i+j+h]) + ' ';
  }
  console.log(s);
}

