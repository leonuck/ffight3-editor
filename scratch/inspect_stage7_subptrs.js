const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function dumpSub(snesAddr, len = 32) {
  const fileOff = (snesAddr & 0xFFFF) + 0x30000 + h;
  console.log(`Sub-pointer SNES ${snesAddr.toString(16).toUpperCase()} (0x${(fileOff-h).toString(16)}):`);
  console.log(rom.slice(fileOff, fileOff + len).toString('hex').match(/../g).join(' '));
}

dumpSub(0xC3A320, 20);
dumpSub(0xC3A32A, 20);
dumpSub(0xC3A334, 40);
dumpSub(0xC3A37E, 40);

