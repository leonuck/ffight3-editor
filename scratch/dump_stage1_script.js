const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const TABLE=0x34000;
let a = TABLE;
const rows = [];
for (;;) {
  const ptrs = [];
  while (rom[a+2] >= 0xC0 && rom[a+2] < 0xF0) {
    ptrs.push(rom[a] | (rom[a+1] << 8) | (rom[a+2] << 16));
    a += 3;
  }
  if (!ptrs.length || rom[a] !== 0) break;
  a++;
  rows.push(ptrs);
}

console.log('Stage 1 pointers:', rows[0].map(x => '0x' + x.toString(16)));
const p = rows[0][rows[0].length - 1];
const start = p - 0xC00000;
console.log('Stage 1 script starts at:', '0x' + start.toString(16));

let pos = start;
while (pos < start + 500) {
  if (rom[pos] === 0xFF) {
    const b1 = rom[pos+1];
    const len = (b1 === 0xFE || b1 === 0xFC) ? 7 : (b1 === 0xFD ? 3 : 2);
    const bytes = Array.from(rom.slice(pos, pos + len)).map(x => x.toString(16).padStart(2, '0')).join(' ');
    console.log(`Cmd at 0x${pos.toString(16)}: ${bytes}`);
    pos += len;
    if (b1 === 0xFF) break;
  } else {
    pos += 17;
  }
}

