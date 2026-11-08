const fs = require('fs');
const buf = fs.readFileSync('scratch/bar_tilemap_correct.bin');

// In Stage 7:
// Screen is 768px wide = 96 tiles wide (each tile is 8x8, or metatiles 16x16 = 48 metatiles).
// Let's check the size of the decompressed data:
// It's 21280 bytes.
// Where is BG1 tilemap (VRAM 0x4800)?
// GFX loader:
// DMA WRAM 7EA000 -> VRAM 0x4000 (len: 0x1000)
// DMA WRAM 7E8000 -> VRAM 0x4800 (len: 0x1000)
// So 7E:8000 is BG1 (len 0x1000 = 4096 bytes = 2048 words).
// 2048 words = 64x32 tiles (or 32x64 tiles).

console.log('BG1 tilemap at 7E:8000 (first 4096 bytes):');
const bg1 = buf.slice(0, 4096);
// Count how many non-zero words:
let nz = 0;
for (let i = 0; i < 4096; i += 2) {
  if (bg1[i] !== 0 || bg1[i+1] !== 0) nz++;
}
console.log(`BG1 non-zero words: ${nz} / 2048`);

console.log('BG2 tilemap at 7E:A000 (offset 0x2000 to 0x3000):');
const bg2 = buf.slice(0x2000, 0x3000);
let nz2 = 0;
for (let i = 0; i < 4096; i += 2) {
  if (bg2[i] !== 0 || bg2[i+1] !== 0) nz2++;
}
console.log(`BG2 non-zero words: ${nz2} / 2048`);

