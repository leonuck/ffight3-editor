const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;
console.log('ROM length:', rom.length, 'Header:', h);

const ecOffset = 0x2C0000 + h;
console.log('Bytes at EC:0000 (file offset 0x2C0000):');
console.log(Buffer.from(rom.slice(ecOffset, ecOffset + 48)).toString('hex').match(/../g).join(' '));

