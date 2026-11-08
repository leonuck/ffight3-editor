const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

for (let i = 0; i < rom.length - 2; i++) {
  if (rom[i] === 0xFF && rom[i+1] === 0x11) {
    console.log(`Pointer $11FF found at 0x${i.toString(16)} (C0:${(i & 0xFFFF).toString(16)})`);
  }
}

