const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

let count = 0;
for (let i = 0x20000; i < 0x50000; i++) {
  if (rom[i+h] === 0x16 && rom[i+1+h] === 0x01 && rom[i+2+h] === 0x16 && rom[i+3+h] === 0x01) {
    console.log(`Found sequence [16 01 16 01] at file 0x${i.toString(16)} (SNES C${(i>>16).toString(16)}:${(i&0xFFFF).toString(16)})`);
    count++;
  }
}
console.log(`Total occurrences: ${count}`);

