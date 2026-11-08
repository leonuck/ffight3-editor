const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

console.log('Calls to C0:E09C (22 9C E0 C0) in Bank C0:');
for (let i = 0; i < 0x80000; i++) {
  if (rom[i+h] === 0x22 && rom[i+1+h] === 0x9C && rom[i+2+h] === 0xE0 && rom[i+3+h] === 0xC0) {
    console.log(`JSL C0:E09C at SNES ${(0xC00000 + i).toString(16).toUpperCase()}`);
    // Show previous 5 bytes
    const prev = [];
    for (let k = 5; k > 0; k--) prev.push(hex(rom[i-k+h]));
    console.log(`  Prev 5 bytes: ${prev.join(' ')}`);
  }
}

