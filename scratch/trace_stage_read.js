const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Search for LDA $1F03 (AD 03 1F) or LDX $1F03 (AE 03 1F) or LDY $1F03 (AC 03 1F)
console.log('Searching for reads of $1F03 in Bank C0:');
for (let i = 0; i < 0x20000; i++) {
  const b = rom[i+h];
  if (rom[i+1+h] === 0x03 && rom[i+2+h] === 0x1F) {
    if (b === 0xAD || b === 0xAE || b === 0xAC) {
      const op = b === 0xAD ? 'LDA' : (b === 0xAE ? 'LDX' : 'LDY');
      const snes = (0xC00000 + i).toString(16).toUpperCase();
      console.log(`${op} $1F03 at SNES ${snes}`);
    }
  }
}

