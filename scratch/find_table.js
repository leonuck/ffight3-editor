const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const TABLE = 0x00DF2; // wait, let's find TABLE in html
// let's check what TABLE is in html

