const fs = require('fs');
const files = fs.readdirSync('img').filter(f => f.endsWith('.png'));

files.forEach(f => {
  const buf = fs.readFileSync('img/' + f);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  console.log(`${f.padEnd(28)}: ${w} x ${h}`);
});

