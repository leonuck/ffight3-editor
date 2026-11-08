const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Let's inspect EC:006C (the table indexed by $1F00)
// In EC:006C, we saw:
// [00, 0C, 02, 06, 09, 09, 06, 04, 06, 09, 15, 18, 1B, 1E, 21, 00, 24...]
// What is table at EC:006C?
const ecStart = 0x2C0000 + h;
console.log('EC:006C entries:');
for (let i = 0; i < 48; i++) {
  console.log(`Bank 0x${hex(i)}: entry = 0x${hex(rom[ecStart + 0x6C + i])}`);
}

