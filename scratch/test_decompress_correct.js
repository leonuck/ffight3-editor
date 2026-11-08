const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function decompressCapcomCorrect(srcBuf, startOff) {
  let src = startOff;
  const typeByte = srcBuf[src++]; // at Y=0
  const headerWord = srcBuf[src] | (srcBuf[src+1] << 8); // at Y=1,2
  src += 2;
  const extraBits = headerWord & 7;
  let blockCount = headerWord >> 3;

  console.log(`Type: 0x${typeByte.toString(16)}, Header word: 0x${headerWord.toString(16)}, blockCount=${blockCount}, extraBits=${extraBits}`);

  const out = [];
  let bitCount = 0;
  let flagByte = 0;

  while (blockCount > 0) {
    if (bitCount === 0) {
      flagByte = srcBuf[src++];
      bitCount = 8;
    }
    const isLz = (flagByte & 1) !== 0;
    flagByte >>= 1;
    bitCount--;

    if (!isLz) {
      out.push(srcBuf[src++]);
    } else {
      const w = srcBuf[src] | (srcBuf[src+1] << 8);
      src += 2;
      const dist = (w & 0x0FFF) + 1;
      let len = (w >> 12);
      if (len === 0) {
        len = srcBuf[src++] + 0x11;
      } else {
        len += 1;
      }
      for (let k = 0; k < len; k++) {
        const copyByte = out[out.length - dist];
        out.push(copyByte !== undefined ? copyByte : 0);
      }
    }

    if (bitCount === 0) {
      blockCount--;
      if (blockCount === 0 && extraBits > 0) {
        bitCount = extraBits;
        flagByte = srcBuf[src++];
      }
    }
  }

  return { out: Buffer.from(out), bytesRead: src - startOff };
}

const offCA = 0x0A8A80 + h;
const res = decompressCapcomCorrect(rom, offCA);
console.log('Decompressed size:', res.out.length);
console.log('Compressed size read:', res.bytesRead);
fs.writeFileSync('scratch/bar_tilemap_correct.bin', res.out);

