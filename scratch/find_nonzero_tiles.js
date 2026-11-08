const fs = require('fs');
const buf = fs.readFileSync('scratch/bar_tilemap_correct.bin');

for (let i = 0; i < buf.length; i += 256) {
  const block = buf.slice(i, i + 256);
  const nonZero = block.filter(b => b !== 0).length;
  if (nonZero > 20) {
    console.log(`Offset 0x${i.toString(16)} (length 256): ${nonZero} non-zero bytes`);
  }
}

