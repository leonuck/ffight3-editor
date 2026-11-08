const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

// Search for references to stage 7 (0x07) in Bank C0
console.log('Searching for writes or compares with 0x07 (Stage 7)...');
for (let i = 0; i < 0x8000; i++) {
  // CMP #$07 (C9 07) or LDA #$07 (A9 07)
  if ((rom[i] === 0xC9 || rom[i] === 0xA9) && rom[i+1] === 0x07) {
    // Check if following instruction writes to $0406 or $1F03
    if (rom[i+2] === 0x8D && (rom[i+3] === 0x06 || rom[i+3] === 0x03)) {
      console.log(`Found A9 07; 8D ${rom[i+3].toString(16)} ${rom[i+4].toString(16)} at C0:${i.toString(16)}`);
    }
  }
}

