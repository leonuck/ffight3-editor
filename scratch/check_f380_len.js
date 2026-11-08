const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

let end = 0x00F380;
while (rom[end + h] === 0xEA || rom[end + h] === 0x00) {
  end++;
}
console.log(`Free space from 0x00F380 to 0x${end.toString(16).toUpperCase()}: ${end - 0x00F380} bytes!`);

