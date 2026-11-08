const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Search for reads from script pointers or where 0x34000 table is read!
// Earlier we saw C3:4000 is table.
// Where is C34000 read in Bank C0?
for (let i = 0; i < 0x20000; i++) {
  if (rom[i+h] === 0x00 && rom[i+1+h] === 0x40 && rom[i+2+h] === 0xC3) {
    console.log(`Ref to C3:4000 at SNES ${(0xC00000+i).toString(16).toUpperCase()}`);
  }
}

