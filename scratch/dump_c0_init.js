const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Simple 65816 disassembler or byte viewer
// Let's inspect C0:0430 - C0:0640
const start = 0x000430;
const end = 0x000650;
console.log('ROM dump C0:0430 - C0:0650:');
for (let i = start; i < end; i += 16) {
  let s = hex(0xC00000 + i, 6) + ': ';
  for (let j = 0; j < 16 && i+j < end; j++) {
    s += hex(rom[i+j+h]) + ' ';
  }
  console.log(s);
}

