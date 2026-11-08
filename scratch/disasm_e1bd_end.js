const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0xE1BD + 60;
console.log('Hex of CMD 43 end:');
console.log(rom.slice(start + h, start + h + 50).toString('hex').match(/../g).join(' '));

