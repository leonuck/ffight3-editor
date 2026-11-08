const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Search for calls to C0:EE00 - C0:EE90
for (let i = 0; i < 0x20000; i++) {
  // JSR or JSL
  if ((rom[i+h] === 0x20 || rom[i+h] === 0x22) && rom[i+2+h] === 0xEE) {
    const snes = (0xC00000 + i).toString(16).toUpperCase();
    console.log(`${rom[i+h] === 0x20 ? 'JSR' : 'JSL'} C0:EE${hex(rom[i+1+h])} at SNES ${snes}`);
  }
}

