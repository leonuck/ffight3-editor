const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

// Let's dump all bytes of C3:A314 up to C3:A3C8 (where Stage 8 starts)
const p2Start = 0x3A314 + h;
const p2End = 0x3A3C8 + h;
console.log(`C3:A314 to C3:A3C8 length: ${p2End - p2Start} bytes`);
console.log(rom.slice(p2Start, p2End).toString('hex').match(/../g).join(' '));

