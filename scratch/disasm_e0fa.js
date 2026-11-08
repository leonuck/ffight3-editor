const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const fileOff = 0xE0FA + h;
console.log('Hex at C0:E0FA:');
console.log(rom.slice(fileOff, fileOff + 60).toString('hex').match(/../g).join(' '));

