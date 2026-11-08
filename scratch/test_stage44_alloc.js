const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const TABLE = 0x34000;
// Stage 7 (Bar Creep Eats) has 5 pointers
// Let's inspect Stage 7 entry in table:
let a = TABLE;
const rows = [];
while (a < TABLE + 0x300) {
  const startAt = a;
  const ptrs = [];
  while (rom[a+2] >= 0xC0 && rom[a+2] < 0xF0) {
    ptrs.push(rom[a] | (rom[a+1] << 8) | (rom[a+2] << 16));
    a += 3;
  }
  if (!ptrs.length) break;
  rows.push({ id: rows.length + 1, at: startAt, ptrs });
  if (rom[a] === 0) a++;
}

console.log('Stage 7 entry:');
console.log('Location in ROM: 0x' + rows[6].at.toString(16));
console.log('Pointers:', rows[6].ptrs.map(p => '0x' + p.toString(16)));

// Look at table end
console.log('End of stage 43: 0x' + a.toString(16));
console.log('Free bytes after table:');
const freeAfter = [];
for (let i = a; i < a + 32; i++) {
  freeAfter.push(rom[i].toString(16).padStart(2, '0'));
}
console.log(freeAfter.join(' '));

