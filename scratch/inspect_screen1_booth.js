const fs = require('fs');
const buf = fs.readFileSync('scratch/bar_tilemap_correct.bin');

// In Screen 1 of BG2 (at 0x3000):
// Booth 2 is around columns 280..370 px (tiles 35..46 -> column 3..14 of Screen 1)
// Let's print rows 8 to 24 of Screen 1
console.log('Screen 1 (X: 256..511) rows 10 to 22:');
for (let y = 10; y <= 22; y++) {
  const words = [];
  for (let x = 0; x < 32; x++) {
    const idx = 0x3000 + (y * 32 + x) * 2;
    const w = buf[idx] | (buf[idx+1] << 8);
    words.push(w === 0 ? '....' : (w & 0x3FF).toString(16).padStart(3, '0'));
  }
  console.log(`Y${y.toString().padStart(2,'0')}: ${words.join(' ')}`);
}

