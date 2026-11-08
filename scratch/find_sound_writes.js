const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const counts = {};
for (let i = 0; i < 0x80000; i++) {
  if (rom[i+h] === 0x8D && rom[i+2+h] === 0x1F) {
    const addr = rom[i+1+h].toString(16).padStart(2, '0').toUpperCase();
    const snes = (0xC00000 + i).toString(16).toUpperCase();
    if (!counts[addr]) counts[addr] = [];
    counts[addr].push(snes);
  }
}
for (const [addr, list] of Object.entries(counts)) {
  console.log(`STA $1F${addr} (${list.length} occurrences): ${list.slice(0, 5).join(', ')}`);
}

