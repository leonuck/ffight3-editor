const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

// Let's check which stages belong to which rounds and what BGM each has:
const c34000 = 0x034000 + h;
const stageBgms = [];
for (let stage = 1; stage <= 43; stage++) {
  const x = (stage - 1) * 16 + 3;
  const p0 = rom[c34000 + x] | (rom[c34000 + x + 1] << 8) | (rom[c34000 + x + 2] << 16);
  const p0File = (p0 - 0xC00000) + h;
  const bgm = rom[p0File];
  stageBgms.push({ stage, bgm });
}

console.log('Stage BGMs:');
stageBgms.forEach(s => {
  console.log(`Stage ${s.stage.toString().padStart(2, '0')}: BGM 0x${s.bgm.toString(16).padStart(2, '0')}`);
});

