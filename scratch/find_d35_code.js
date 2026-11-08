const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

for (let i = 0; i < 0x8000; i++) {
  // Check BF 35 0D C0
  if (rom[i+h] === 0xBF && rom[i+1+h] === 0x35 && rom[i+2+h] === 0x0D && rom[i+3+h] === 0xC0) {
    console.log(`LDA $C00D35, X at SNES C0:${i.toString(16).toUpperCase()}`);
  }
  // Check BD 35 0D
  if (rom[i+h] === 0xBD && rom[i+1+h] === 0x35 && rom[i+2+h] === 0x0D) {
    console.log(`LDA $0D35, X at SNES C0:${i.toString(16).toUpperCase()}`);
  }
}

