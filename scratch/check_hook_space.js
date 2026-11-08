const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

// Check free space at 0xF060 and 0xF340
console.log('Door hook area 0x00F060: allocated 0xB0 bytes (176 bytes)');
console.log('Exit hook area 0x00F340: allocated 0xB0 bytes (176 bytes)');

