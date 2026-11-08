const fs = require('fs');

// Simple PNG chunk reader to verify width, height, bit depth
const buf = fs.readFileSync('img/round_1_fase_1.png');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log('round_1_fase_1.png:', { width, height });

const buf2 = fs.readFileSync('img/round_1_fase_2.png');
console.log('round_1_fase_2.png:', { width: buf2.readUInt32BE(16), height: buf2.readUInt32BE(20) });

const buf3 = fs.readFileSync('img/round_1_fase_3_chefe.png');
console.log('round_1_fase_3_chefe.png:', { width: buf3.readUInt32BE(16), height: buf3.readUInt32BE(20) });

