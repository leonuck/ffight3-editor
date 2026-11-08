const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function findWord(w, name) {
  const b0 = w & 0xFF;
  const b1 = (w >> 8) & 0xFF;
  console.log(`Searching for ${name} (${b0.toString(16).padStart(2,'0')} ${b1.toString(16).padStart(2,'0')})...`);
  for (let i = 0; i < 0x80000; i++) { // search banks C0-C7
    if (rom[i + h] === b0 && rom[i + 1 + h] === b1) {
      const snes = 0xC00000 + i;
      console.log(`  Found at file 0x${i.toString(16)} (SNES ${snes.toString(16).toUpperCase()}): ${rom.slice(i+h-2, i+h+6).toString('hex').match(/../g).join(' ')}`);
    }
  }
}

findWord(0x0408, '$0408');
findWord(0x0DB0, '$0DB0');

