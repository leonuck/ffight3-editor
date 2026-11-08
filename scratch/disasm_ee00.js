const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0xEDF0;
console.log('Hex at C0:EDF0:');
console.log(rom.slice(start + h, start + h + 80).toString('hex').match(/../g).join(' '));

