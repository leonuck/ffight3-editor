const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

for (let i = header; i < header + 0x20000; i++) {
  // Check for 35 0D or 34 0D (little-endian for $0D35 or $0D34)
  if ((rom[i] === 0x35 && rom[i+1] === 0x0D) || (rom[i] === 0x34 && rom[i+1] === 0x0D)) {
    console.log(`Found reference at file 0x${(i-header).toString(16)} (C0:${((i-header)&0xFFFF).toString(16)}): ${rom[i-1].toString(16)} ${rom[i].toString(16)} ${rom[i+1].toString(16)}`);
  }
}

