const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;
const base = 0x34000 + h;

for (let s = 1; s <= 43; s++) {
  const off = base + 3 + (s - 1) * 16;
  const p2 = rom[off+6] | (rom[off+7]<<8) | (rom[off+8]<<16);
  const p2Off = (p2 & 0xFFFF) + 0x30000 + h;
  const head = rom.slice(p2Off, p2Off + 16).toString('hex').match(/../g).join(' ');
  if (head.includes('ff ff 00 00') || head.includes('ff 00') || s === 10 || s === 3 || s === 7 || s === 12) {
    console.log(`Stage ${s} p2 (${p2.toString(16)}): ${head}`);
  }
}

