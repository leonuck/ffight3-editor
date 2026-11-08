const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

function dump(addr, len) {
  const off = addr - 0xC00000 + h;
  console.log(`\nDump SNES ${addr.toString(16).toUpperCase()}:`);
  for (let i = 0; i < len; i += 16) {
    let s = hex(addr + i, 6) + ': ';
    for (let j = 0; j < 16 && i+j < len; j++) {
      s += hex(rom[off + i + j]) + ' ';
    }
    console.log(s);
  }
}

dump(0xC0277E, 48);
dump(0xC02818, 48);
dump(0xC0287F, 48);

