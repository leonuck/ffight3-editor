const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;
const metaBase = 0x0D35 + h;

for (let s = 1; s <= 10; s++) {
  const off = metaBase + (s - 1) * 12;
  const bytes = rom.slice(off, off + 12);
  console.log(`Stage ${s.toString().padStart(2, '0')}: ${bytes.toString('hex').match(/../g).join(' ')}`);
}

