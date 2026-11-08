const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

for (let i = 0x0AD0; i < 0x0B20; i++) {
  console.log('C0:' + i.toString(16) + ': ' + rom[i].toString(16).padStart(2, '0'));
}

