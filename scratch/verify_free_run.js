const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

// Check that 0xE55A8 to 0xE7E00 is indeed all 0x00 or 0xFF
let allEmpty = true;
for (let i = 0xE55A8; i < 0xE7E00; i++) {
  if (rom[i] !== 0x00 && rom[i] !== 0xFF) {
    allEmpty = false;
    console.log(`Non-empty byte at 0x${i.toString(16)}: 0x${rom[i].toString(16)}`);
    break;
  }
}
console.log('Is 0xE55A8..0xE7E00 free space?', allEmpty);

