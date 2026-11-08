const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

const ecStart = 0x2C0000 + h;
console.log('ROM dump EC:0240 - EC:02A0:');
for (let i = 0x240; i < 0x2A0; i += 16) {
  let s = hex(0xEC0000 + i, 6) + ': ';
  for (let j = 0; j < 16; j++) {
    s += hex(rom[ecStart + i + j]) + ' ';
  }
  console.log(s);
}

