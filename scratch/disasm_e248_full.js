const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0xE248;
console.log('Disassembly of C0:E248 (CMD 4D / Decompress):');
console.log(rom.slice(start + h, start + h + 50).toString('hex').match(/../g).join(' '));

