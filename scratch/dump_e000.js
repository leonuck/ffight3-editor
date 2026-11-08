const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

function dump(offset, len) {
  const fileOff = offset + header;
  return Array.from(rom.slice(fileOff, fileOff + len)).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

console.log('0x00E000 to 0x00E070:');
console.log(dump(0x00E000, 112));

