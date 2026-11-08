const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

for (let i = 0x11EE; i < 0x1240; i++) {
  if (rom[i] === 0xAD && rom[i+1] === 0x03 && rom[i+2] === 0x1F) {
    console.log(`LDA $1F03 at C0:${i.toString(16)}`);
  }
}
// Also search in C0:1687 to C0:1750
for (let i = 0x1687; i < 0x1750; i++) {
  if (rom[i] === 0xAD && rom[i+1] === 0x03 && rom[i+2] === 0x1F) {
    console.log(`LDA $1F03 at C0:${i.toString(16)}`);
  }
}

