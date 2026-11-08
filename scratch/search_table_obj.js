const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

// Search for references to C3:A314 (Pointer 2 of Stage 7)
const ptrBytes = [0x14, 0xA3, 0xC3];
for (let i = 0; i < rom.length - 3; i++) {
  if (rom[i] === ptrBytes[0] && rom[i+1] === ptrBytes[1] && rom[i+2] === ptrBytes[2]) {
    console.log(`Found C3:A314 at offset 0x${(i-h).toString(16)}`);
  }
}

