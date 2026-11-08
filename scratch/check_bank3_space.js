const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

// Bank C3 is 0x30000..0x3FFFF
const bank3 = rom.slice(0x30000 + h, 0x40000 + h);
let zeroRun = 0, maxRun = 0, maxRunAt = 0;
for (let i = 0; i < bank3.length; i++) {
  if (bank3[i] === 0) {
    zeroRun++;
    if (zeroRun > maxRun) {
      maxRun = zeroRun;
      maxRunAt = i - zeroRun + 1;
    }
  } else {
    zeroRun = 0;
  }
}
console.log(`Max zero run in Bank C3: ${maxRun} bytes at offset 0x${(0x30000 + maxRunAt).toString(16)} (SNES C3:${maxRunAt.toString(16).toUpperCase()})`);

// Check table 0x342B3 end
console.log('Bytes after Stage 44 entry (0x342B3 + 16 = 0x342C3):');
console.log(rom.slice(0x342C3 + h, 0x342C3 + h + 32).toString('hex').match(/../g).join(' '));

