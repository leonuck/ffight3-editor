const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

function dump(fileOff, len) {
  return Array.from(rom.slice(fileOff + header, fileOff + header + len)).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

// Let's dump 0x0C88 to 0x0D35 with simple disassembly
const code = rom.slice(0x0C88 + header, 0x0D35 + header);
console.log('Bytes from 0x0C88 to 0x0D35 (' + code.length + ' bytes):');
console.log(Array.from(code).map(b => b.toString(16).padStart(2, '0')).join(' '));

