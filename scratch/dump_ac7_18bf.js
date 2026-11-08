const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

console.log('--- C0:0AC0 - C0:0AE0 ---');
for (let i = 0x0AC0; i < 0x0AE0; i++) {
  console.log('C0:' + i.toString(16) + ': ' + rom[i].toString(16).padStart(2, '0'));
}

console.log('--- C0:18B8 - C0:18D8 ---');
for (let i = 0x18B8; i < 0x18D8; i++) {
  console.log('C0:' + i.toString(16) + ': ' + rom[i].toString(16).padStart(2, '0'));
}

