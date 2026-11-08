const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0x0C70;
console.log('Hex from C0:0C70 to C0:0CD0:');
console.log(rom.slice(start + h, start + h + 90).toString('hex').match(/../g).join(' '));

