const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

let count = 0;
while (rom[0x342C3 + h + count] === 0 && count < 2000) {
  count++;
}
console.log(`Zeroes starting at 0x342C3: ${count} bytes (up to 0x${(0x342C3 + count).toString(16)})`);

