const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const base = 0x0D35;
// For stage 43: (43-1) * 12 = 42 * 12 = 504 = 0x1F8
// Base + 0x1F8 = 0x0D35 + 0x1F8 = 0x0F2D!
// For stage 44: (44-1) * 12 = 43 * 12 = 516 = 0x204
// Base + 0x204 = 0x0D35 + 0x204 = 0x0F39!

console.log('Stage 43 (TR) at C0:' + (base + 42 * 12).toString(16));
for (let i = 0; i < 12; i++) {
  console.log('  +' + i + ': 0x' + rom[base + 42 * 12 + i].toString(16).padStart(2, '0'));
}

console.log('Stage 44 slot at C0:' + (base + 43 * 12).toString(16));
for (let i = 0; i < 12; i++) {
  console.log('  +' + i + ': 0x' + rom[base + 43 * 12 + i].toString(16).padStart(2, '0'));
}

// And what about Stage 7 metadata?
console.log('Stage 7 (Bar) at C0:' + (base + 6 * 12).toString(16));
for (let i = 0; i < 12; i++) {
  console.log('  +' + i + ': 0x' + rom[base + 6 * 12 + i].toString(16).padStart(2, '0'));
}

