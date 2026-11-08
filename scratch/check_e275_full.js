const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0xE275;
console.log('Hex of CMD 44 (C0:E275):');
console.log(rom.slice(start + h, start + h + 45).toString('hex').match(/../g).join(' '));

