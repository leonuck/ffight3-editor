const fs = require('fs');
const buf = fs.readFileSync('scratch/bar_tilemap_correct.bin');

console.log('Examining offset 0x3000:');
for (let i = 0x3000; i < 0x3000 + 300; i += 32) {
  const slice = buf.slice(i, i + 32);
  const words = [];
  for (let j = 0; j < slice.length; j += 2) {
    words.push((slice[j] | (slice[j+1]<<8)).toString(16).padStart(4, '0'));
  }
  console.log(`+0x${i.toString(16)}: ${words.join(' ')}`);
}

