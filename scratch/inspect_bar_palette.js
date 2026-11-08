const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const palOff = 0x36482 + h;
console.log('Palette at C3:6482 (32 bytes = 16 SNES BGR555 colors):');
const pal = rom.slice(palOff, palOff + 32);
for (let i = 0; i < 32; i += 2) {
  const c = pal[i] | (pal[i+1] << 8);
  const r = (c & 0x1F);
  const g = ((c >> 5) & 0x1F);
  const b = ((c >> 10) & 0x1F);
  console.log(`Color ${i/2}: 0x${c.toString(16).padStart(4,'0')} -> R:${r} G:${g} B:${b}`);
}

