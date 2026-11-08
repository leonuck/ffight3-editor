const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function decompressCapcomLZ(srcBuf, startOff) {
  let src = startOff;
  // Let's read header
  // In C0:E81D:
  // a0 01 00 b7 00 c8 c8 -> reads word at offset 1 or 0?
  // Let's check header bytes
  console.log('First 16 bytes at source:', srcBuf.slice(src, src + 16).toString('hex').match(/../g).join(' '));
}

// Check CA:8A80
// In ROM: bank CA:8A80 -> (0xCA - 0xC0) * 0x10000 + 0x8A80 = 0x0A8A80
const offCA = 0x0A8A80 + h;
decompressCapcomLZ(rom, offCA);

