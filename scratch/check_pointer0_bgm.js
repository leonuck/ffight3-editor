const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Check pointer 0 for all stages
const c34000 = 0x034000 + h;
for (let stage = 1; stage <= 43; stage++) {
  const x = (stage - 1) * 16 + 3;
  const p0 = rom[c34000 + x] | (rom[c34000 + x + 1] << 8) | (rom[c34000 + x + 2] << 16);
  const p0File = (p0 - 0xC00000) + h;
  const bgmByte = rom[p0File];
  console.log(`Stage ${stage.toString().padStart(2, ' ')}: Pointer 0 = C${(p0>>16).toString(16).toUpperCase()}:${(p0&0xFFFF).toString(16).toUpperCase()} -> Byte 0 (BGM) = 0x${hex(bgmByte)} (${bgmByte})`);
}

