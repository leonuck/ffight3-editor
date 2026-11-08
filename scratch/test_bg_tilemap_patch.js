const fs = require('fs');
const buf = fs.readFileSync('scratch/bar_tilemap_correct.bin');

// Check the table tiles in Screen 0 and Screen 1
// In Screen 0 (0x2000..0x3000):
// Row 21 (0x2000 + 21 * 64 = 0x2540):
// Let's print row 20, 21, 22
console.log('Row 21 bytes at 0x2540:');
const r21 = buf.slice(0x2540, 0x2580);
console.log(r21.toString('hex').match(/../g).join(' '));

// Notice the table tiles:
// 47 00 16 01 16 01 16 00 ... 47 00 16 01 16 01 eb 00
// These are the table words: 0x0116!
let count116 = 0;
for (let i = 0x2000; i < 0x4000; i += 2) {
  const w = buf[i] | (buf[i+1]<<8);
  if (w === 0x0116 || w === 0x0016 || w === 0x00EB || w === 0x0047) {
    count116++;
  }
}
console.log('Table and chair tile words in BG2 Screen 0 & 1:', count116);

