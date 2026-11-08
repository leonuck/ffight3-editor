const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=6) { return n.toString(16).padStart(w, '0').toUpperCase(); }

let a = 0x34000;
const stages = [];
while (a < 0x342B3) {
  const ptrs = [];
  while (rom[a+h+2] >= 0xC0 && rom[a+h+2] < 0xF0) {
    const v = rom[a+h] | (rom[a+h+1]<<8) | (rom[a+h+2]<<16);
    ptrs.push(hex(v));
    a += 3;
  }
  if (!ptrs.length || rom[a+h] !== 0) break;
  a++; // skip terminator 00
  stages.push(ptrs);
}

console.log(`Found ${stages.length} stages in table at 0x34000:`);
stages.forEach((st, i) => {
  console.log(`Stage ${i+1}: ptrs = [${st.join(', ')}]`);
});

