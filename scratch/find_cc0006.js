const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

for (let i = 0; i < 0x20000; i++) {
  if (rom[i+h] === 0x22 && rom[i+1+h] === 0x06 && rom[i+2+h] === 0x00 && rom[i+3+h] === 0xCC) {
    console.log(`JSL $CC0006 at SNES C0:${i.toString(16).toUpperCase()}`);
  }
}

