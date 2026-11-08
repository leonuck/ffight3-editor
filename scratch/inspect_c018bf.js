const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

// Check C0:18BF to C0:1900
for (let i = 0x18BF; i < 0x1910; i++) {
  console.log('C0:' + i.toString(16) + ': ' + rom[i].toString(16).padStart(2, '0'));
}

