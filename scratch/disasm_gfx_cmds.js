const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function printHex(addr, len) {
  const fileOff = (addr & 0xFFFF) + h;
  const slice = rom.slice(fileOff, fileOff + len);
  console.log(`Hex at C0:${addr.toString(16)}: ${slice.toString('hex').match(/../g).join(' ')}`);
}

console.log('Disassembling GFX loader commands:');
printHex(0xE157, 26); // CMD 'B'
printHex(0xE171, 26); // CMD 'W'
printHex(0xE188, 26); // CMD 'L'
printHex(0xE1A9, 26); // CMD 'R'
printHex(0xE1BD, 26); // CMD 'C'

