const fs = require('fs');
const buf = fs.readFileSync('scratch/bar_tilemap_correct.bin');

// In Screen 0 of BG2 (at 0x2000):
// Let's print rows 8 to 22 of Screen 0:
console.log('=== Screen 0 (X: 0..255) rows 8 to 22 ===');
for (let y = 8; y <= 22; y++) {
  const words = [];
  for (let x = 0; x < 32; x++) {
    const idx = 0x2000 + (y * 32 + x) * 2;
    const w = buf[idx] | (buf[idx+1] << 8);
    words.push(w === 0 ? '....' : (w & 0x3FF).toString(16).padStart(3, '0'));
  }
  console.log(`Y${y.toString().padStart(2,'0')}: ${words.join(' ')}`);
}

