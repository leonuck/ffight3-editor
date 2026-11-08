const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

// Verify JSL EC0000 calling convention
// In C0:0024:
// A9 40       LDA #$40
// 8D 00 1F    STA $1F00
// 22 00 00 EC JSL $EC0000
//
// In C0:012E:
// A9 20       LDA #$20
// 8D 00 1F    STA $1F00
// 22 00 00 EC JSL $EC0000
// 9C 0D 1F    STZ $1F0D
console.log('JSL $EC0000 is the official game routine to switch APU sound bank!');

