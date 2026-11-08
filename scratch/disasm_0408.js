const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function printCode(addr, len) {
  const fileOff = (addr & 0xFFFF) + h;
  const slice = rom.slice(fileOff, fileOff + len);
  console.log(`Hex at C0:${addr.toString(16)}: ${slice.toString('hex').match(/../g).join(' ')}`);
}

printCode(0x5170, 40);
printCode(0x6020, 40);

