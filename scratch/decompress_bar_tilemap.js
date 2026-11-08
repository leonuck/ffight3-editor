const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function decompressCapcom(srcBuf, startOff) {
  let src = startOff;
  const headerWord = srcBuf[src] | (srcBuf[src+1] << 8);
  src += 2;
  const extraBits = headerWord & 7;
  let blockCount = headerWord >> 3;

  console.log(`Header word: 0x${headerWord.toString(16)}, blockCount=${blockCount}, extraBits=${extraBits}`);

  const out = [];
  let bitCount = 0;
  let flagByte = 0;

  while (blockCount > 0 || (blockCount === 0 && bitCount > 0)) {
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

  return Buffer.from(out);
}

const offCA = 0x0A8A80 + h;
try {
  const decomp = decompressCapcom(rom, offCA);
  console.log('Decompressed size:', decomp.length);
  console.log('First 64 bytes decompressed:');
  console.log(decomp.slice(0, 64).toString('hex').match(/../g).join(' '));
  fs.writeFileSync('scratch/bar_tilemap.bin', decomp);
  console.log('Saved to scratch/bar_tilemap.bin');
} catch (e) {
  console.error('Error during decompress:', e);
}

