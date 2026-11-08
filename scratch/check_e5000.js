const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

console.log('Hex at file 0x0E5000:');
console.log(rom.slice(0x0E5000 + h, 0x0E5000 + h + 32).toString('hex').match(/../g).join(' '));

