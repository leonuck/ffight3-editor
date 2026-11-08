const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;
const base = 0x34000 + h;

for (const s of [1, 2, 3, 4, 7]) {
  const off = base + 3 + (s - 1) * 16;
  const p2 = rom[off+6] | (rom[off+7]<<8) | (rom[off+8]<<16);
  const p2Off = (p2 & 0xFFFF) + 0x30000 + h;
  console.log(`\n=== Stage ${s} Pointer 2 at SNES ${p2.toString(16).toUpperCase()} (File 0x${(p2Off-h).toString(16)}) ===`);
  console.log(rom.slice(p2Off, p2Off + 48).toString('hex').match(/../g).join(' '));
}

