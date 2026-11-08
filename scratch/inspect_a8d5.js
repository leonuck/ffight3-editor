const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const off = 0x3A8D5 + h;
console.log('Hex at C3:A8D5:');
console.log(rom.slice(off, off + 20).toString('hex').match(/../g).join(' '));

