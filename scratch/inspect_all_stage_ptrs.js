const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;
const base = 0x34000 + h;

for (let s = 1; s <= 12; s++) {
  const off = base + 3 + (s - 1) * 16;
  const p0 = rom[off] | (rom[off+1]<<8) | (rom[off+2]<<16);
  const p1 = rom[off+3] | (rom[off+4]<<8) | (rom[off+5]<<16);
  const p2 = rom[off+6] | (rom[off+7]<<8) | (rom[off+8]<<16);
  const p3 = rom[off+9] | (rom[off+10]<<8) | (rom[off+11]<<16);
  const p4 = rom[off+12] | (rom[off+13]<<8) | (rom[off+14]<<16);

  // Check what p0 points to (first 8 bytes)
  const p0Off = (p0 & 0xFFFF) + 0x30000 + h;
  const p0Head = rom.slice(p0Off, p0Off + 8).toString('hex').match(/../g).join(' ');

  // Check what p2 points to
  const p2Off = (p2 & 0xFFFF) + 0x30000 + h;
  const p2Head = rom.slice(p2Off, p2Off + 8).toString('hex').match(/../g).join(' ');

  // Check what p3 points to
  const p3Off = (p3 & 0xFFFF) + 0x30000 + h;
  const p3Head = rom.slice(p3Off, p3Off + 8).toString('hex').match(/../g).join(' ');

  console.log(`Stage ${s}:`);
  console.log(`  p0=${p0.toString(16)}: ${p0Head}`);
  console.log(`  p1=${p1.toString(16)}`);
  console.log(`  p2=${p2.toString(16)}: ${p2Head}`);
  console.log(`  p3=${p3.toString(16)}: ${p3Head}`);
}

