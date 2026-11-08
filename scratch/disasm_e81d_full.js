const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const start = 0xE81D + h;
const slice = rom.slice(start, start + 160);

// Simple 65816 disassembler snippet
let i = 0;
while (i < slice.length) {
  const b = slice[i];
  console.log(`+0x${i.toString(16).padStart(2,'0')}: ${slice.slice(i, i+4).toString('hex').match(/../g).join(' ')}`);
  i += 4;
}

