const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

// Search for sequence of BGM IDs
// Let's search where STA $2140 / $2141 is called during stage transition
// Remember earlier:
// STA $2141 at C0:28C5, C0:2916, C0:29DD, C0:29FD, C0:EE03...
console.log('Hex at C0:28B0 (sound call):');
console.log(rom.slice(0x28B0 + h, 0x28B0 + h + 60).toString('hex').match(/../g).join(' '));

console.log('Hex at C0:2900 (sound call):');
console.log(rom.slice(0x2900 + h, 0x2900 + h + 60).toString('hex').match(/../g).join(' '));

