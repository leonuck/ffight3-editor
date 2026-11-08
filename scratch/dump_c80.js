const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

function dump(offset, len) {
  const fileOff = offset + header;
  return Array.from(rom.slice(fileOff, fileOff + len)).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

console.log('0x0C80 to 0x0D35:', dump(0x0C80, 0x0D35 - 0x0C80));

