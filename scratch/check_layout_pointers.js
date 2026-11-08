const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

// Let's inspect bytes 1, 2, 3, 6, 7 of the 12-byte table at 0x0D35
// In dump_metadata_all.js we saw:
// Stage 01: 06 06 2a 02 2b ff 2b 02 00 30 32 0d
// Stage 07: 12 0e 05 08 ff ff 06 08 00 30 38 0d
// Look at Byte 6 & 7: 06 08 for Stage 7!
// Look at Byte 2 & 3: 05 08 for Stage 7!
// Could 0x0806 or 0x0805 be a pointer or index into a layout table?
// Let's search where these indices lead!
console.log('Searching references to byte 6/7 or layout loading...');

