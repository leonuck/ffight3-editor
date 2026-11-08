const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;
const start = 0xE81D + h;
const slice = rom.slice(start, start + 70);

// Let's print each byte with offset
for(let i=0; i<slice.length; i++) {
  console.log(`+0x${i.toString(16).padStart(2,'0')}: 0x${slice[i].toString(16).padStart(2,'0')}`);
}

