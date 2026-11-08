const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

// Search references to 0x12.. or the dispatcher
for (let i = 0; i < 0x8000; i++) {
  // Look for JSL to 12xx
  if (rom[i] === 0x22 && rom[i+2] === 0x12 && rom[i+3] === 0xC0) {
    console.log(`Found JSL $C012${rom[i+1].toString(16)} at C0:${i.toString(16)}`);
  }
}

