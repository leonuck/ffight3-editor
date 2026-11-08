const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const fileOff = 0xE248 + h;
console.log('Hex from C0:E248:');
console.log(rom.slice(fileOff, fileOff + 80).toString('hex').match(/../g).join(' '));

