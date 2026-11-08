const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;
const base = 0x0D35 + header;

console.log('12-byte Stage Metadata Table (C0:0D35):');
for (let i = 0; i < 43; i++) {
  const off = base + i * 12;
  const bytes = Array.from(rom.slice(off, off + 12)).map(b => b.toString(16).padStart(2, '0')).join(' ');
  const num = (i + 1).toString().padStart(2, '0');
  console.log(`Stage ${num}: ${bytes}`);
}
