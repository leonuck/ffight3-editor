const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0xE0FA + 70;
console.log('Hex around C0:E0FA end:');
console.log(rom.slice(start + h, start + h + 30).toString('hex').match(/../g).join(' '));

