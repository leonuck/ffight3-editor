const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function printHex(addr, len) {
  const fileOff = (addr & 0xFFFF) + h;
  const slice = rom.slice(fileOff, fileOff + len);
  console.log(`Hex at C0:${addr.toString(16)}: ${slice.toString('hex').match(/../g).join(' ')}`);
}

printHex(0x11B5, 30);
printHex(0x1665, 30);
printHex(0xAC25, 30);

