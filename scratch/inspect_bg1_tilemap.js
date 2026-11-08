const fs = require('fs');
const buf = fs.readFileSync('scratch/bar_tilemap_correct.bin');
console.log('Total decompressed size:', buf.length);

// In SNES Mode 1:
// BG1 tilemap is 32x32 tiles (or 64x32 or 32x64).
// Each tile is 2 bytes (word): 10-bit tile index, 3-bit palette, priority, flipX, flipY.
// Let's examine the first 32 lines of 32 words (or 64 words)
console.log('Offset 0x0000 (first 128 bytes):');
for (let y = 0; y < 8; y++) {
  const line = buf.slice(y * 64, (y + 1) * 64);
  const words = [];
  for (let x = 0; x < line.length; x += 2) {
    words.push((line[x] | (line[x+1]<<8)).toString(16).padStart(4, '0'));
  }
  console.log(`Line ${y}: ${words.slice(0, 16).join(' ')}`);
}

