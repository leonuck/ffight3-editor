const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

for (let i = 0; i < rom.length - 2; i++) {
  // STA $0406 (8D 06 04) or STZ $0406 (9C 06 04)
  if ((rom[i] === 0x8D || rom[i] === 0x9C) && rom[i+1] === 0x06 && rom[i+2] === 0x04) {
    console.log(`Write to $0406 at file 0x${i.toString(16)} (C0:${(i & 0xFFFF).toString(16)}): ${rom[i].toString(16)} 06 04`);
  }
}

