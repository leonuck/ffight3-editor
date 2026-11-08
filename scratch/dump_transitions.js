const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

function dump(offset, len) {
  const fileOff = offset + header;
  return Array.from(rom.slice(fileOff, fileOff + len)).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

console.log('Around 0x11fa:', dump(0x11e0, 40));
console.log('Around 0x130b:', dump(0x12f0, 40));
console.log('Around 0x29bd:', dump(0x29a0, 40));
console.log('Around 0x2b4d:', dump(0x2b30, 40));

