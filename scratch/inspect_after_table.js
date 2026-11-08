const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

for (let i = 0x342B0; i < 0x34355; i++) {
  console.log('0x' + i.toString(16) + ' (C3:' + (i & 0xFFFF).toString(16) + '): ' + rom[i].toString(16).padStart(2, '0'));
}

