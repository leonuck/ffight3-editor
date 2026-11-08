const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

// Search for references to C0:0D35 (metaBase) in ROM
for (let i = 0; i < 0x20000; i++) {
  if (rom[i+h] === 0x35 && rom[i+1+h] === 0x0D) {
    console.log(`Found C0:0D35 at SNES C0:${i.toString(16).toUpperCase()}`);
  }
}

