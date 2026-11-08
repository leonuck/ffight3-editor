const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const bytes = rom.slice(0x18DC + h, 0x1920 + h);
console.log('Hex around C0:18DC:');
console.log(bytes.toString('hex').match(/../g).join(' '));

