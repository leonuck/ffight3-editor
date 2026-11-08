const fs = require('fs');
const buf = fs.readFileSync('scratch/bar_tilemap_correct.bin');
const bg2 = buf.slice(0x2000, 0x3000);

console.log('BG2 (32 lines x 32 words, 2 bytes per word):');
for (let y = 0; y < 28; y++) {
  const lineWords = [];
  for (let x = 0; x < 32; x++) {
    const idx = (y * 32 + x) * 2;
    const w = bg2[idx] | (bg2[idx+1] << 8);
    lineWords.push(w === 0 ? '....' : w.toString(16).padStart(4, '0'));
  }
  console.log(`Y${y.toString().padStart(2,'0')}: ${lineWords.join(' ')}`);
}

