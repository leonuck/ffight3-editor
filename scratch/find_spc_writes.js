const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

for (let i = 0; i < 0x20000; i++) {
  if (rom[i+h] === 0x8D && rom[i+1+h] === 0x40 && rom[i+2+h] === 0x21) {
    console.log(`STA $2140 at SNES C0:${i.toString(16).toUpperCase()}`);
  }
  if (rom[i+h] === 0x8D && rom[i+1+h] === 0x41 && rom[i+2+h] === 0x21) {
    console.log(`STA $2141 at SNES C0:${i.toString(16).toUpperCase()}`);
  }
}

