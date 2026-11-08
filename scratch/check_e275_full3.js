const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0xE275 + 50;
console.log('Hex of CMD 44 continuation 3:');
console.log(rom.slice(start + h, start + h + 25).toString('hex').match(/../g).join(' '));

