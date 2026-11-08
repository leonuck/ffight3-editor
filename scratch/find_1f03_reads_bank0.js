const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

for (let i = 0; i < 0x8000; i++) {
  // LDA $1F03 (AD 03 1F) or LDX $1F03 (AE 03 1F) or LDY $1F03 (AC 03 1F)
  if ((rom[i] === 0xAD || rom[i] === 0xAE || rom[i] === 0xAC) && rom[i+1] === 0x03 && rom[i+2] === 0x1F) {
    console.log(`Read $1F03 at C0:${i.toString(16)}: ${rom[i].toString(16)} 03 1F`);
  }
}

