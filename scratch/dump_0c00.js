const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

function dump(offset, len) {
  const fileOff = offset + header;
  return Array.from(rom.slice(fileOff, fileOff + len)).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

console.log('0x0C00 to 0x0C80:');
console.log(dump(0x0C00, 128));

console.log('\n0x0CBB to 0x0D00:');
console.log(dump(0x0CBB, 69));

