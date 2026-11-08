const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Search for references to C0:01F8 or C0:0200
for (let i = 0; i < 0x20000; i++) {
  if (rom[i+h] === 0xF8 && rom[i+1+h] === 0x01) {
    console.log(`Ref to xx01F8 at SNES ${(0xC00000+i).toString(16).toUpperCase()}`);
  }
  if (rom[i+h] === 0x00 && rom[i+1+h] === 0x02) {
    // maybe 0200
  }
}

