const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0x353FE;
console.log('Original Stage 7 GFX loader script at C3:53FE:');
console.log(rom.slice(start + h, start + h + 60).toString('hex').match(/../g).join(' '));

