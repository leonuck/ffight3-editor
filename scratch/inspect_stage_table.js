const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const TABLE = 0x34000;
let a = TABLE;
const rows = [];
while (a < TABLE + 0x300) {
  const ptrs = [];
  while (rom[a+2] >= 0xC0 && rom[a+2] < 0xF0) {
    ptrs.push(rom[a] | (rom[a+1] << 8) | (rom[a+2] << 16));
    a += 3;
  }
  if (!ptrs.length) {
    console.log(`Table end at 0x${a.toString(16)} (byte = 0x${rom[a].toString(16)})`);
    break;
  }
  rows.push(ptrs);
  if (rom[a] === 0) a++; // separator byte
}

console.log(`Found ${rows.length} stage rows in table`);
rows.forEach((r, i) => {
  console.log(`Stage ${i+1} (${r.length} ptrs): ` + r.map(p => '0x' + p.toString(16)).join(', '));
});

