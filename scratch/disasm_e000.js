const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0xE000;
console.log('Hex at C0:E000:');
console.log(rom.slice(start + h, start + h + 80).toString('hex').match(/../g).join(' '));

