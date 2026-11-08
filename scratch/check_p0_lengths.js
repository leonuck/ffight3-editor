const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Check length of pointer 0 blocks
const c34000 = 0x034000 + h;
const p0List = [];
for (let stage = 1; stage <= 43; stage++) {
  const x = (stage - 1) * 16 + 3;
  const p0 = rom[c34000 + x] | (rom[c34000 + x + 1] << 8) | (rom[c34000 + x + 2] << 16);
  p0List.push({ stage, p0 });
}

for (let i = 0; i < p0List.length - 1; i++) {
  const len = p0List[i+1].p0 - p0List[i].p0;
  console.log(`Stage ${p0List[i].stage}: P0 = 0x${p0List[i].p0.toString(16).toUpperCase()}, len = ${len} bytes`);
}

